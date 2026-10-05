import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isValidEmail, isValidPhone, sanitizeText } from "@/lib/auth";
import { sendCustomerEnquiryConfirmation, sendBusinessEnquiryNotification } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyCsrfOrigin, formatSafeErrorResponse } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    // 2. Rate Limiting (10 enquiries per 10 minutes per IP)
    const rateLimit = enforceRateLimit(request, "enquiry", {
      limit: 10,
      windowSeconds: 600,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      destination,
      travelDate,
      travelersCount,
      budgetRange,
      travelType,
      message,
      packageId,
    } = body;

    // 3. Server-Side Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Full Name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number with area/country code (7-15 digits)." },
        { status: 400 }
      );
    }

    if (!destination || typeof destination !== "string" || destination.trim().length < 2) {
      return NextResponse.json(
        { error: "Target destination is required." },
        { status: 400 }
      );
    }

    const count = parseInt(travelersCount, 10);
    if (isNaN(count) || count < 1) {
      return NextResponse.json(
        { error: "Number of travellers must be at least 1." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a message or travel details (minimum 10 characters)." },
        { status: 400 }
      );
    }

    // 2. Identify Authenticated User (if logged in)
    const currentUser = await getCurrentUser();
    const userId = currentUser ? currentUser.id : null;

    // 3. Generate Unique Enquiry ID: STT-ENQ-YYYY-RANDOM
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `STT-ENQ-${year}-${randomSuffix}`;

    const parsedDate = travelDate ? new Date(travelDate) : null;

    // 4. Save Enquiry into Database with Initial Admin Status "New"
    const enquiry = await prisma.enquiry.create({
      data: {
        referenceNo,
        userId,
        packageId: packageId || null,
        name: sanitizeText(name),
        email: email.trim().toLowerCase(),
        phone: sanitizeText(phone),
        destination: sanitizeText(destination),
        travelDate: parsedDate,
        travelersCount: count,
        budgetRange: budgetRange ? sanitizeText(budgetRange) : null,
        travelType: travelType ? sanitizeText(travelType) : null,
        subject: `Custom Enquiry for ${sanitizeText(destination)}`,
        message: sanitizeText(message),
        status: "New", // Phase 7 exact status: New, Contacted, In Progress, Quoted, Converted, Closed
      },
    });

    // 5. Send Customer Confirmation Email
    await sendCustomerEnquiryConfirmation({
      referenceNo,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      destination: enquiry.destination,
      travelDate: enquiry.travelDate,
      travelersCount: enquiry.travelersCount,
      budgetRange: enquiry.budgetRange,
      travelType: enquiry.travelType,
      message: enquiry.message,
    }).catch((err) => console.error("Customer confirmation email error:", err));

    // 6. Send Notification to Configured Business Email
    await sendBusinessEnquiryNotification({
      referenceNo,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      destination: enquiry.destination,
      travelDate: enquiry.travelDate,
      travelersCount: enquiry.travelersCount,
      budgetRange: enquiry.budgetRange,
      travelType: enquiry.travelType,
      message: enquiry.message,
      isCallback: false,
    }).catch((err) => console.error("Business notification email error:", err));

    // 7. Create User Account Notification (if user is logged in)
    if (userId) {
      await prisma.notification.create({
        data: {
          userId,
          title: `Enquiry Registered: ${referenceNo}`,
          message: `Your customized query for ${enquiry.destination} has been logged. Our concierge specialist will contact you shortly.`,
          type: "BOOKING",
          link: "/account?tab=enquiries",
        },
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      referenceNo,
      enquiryId: enquiry.id,
      message: "Your holiday enquiry has been successfully registered.",
      enquiry: {
        id: enquiry.id,
        referenceNo: enquiry.referenceNo,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        destination: enquiry.destination,
        travelDate: enquiry.travelDate,
        travelersCount: enquiry.travelersCount,
        budgetRange: enquiry.budgetRange,
        travelType: enquiry.travelType,
        message: enquiry.message,
        status: enquiry.status,
        createdAt: enquiry.createdAt,
      },
    });
  } catch (error) {
    return formatSafeErrorResponse(
      error,
      "An unexpected error occurred while submitting your enquiry. Please try again.",
      500
    );
  }
}
