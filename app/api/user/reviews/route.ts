import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        userId: currentUser.id,
        isArchived: false,
      },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: { take: 1, select: { url: true } },
          },
        },
        booking: {
          select: {
            id: true,
            bookingReference: true,
            travelDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        status: r.status, // "Pending", "Approved", "Rejected"
        moderationNotes: r.moderationNotes,
        travelDate: r.travelDate?.toISOString() || null,
        photoUrl: r.photoUrl,
        packageName: r.package?.name,
        packageSlug: r.package?.slug,
        packageImage: r.package?.images?.[0]?.url || null,
        bookingReference: r.booking?.bookingReference || null,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("User reviews GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch customer reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { submitCustomerReview } = await import("@/lib/reviews");
    const body = await request.json();
    const review = await submitCustomerReview({
      userId: currentUser.id,
      packageId: body.packageId,
      bookingId: body.bookingId,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      photoUrl: body.photoUrl,
      travelDate: body.travelDate,
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted for quality moderation.",
      review,
    });
  } catch (error: any) {
    console.error("User reviews POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit customer review." },
      { status: 400 }
    );
  }
}
