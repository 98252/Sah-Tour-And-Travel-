import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkReviewEligibility } from "@/lib/reviews";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({
        eligible: false,
        eligibleBookings: [],
        message: "Sign in to check review eligibility for completed tours.",
      });
    }

    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId") || undefined;

    const result = await checkReviewEligibility(currentUser.id, packageId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Review eligibility error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to check eligibility." },
      { status: 500 }
    );
  }
}
