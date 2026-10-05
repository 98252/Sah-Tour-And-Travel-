import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Get live counts for badge updates
    const [wishlistCount, bookingsCount, unreadNotifications] = await Promise.all([
      prisma.wishlistItem.count({ where: { userId: user.id } }),
      prisma.booking.count({ where: { userId: user.id } }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    ]);

    return NextResponse.json({
      user,
      counts: {
        wishlist: wishlistCount,
        bookings: bookingsCount,
        unreadNotifications,
      },
    });
  } catch (error) {
    console.error("Error fetching current user session:", error);
    return NextResponse.json({ user: null });
  }
}
