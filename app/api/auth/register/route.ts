import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  sanitizeText,
  createSession,
  createVerificationToken,
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

    // 2. Rate Limiting (Max 10 registrations per hour per IP)
    const rateLimit = enforceRateLimit(request, "registration", {
      limit: 10,
      windowSeconds: 3600,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      country,
      preferredLanguage,
      travelPreferences,
    } = body;

    // 3. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Full Name is required and must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const passCheck = isValidPassword(password);
    if (!passCheck.valid) {
      return NextResponse.json(
        { error: passCheck.message || "Password does not meet security criteria." },
        { status: 400 }
      );
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please provide a valid phone number (7-15 digits)." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 4. Check existing user
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    // 5. Hash password
    const passwordHash = await hashPassword(password);

    // 6. Create User
    const user = await prisma.user.create({
      data: {
        name: sanitizeText(name),
        email: cleanEmail,
        passwordHash,
        phone: phone ? sanitizeText(phone) : null,
        country: country ? sanitizeText(country) : "India",
        preferredLanguage: preferredLanguage ? sanitizeText(preferredLanguage) : "English",
        travelPreferences: travelPreferences
          ? Array.isArray(travelPreferences)
            ? travelPreferences.join(", ")
            : sanitizeText(travelPreferences)
          : "Luxury Escorted Tour, Beach & Island",
        role: "CUSTOMER",
      },
    });

    // 7. Generate email verification token (Dispatched to inbox, NOT leaked in API response)
    await createVerificationToken(user.id);

    // 8. Create Initial Welcome Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to Sah Tour And Travel!",
        message: "Your traveler account has been created. Explore our verified international and domestic holiday collections.",
        type: "INFO",
      },
    });

    // 9. Create Session
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress = request.headers.get("x-forwarded-for") || undefined;
    await createSession(user.id, userAgent, ipAddress);

    // Safe user payload (Zero secrets or password hash)
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
      message: "Registration successful. Welcome aboard!",
      user: safeUser,
    });
  } catch (error) {
    return formatSafeErrorResponse(
      error,
      "An unexpected server error occurred during registration. Please try again.",
      500
    );
  }
}
