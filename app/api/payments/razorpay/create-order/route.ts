import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isValidEmail, isValidPhone, sanitizeText } from "@/lib/auth";
import { calculateBookingPrice, generateBookingReference, TravelerDetail } from "@/lib/booking";
import { createRazorpayOrder } from "@/lib/razorpay";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyCsrfOrigin, formatSafeErrorResponse } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    // 2. Rate Limiting (15 orders per minute per IP)
    const rateLimit = enforceRateLimit(request, "create-order", {
      limit: 15,
      windowSeconds: 60,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const {
      // For existing booking retry
      bookingReference,
      bookingId,
      // For new booking checkout
      packageId,
      packageSlug,
      travelDate,
      adultsCount = 1,
      childrenCount = 0,
      infantsCount = 0,
      customerName,
      customerEmail,
      customerPhone,
      travelers = [],
      selectedAddonIds = [],
      specialRequests,
    } = body;

    // CASE 1: Retrying payment for an existing booking
    if (bookingReference || bookingId) {
      const existingBooking = await prisma.booking.findFirst({
        where: bookingReference
          ? { bookingReference: String(bookingReference).trim().toUpperCase() }
          : { id: String(bookingId).trim() },
        include: {
          package: {
            select: {
              id: true,
              name: true,
              hasLiveAvailability: true,
              availableSlots: true,
            },
          },
        },
      });

      if (!existingBooking) {
        return NextResponse.json(
          { error: "Booking reference could not be found." },
          { status: 404 }
        );
      }

      if (existingBooking.status === "Confirmed" && existingBooking.paymentStatus === "PAID") {
        return NextResponse.json(
          { error: "This booking is already paid and confirmed." },
          { status: 400 }
        );
      }

      // Create Razorpay Order
      const rzpOrder = await createRazorpayOrder({
        amount: existingBooking.totalAmount,
        currency: existingBooking.currency || "INR",
        receipt: existingBooking.bookingReference,
        notes: {
          bookingId: existingBooking.id,
          bookingReference: existingBooking.bookingReference,
          customerName: existingBooking.customerName,
          customerEmail: existingBooking.customerEmail,
        },
      });

      // Update booking with the new razorpayOrderId
      await prisma.booking.update({
        where: { id: existingBooking.id },
        data: {
          razorpayOrderId: rzpOrder.id,
          paymentMethod: "RAZORPAY",
        },
      });

      return NextResponse.json({
        success: true,
        orderId: rzpOrder.id,
        amount: rzpOrder.amount, // in paise
        amountInRupees: existingBooking.totalAmount,
        currency: rzpOrder.currency,
        keyId: rzpOrder.keyId,
        bookingId: existingBooking.id,
        bookingReference: existingBooking.bookingReference,
        customer: {
          name: existingBooking.customerName,
          email: existingBooking.customerEmail,
          phone: existingBooking.customerPhone,
        },
        packageName: existingBooking.package.name,
      });
    }

    // CASE 2: New Booking Draft & Order Generation
    const pkg = await prisma.package.findFirst({
      where: packageId ? { id: packageId } : { slug: packageSlug },
      include: { destination: true },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Selected holiday package could not be found." },
        { status: 404 }
      );
    }

    // Live availability validation
    if (!pkg.hasLiveAvailability) {
      return NextResponse.json(
        {
          error:
            "This package does not have live allotment. Please use 'Request Availability' to confirm dates with our operations desk.",
          requiresAvailabilityRequest: true,
        },
        { status: 400 }
      );
    }

    const adults = Math.max(1, parseInt(adultsCount, 10) || 1);
    const children = Math.max(0, parseInt(childrenCount, 10) || 0);
    const infants = Math.max(0, parseInt(infantsCount, 10) || 0);
    const totalTravelers = adults + children + infants;

    const availableSlots = pkg.availableSlots ?? 0;
    if (availableSlots < totalTravelers) {
      return NextResponse.json(
        {
          error: `Only ${availableSlots} seats remain for this departure, but you requested ${totalTravelers}.`,
        },
        { status: 400 }
      );
    }

    if (!travelDate) {
      return NextResponse.json(
        { error: "Please select a valid departure travel date." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(travelDate);
    if (isNaN(parsedDate.getTime()) || parsedDate.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Please select a future travel departure date." },
        { status: 400 }
      );
    }

    if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
      return NextResponse.json(
        { error: "Lead customer name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid customer email address." },
        { status: 400 }
      );
    }

    if (!customerPhone || !isValidPhone(customerPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (7-15 digits)." },
        { status: 400 }
      );
    }

    // Sanitize passenger list
    const sanitizedTravelers: TravelerDetail[] = Array.isArray(travelers) && travelers.length > 0
      ? travelers.map((t: any) => ({
          type: t.type || "ADULT",
          title: t.title || "Mr",
          firstName: sanitizeText(t.firstName || "Traveler"),
          lastName: sanitizeText(t.lastName || ""),
          gender: t.gender || "Male",
          dateOfBirth: t.dateOfBirth ? sanitizeText(t.dateOfBirth) : undefined,
          passportNumber: t.passportNumber ? sanitizeText(t.passportNumber) : undefined,
          passportExpiry: t.passportExpiry ? sanitizeText(t.passportExpiry) : undefined,
          specialFoodPreference: t.specialFoodPreference
            ? sanitizeText(t.specialFoodPreference)
            : undefined,
        }))
      : [
          {
            type: "ADULT",
            title: "Mr",
            firstName: sanitizeText(customerName),
            lastName: "",
            gender: "Male",
          },
        ];

    // Transparent pricing calculation
    const pricing = calculateBookingPrice({
      basePricePerPerson: pkg.startingPrice,
      adultsCount: adults,
      childrenCount: children,
      infantsCount: infants,
      selectedAddonIds: Array.isArray(selectedAddonIds) ? selectedAddonIds : [],
    });

    const currentUser = await getCurrentUser();
    const userId = currentUser ? currentUser.id : null;
    const newBookingReference = generateBookingReference();

    // Create Razorpay Order with total amount in rupees
    const rzpOrder = await createRazorpayOrder({
      amount: pricing.totalAmount,
      currency: pricing.currency,
      receipt: newBookingReference,
      notes: {
        packageId: pkg.id,
        packageName: pkg.name,
        customerName: sanitizeText(customerName),
        customerEmail: customerEmail.trim().toLowerCase(),
      },
    });

    // Save initial Booking with "Payment Pending" and "PENDING"
    // NOT confirmed until verified by server!
    const draftBooking = await prisma.booking.create({
      data: {
        bookingReference: newBookingReference,
        userId,
        packageId: pkg.id,
        customerName: sanitizeText(customerName),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: sanitizeText(customerPhone),
        travelDate: parsedDate,
        adultsCount: adults,
        childrenCount: children,
        infantsCount: infants,
        travelersCount: totalTravelers,
        travelersJson: JSON.stringify(sanitizedTravelers),
        addonsJson: JSON.stringify(pricing.addonsList),
        addonsAmount: pricing.addonsAmount,
        basePrice: pricing.basePrice,
        taxesAmount: pricing.taxesAmount,
        feesAmount: pricing.feesAmount,
        totalAmount: pricing.totalAmount,
        currency: pricing.currency,
        status: "Payment Pending", // Important: Never Confirmed before payment verification
        paymentStatus: "PENDING",
        paymentMethod: "RAZORPAY",
        razorpayOrderId: rzpOrder.id,
        specialRequests: specialRequests ? sanitizeText(specialRequests) : null,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount, // in paise
      amountInRupees: pricing.totalAmount,
      currency: rzpOrder.currency,
      keyId: rzpOrder.keyId,
      bookingId: draftBooking.id,
      bookingReference: draftBooking.bookingReference,
      customer: {
        name: draftBooking.customerName,
        email: draftBooking.customerEmail,
        phone: draftBooking.customerPhone,
      },
      packageName: pkg.name,
    });
  } catch (error: any) {
    return formatSafeErrorResponse(
      error,
      "Failed to create payment order. Please try again.",
      500
    );
  }
}
