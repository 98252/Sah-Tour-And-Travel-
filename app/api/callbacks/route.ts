import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isValidPhone, sanitizeText } from "@/lib/auth";
import { sendBusinessEnquiryNotification } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyCsrfOrigin, formatSafeErrorResponse } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    // 2. Rate Limiting (5 callback requests per 10 minutes per IP)
    const rateLimit = enforceRateLimit(request, "callback", {
      limit: 5,
      windowSeconds: 600,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const {
      name,
      phone,
      destination,
      preferredCallbackTime,
      message,
    } = body;

    // 3. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please provide a valid contact number (7-15 digits)." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();
    const userId = currentUser ? currentUser.id : null;
    const userEmail = currentUser?.email || "callback-request@sahtourandtravel.com";

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `STT-CB-${year}-${randomSuffix}`;

    const targetDestination = destination ? sanitizeText(destination) : "General Inquiry / Custom Tour";
    const note = message
      ? sanitizeText(message)
      : `Customer requested phone consultation during ${preferredCallbackTime || "Standard Hours"}.`;

    // 4. Save Callback Entry
    const enquiry = await prisma.enquiry.create({
      data: {
        referenceNo,
        userId,
        name: sanitizeText(name),
        email: userEmail,
        phone: sanitizeText(phone),
        destination: targetDestination,
        travelersCount: 2,
        subject: `[CALLBACK REQUEST] ${targetDestination}`,
        message: note,
        isCallback: true,
        preferredCallbackTime: preferredCallbackTime ? sanitizeText(preferredCallbackTime) : "Immediate (Next 15-30 mins)",
        status: "New",
      },
    });

    // 5. Send Business Notification Alert
    await sendBusinessEnquiryNotification({
      referenceNo,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      destination: enquiry.destination,
      travelersCount: 2,
      message: enquiry.message,
      isCallback: true,
      preferredCallbackTime: enquiry.preferredCallbackTime,
    }).catch((err) => console.error("Callback email alert error:", err));

    return NextResponse.json({
      success: true,
      referenceNo,
      message: "Callback request received. A dedicated travel counselor will call you at your preferred time.",
      callback: {
        referenceNo,
        phone: enquiry.phone,
        preferredTime: enquiry.preferredCallbackTime,
      },
    });
  } catch (error) {
    return formatSafeErrorResponse(
      error,
      "Failed to schedule callback. Please try calling our verified desk directly.",
      500
    );
  }
}
