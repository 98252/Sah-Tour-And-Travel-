import * as React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountDashboardClient } from "./account-dashboard-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account & Traveler Dashboard | Sah Tour And Travel",
  description:
    "Manage your booked itineraries, verified vouchers, saved holiday packages wishlist, and customized concierge travel enquiries.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  // Fetch full account dashboard data directly on the server
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
        booking: {
          select: { bookingReference: true },
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
      durationDays: pkg.durationDays,
      durationNights: pkg.durationNights,
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

  const dashboardData = {
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
  };

  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-sm text-slate-500">
          Loading your travel portal...
        </div>
      }
    >
      <AccountDashboardClient initialData={dashboardData} />
    </React.Suspense>
  );
}
