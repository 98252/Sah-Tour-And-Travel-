import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidEmail, createPasswordResetToken } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyCsrfOrigin, formatSafeErrorResponse } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    // 2. Rate Limiting (5 requests per 15 minutes per IP)
    const rateLimit = enforceRateLimit(request, "forgot-password", {
      limit: 5,
      windowSeconds: 900,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const { email } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user) {
      // Token is created and will be sent via verified email service
      // NEVER leaked in HTTP response!
      await createPasswordResetToken(user.id);
    }

    // Always return the exact same generic message to prevent account enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been dispatched.",
    });
  } catch (error) {
    return formatSafeErrorResponse(
      error,
      "An unexpected error occurred. Please try again.",
      500
    );
  }
}
