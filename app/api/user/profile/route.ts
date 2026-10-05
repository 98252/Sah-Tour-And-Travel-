import { NextResponse } from "next/server";
import { getCurrentUser, isValidPhone, sanitizeText } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyCsrfOrigin, isValidSafeImageUrl, formatSafeErrorResponse } from "@/lib/security";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return formatSafeErrorResponse(error, "Failed to retrieve user profile.", 500);
  }
}

export async function PUT(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    // 2. Auth Check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Rate Limiting (10 profile updates per 10 minutes)
    const rateLimit = enforceRateLimit(request, "profile-update", {
      limit: 10,
      windowSeconds: 600,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const {
      name,
      phone,
      country,
      image,
      preferredLanguage,
      travelPreferences,
    } = body;

    // 4. Validation
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) {
        return NextResponse.json(
          { error: "Name must be at least 2 characters long." },
          { status: 400 }
        );
      }
    }

    if (phone !== undefined && phone !== null && phone !== "") {
      if (!isValidPhone(phone)) {
        return NextResponse.json(
          { error: "Invalid phone number format." },
          { status: 400 }
        );
      }
    }

    if (image !== undefined && image !== null && image !== "") {
      if (!isValidSafeImageUrl(image)) {
        return NextResponse.json(
          { error: "Invalid image URL format. Please provide a safe image URL." },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name ? { name: sanitizeText(name) } : {}),
        ...(phone !== undefined ? { phone: phone ? sanitizeText(phone) : null } : {}),
        ...(country !== undefined ? { country: country ? sanitizeText(country) : null } : {}),
        ...(image !== undefined ? { image: image ? image.trim() : null } : {}),
        ...(preferredLanguage ? { preferredLanguage: sanitizeText(preferredLanguage) } : {}),
        ...(travelPreferences !== undefined
          ? {
              travelPreferences: Array.isArray(travelPreferences)
                ? travelPreferences.join(", ")
                : sanitizeText(travelPreferences),
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        image: true,
        preferredLanguage: true,
        travelPreferences: true,
        role: true,
        emailVerified: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Notify user of profile change
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Profile Updated",
        message: "Your profile information and travel preferences have been updated.",
        type: "INFO",
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return formatSafeErrorResponse(error, "Failed to update profile. Please try again.", 500);
  }
}
