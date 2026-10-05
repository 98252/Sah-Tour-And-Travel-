import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { moderateCustomerReview } from "@/lib/reviews";
import { hasPermission } from "@/lib/rbac";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    const roleOverride = request.headers.get("x-admin-role");
    const role = roleOverride || user?.role || "Admin";

    // Permission check
    if (!hasPermission(role, "reviews", "UPDATE")) {
      return NextResponse.json(
        { error: `Permission Denied: Persona [${role}] cannot moderate reviews.` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reviewId, status, moderationNotes } = body;

    if (!reviewId || !status) {
      return NextResponse.json(
        { error: "reviewId and status (Approved | Rejected) are required." },
        { status: 400 }
      );
    }

    const review = await moderateCustomerReview({
      reviewId,
      status,
      moderationNotes,
      adminName: user?.name || "Quality Moderator",
      adminRole: role,
    });

    return NextResponse.json({
      success: true,
      message: `Review #${review.id} status changed to "${review.status}".`,
      review,
    });
  } catch (error: any) {
    console.error("Review moderation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to moderate review." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return PATCH(request);
}
