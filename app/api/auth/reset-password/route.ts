import { NextResponse } from "next/server";
import { resetPasswordWithToken, isValidPassword } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyCsrfOrigin, formatSafeErrorResponse } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    // 2. Rate Limiting (5 attempts per 15 minutes)
    const rateLimit = enforceRateLimit(request, "reset-password", {
      limit: 5,
      windowSeconds: 900,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing password reset token." },
        { status: 400 }
      );
    }

    const passCheck = isValidPassword(password);
    if (!passCheck.valid) {
      return NextResponse.json(
        { error: passCheck.message || "Password must be at least 8 characters with letters and numbers." },
        { status: 400 }
      );
    }

    const result = await resetPasswordWithToken(token.trim(), password);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return formatSafeErrorResponse(
      error,
      "An unexpected error occurred while resetting your password.",
      500
    );
  }
}
