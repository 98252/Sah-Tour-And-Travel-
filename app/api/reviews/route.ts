import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getApprovedReviews, submitCustomerReview } from "@/lib/reviews";
import { enforceRateLimit } from "@/lib/rate-limit";
import { verifyCsrfOrigin, isValidSafeImageUrl, formatSafeErrorResponse } from "@/lib/security";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId") || searchParams.get("slug") || undefined;

    // Enforce: ONLY approved reviews appear publicly
    const result = await getApprovedReviews(packageId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to retrieve approved reviews.", 500);
  }
}

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    // 2. Authentication check
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to submit a review." },
        { status: 401 }
      );
    }

    // 3. Rate Limiting (5 reviews per 10 minutes)
    const rateLimit = enforceRateLimit(request, "reviews", {
      limit: 5,
      windowSeconds: 600,
    });
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    const body = await request.json();
    const { packageId, bookingId, rating, title, comment, photoUrl, travelDate } = body;

    if (!packageId) {
      return NextResponse.json(
        { error: "Holiday package identifier is required." },
        { status: 400 }
      );
    }

    // 4. URL Validation for optional photo attachment
    if (photoUrl && !isValidSafeImageUrl(photoUrl)) {
      return NextResponse.json(
        { error: "Invalid photo URL format. Please provide a valid, safe image link." },
        { status: 400 }
      );
    }

    // 5. Submit review with completed booking eligibility enforcement
    const review = await submitCustomerReview({
      userId: currentUser.id,
      packageId,
      bookingId,
      rating,
      title,
      comment,
      photoUrl,
      travelDate,
    });

    return NextResponse.json({
      success: true,
      message:
        "Your verified review has been submitted for moderation. It will be published publicly upon quality desk approval.",
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        status: review.status, // "Pending"
        packageName: review.package.name,
        createdAt: review.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    // If it's a known eligibility rejection message, return friendly 400
    if (typeof error?.message === "string" && error.message.includes("Eligibility check failed")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return formatSafeErrorResponse(error, "Failed to submit review.", 500);
  }
}
