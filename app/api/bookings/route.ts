import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isValidEmail, isValidPhone, sanitizeText } from "@/lib/auth";
import {
  calculateBookingPrice,
  generateBookingReference,
  generateTransactionId,
  TravelerDetail,
} from "@/lib/booking";
import {
  sendCustomerBookingConfirmation,
  sendBusinessBookingNotification,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
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
      paymentMethod = "UPI",
    } = body;

    // 1. Validate Target Package
    const pkg = await prisma.package.findFirst({
      where: packageId ? { id: packageId } : { slug: packageSlug },
      include: {
        destination: true,
        source: true,
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Selected holiday package could not be found." },
        { status: 404 }
      );
    }

    // 2. CRUCIAL AVAILABILITY GATE: Do not accept booking for unavailable inventory!
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

    const adults = parseInt(adultsCount, 10) || 1;
    const children = parseInt(childrenCount, 10) || 0;
    const infants = parseInt(infantsCount, 10) || 0;
    const totalTravelers = adults + children + infants;

    if (adults < 1) {
      return NextResponse.json(
        { error: "At least one adult (age 12+) is required for booking." },
        { status: 400 }
      );
    }

    const availableSlots = pkg.availableSlots ?? 0;
    if (availableSlots < totalTravelers) {
      return NextResponse.json(
        {
          error: `Only ${availableSlots} seats remain for this departure, but you requested ${totalTravelers}. Please reduce your party size or request an allotment expansion.`,
        },
        { status: 400 }
      );
    }

    // 3. Validate Travel Date
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

    // 4. Validate Lead Customer Contact
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

    // 5. Validate Travelers Array
    if (!Array.isArray(travelers) || travelers.length === 0) {
      return NextResponse.json(
        { error: "Passenger information must be provided for all travelers." },
        { status: 400 }
      );
    }

    const sanitizedTravelers: TravelerDetail[] = travelers.map((t: any) => ({
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
    }));

    // 6. Transparent Price Calculation
    const pricing = calculateBookingPrice({
      basePricePerPerson: pkg.startingPrice,
      adultsCount: adults,
      childrenCount: children,
      infantsCount: infants,
      selectedAddonIds: Array.isArray(selectedAddonIds) ? selectedAddonIds : [],
    });

    // 7. Determine Authenticated User (if logged in)
    const currentUser = await getCurrentUser();
    const userId = currentUser ? currentUser.id : null;

    // 8. Generate Unique Booking ID & Payment Details
    const bookingReference = generateBookingReference();
    const transactionId = generateTransactionId();

    const isPayAtDesk = paymentMethod === "PAY_AT_DESK";
    // Exact 5 statuses: "Pending", "Payment Pending", "Confirmed", "Cancelled", "Completed"
    const bookingStatus = isPayAtDesk ? "Payment Pending" : "Confirmed";
    const paymentStatus = isPayAtDesk ? "PENDING" : "PAID";

    // 9. Database Transaction: Save Booking, Deduct Slots, Create Payment
    const booking = await prisma.$transaction(async (tx) => {
      // Create Booking record
      const createdBooking = await tx.booking.create({
        data: {
          bookingReference,
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
          status: bookingStatus,
          paymentStatus,
          paymentMethod: sanitizeText(paymentMethod),
          transactionId,
          specialRequests: specialRequests ? sanitizeText(specialRequests) : null,
        },
      });

      // Create Payment record
      await tx.payment.create({
        data: {
          transactionId,
          userId,
          bookingId: createdBooking.id,
          amount: pricing.totalAmount,
          currency: pricing.currency,
          paymentMethod: sanitizeText(paymentMethod),
          status: isPayAtDesk ? "PENDING" : "SUCCESS",
        },
      });

      // Decrement available slots on package
      await tx.package.update({
        where: { id: pkg.id },
        data: {
          availableSlots: Math.max(0, availableSlots - totalTravelers),
        },
      });

      return createdBooking;
    });

    // 10. Send Confirmation Emails
    const emailPayload = {
      bookingReference: booking.bookingReference,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      packageName: pkg.name,
      destination: pkg.destination.name,
      travelDate: booking.travelDate,
      adultsCount: booking.adultsCount,
      childrenCount: booking.childrenCount,
      infantsCount: booking.infantsCount,
      travelersCount: booking.travelersCount,
      basePrice: booking.basePrice,
      taxesAmount: booking.taxesAmount,
      feesAmount: booking.feesAmount,
      addonsAmount: booking.addonsAmount,
      totalAmount: booking.totalAmount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      transactionId: booking.transactionId,
    };

    await sendCustomerBookingConfirmation(emailPayload).catch((err) =>
      console.error("Customer booking confirmation email error:", err)
    );

    await sendBusinessBookingNotification(emailPayload).catch((err) =>
      console.error("Business booking notification email error:", err)
    );

    // 11. Create In-App Notification if user is logged in
    if (userId) {
      await prisma.notification
        .create({
          data: {
            userId,
            title: `Tour Booked: ${booking.bookingReference}`,
            message: `Your reservation for ${pkg.name} is confirmed for ${parsedDate.toDateString()}. Total: ₹${booking.totalAmount.toLocaleString("en-IN")}.`,
            type: "BOOKING",
            link: "/account?tab=bookings",
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "Booking successfully created and allotment reserved.",
      bookingReference: booking.bookingReference,
      booking: {
        id: booking.id,
        bookingReference: booking.bookingReference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        travelDate: booking.travelDate,
        travelersCount: booking.travelersCount,
        transactionId: booking.transactionId,
        createdAt: booking.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process booking. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: currentUser.id },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            slug: true,
            durationText: true,
            images: { take: 1, select: { url: true } },
            destination: { select: { name: true } },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("User bookings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}
