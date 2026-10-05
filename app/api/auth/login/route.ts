import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  isValidEmail,
  createSession,
} from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyCsrfOrigin, formatSafeErrorResponse } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    // 2. Rate Limiting (5 attempts per 15 minutes per IP to block brute force attacks)
    const rateLimit = enforceRateLimit(request, "login", {
      limit: 5,
      windowSeconds: 900,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 3. Fetch user
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.passwordHash) {
      // Unified constant-time error message to prevent user enumeration
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // 4. Verify password
    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // 5. Create Session
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress = request.headers.get("x-forwarded-for") || undefined;
    await createSession(user.id, userAgent, ipAddress);

    // Safe user payload (Zero secrets, zero hash)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      image: user.image,
      preferredLanguage: user.preferredLanguage,
      travelPreferences: user.travelPreferences,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      message: "Successfully signed in.",
      user: safeUser,
    });
  } catch (error) {
    return formatSafeErrorResponse(
      error,
      "An unexpected error occurred during sign in. Please try again.",
      500
    );
  }
}
