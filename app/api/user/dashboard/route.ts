import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      dbUser,
      bookings,
      wishlistItems,
      enquiries,
      payments,
      reviews,
      notifications,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
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
        },
      }),
      prisma.booking.findMany({
        where: { userId: user.id },
        include: {
          package: {
            include: {
              destination: true,
              images: true,
            },
          },
        },
        orderBy: { travelDate: "desc" },
      }),
      prisma.wishlistItem.findMany({
        where: { userId: user.id },
        include: {
          package: {
            include: {
              destination: true,
              source: true,
              images: true,
              hotels: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.enquiry.findMany({
        where: { userId: user.id },
        include: {
          package: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.findMany({
        where: { userId: user.id },
        include: {
          booking: {
            select: { bookingReference: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.findMany({
        where: { userId: user.id },
        include: {
          package: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const formattedWishlist = wishlistItems.map((item) => {
      const pkg = item.package;
      return {
        id: pkg.id,
        name: pkg.name,
        slug: pkg.slug,
        durationText: pkg.durationText,
        travelStyle: pkg.travelStyle,
        startingPrice: pkg.startingPrice,
        currency: pkg.currency,
        priceType: pkg.priceType,
        departureCity: pkg.departureCity,
        mealPlan: pkg.mealPlan,
        shortDescription: pkg.shortDescription,
        highlights: JSON.parse(pkg.highlightsJson || "[]"),
        destination: pkg.destination,
        source: pkg.source,
        images: pkg.images,
        hotels: pkg.hotels,
        savedAt: item.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      profile: dbUser,
      bookings,
      wishlist: formattedWishlist,
      enquiries,
      payments,
      reviews,
      notifications,
      stats: {
        totalBookings: bookings.length,
        totalWishlist: formattedWishlist.length,
        totalEnquiries: enquiries.length,
        totalPayments: payments.length,
        unreadNotifications: notifications.filter((n) => !n.isRead).length,
      },
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data." },
      { status: 500 }
    );
  }
}
