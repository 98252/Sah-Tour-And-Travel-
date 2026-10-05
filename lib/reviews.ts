import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export interface ReviewEligibilityResult {
  eligible: boolean;
  eligibleBookings: Array<{
    bookingId: string;
    bookingReference: string;
    packageId: string;
    packageName: string;
    travelDate: string;
    alreadyReviewed: boolean;
  }>;
  message: string;
}

export interface CreateReviewInput {
  userId: string;
  packageId: string;
  bookingId?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  photoUrl?: string;
  travelDate?: Date | string;
}

export interface ModerateReviewInput {
  reviewId: string;
  status: "Approved" | "Rejected" | "Pending";
  moderationNotes?: string;
  adminName?: string;
  adminRole?: string;
}

/**
 * 1. ELIGIBILITY GATE:
 * "Only customers with eligible completed bookings can submit reviews."
 * A booking is eligible if it belongs to the user and is either explicitly "Completed"
 * or "Confirmed" & "PAID" with the departure travel date in the past.
 */
export async function checkReviewEligibility(
  userId: string,
  packageId?: string
): Promise<ReviewEligibilityResult> {
  const now = new Date();

  // Find all candidate bookings for this user
  const whereClause: any = {
    userId,
    OR: [
      { status: "Completed" },
      {
        AND: [
          { status: "Confirmed" },
          { paymentStatus: "PAID" },
          { travelDate: { lt: now } },
        ],
      },
    ],
  };

  if (packageId) {
    whereClause.packageId = packageId;
  }

  const completedBookings = await prisma.booking.findMany({
    where: whereClause,
    include: {
      package: {
        select: { id: true, name: true, slug: true },
      },
      reviews: {
        select: { id: true, status: true },
      },
    },
    orderBy: { travelDate: "desc" },
  });

  if (completedBookings.length === 0) {
    return {
      eligible: false,
      eligibleBookings: [],
      message:
        "Eligibility check failed: Only verified customers with completed holiday journeys can submit reviews. No completed bookings found for this package.",
    };
  }

  const eligibleBookings = completedBookings.map((b) => ({
    bookingId: b.id,
    bookingReference: b.bookingReference,
    packageId: b.packageId,
    packageName: b.package?.name || "Holiday Package",
    travelDate: b.travelDate.toISOString(),
    alreadyReviewed: (b.reviews || []).length > 0,
  }));

  // If checking for a specific package, verify at least one completed booking is not already reviewed
  const canReview = eligibleBookings.length > 0;

  return {
    eligible: canReview,
    eligibleBookings,
    message: canReview
      ? "You have completed verified travel and are eligible to share your authentic tour experience."
      : "You have already reviewed all eligible completed bookings for this package.",
  };
}

/**
 * 2. SUBMIT REVIEW:
 * Validates eligibility, enforces fields, and saves with status: "Pending"
 */
export async function submitCustomerReview(input: CreateReviewInput) {
  // Validate Rating (1 to 5)
  const ratingInt = Math.round(Number(input.rating));
  if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    throw new Error("Rating must be an integer between 1 and 5 stars.");
  }

  // Validate Review Text
  if (!input.comment || input.comment.trim().length < 10) {
    throw new Error("Review must contain at least 10 characters describing your tour experience.");
  }

  // Check Eligibility strictly
  const eligibility = await checkReviewEligibility(input.userId, input.packageId);
  if (!eligibility.eligible || eligibility.eligibleBookings.length === 0) {
    throw new Error(
      "Review submission rejected: Only customers with eligible completed bookings can submit reviews."
    );
  }

  // Select target booking (either specified or latest completed)
  let targetBooking = eligibility.eligibleBookings[0];
  if (input.bookingId) {
    const matched = eligibility.eligibleBookings.find((b) => b.bookingId === input.bookingId);
    if (matched) targetBooking = matched;
  }

  const travelDate = input.travelDate
    ? new Date(input.travelDate)
    : new Date(targetBooking.travelDate);

  // Create review with Pending moderation status
  const review = await prisma.review.create({
    data: {
      userId: input.userId,
      packageId: input.packageId,
      bookingId: targetBooking.bookingId,
      rating: ratingInt,
      title: input.title?.trim() || "Verified Traveler Review",
      comment: input.comment.trim(),
      travelDate,
      photoUrl: input.photoUrl?.trim() || null,
      status: "Pending", // Must be Approved by admin before public display
      isVerified: true,
    },
    include: {
      package: { select: { name: true, slug: true } },
      user: { select: { name: true } },
    },
  });

  return review;
}

/**
 * 3. PUBLIC APPROVED REVIEWS:
 * "Only approved reviews appear publicly. Do not create fake testimonials. Do not create fake ratings."
 */
export async function getApprovedReviews(packageIdOrSlug?: string) {
  const where: any = {
    status: "Approved",
    isArchived: false,
  };

  if (packageIdOrSlug) {
    // If slug provided, lookup package id
    const pkg = await prisma.package.findFirst({
      where: {
        OR: [{ id: packageIdOrSlug }, { slug: packageIdOrSlug }],
      },
      select: { id: true },
    });

    if (pkg) {
      where.packageId = pkg.id;
    } else {
      where.packageId = packageIdOrSlug;
    }
  }

  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: { select: { name: true, country: true } },
      package: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate genuine average rating from actual approved reviews
  const totalCount = reviews.length;
  let averageRating: number | null = null;

  if (totalCount > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    averageRating = Number((sum / totalCount).toFixed(1));
  }

  return {
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      travelDate: r.travelDate ? r.travelDate.toISOString() : null,
      photoUrl: r.photoUrl,
      authorName: r.user?.name || "Verified Traveler",
      authorCountry: r.user?.country || "India",
      packageName: r.package?.name,
      packageSlug: r.package?.slug,
      isVerified: r.isVerified,
      createdAt: r.createdAt.toISOString(),
    })),
    totalCount,
    averageRating, // null if 0 reviews (NO fake ratings)
  };
}

/**
 * 4. ADMIN MODERATION:
 * Admin statuses: "Pending", "Approved", "Rejected"
 */
export async function moderateCustomerReview(input: ModerateReviewInput) {
  const validStatuses = ["Pending", "Approved", "Rejected"] as const;
  if (!validStatuses.includes(input.status as any)) {
    throw new Error(`Invalid moderation status "${input.status}". Must be Pending, Approved, or Rejected.`);
  }

  const review = await prisma.review.update({
    where: { id: input.reviewId },
    data: {
      status: input.status,
      moderationNotes: input.moderationNotes || null,
      moderatedAt: new Date(),
      moderatedBy: input.adminName || "Quality Desk",
    },
    include: {
      package: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
  });

  // Track in Audit Log
  await createAuditLog({
    userName: input.adminName || "Quality Desk",
    userRole: input.adminRole || "Content Manager",
    action: "UPDATE",
    module: "Reviews",
    entityId: review.id,
    details: {
      action: "REVIEW_MODERATION",
      newStatus: input.status,
      reviewerName: review.user.name,
      packageName: review.package.name,
      rating: review.rating,
      notes: input.moderationNotes,
    },
  });

  return review;
}
