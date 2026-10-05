import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminConsoleClient } from "./admin-console-client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Admin Operations Console | Sah Tour And Travel",
  description:
    "Enterprise administrative console with actual database metrics, RBAC, 14 operational modules, and immutable audit logs.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Production Security Guard: Server-side authentication & RBAC check
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth/login?redirect=/admin");
  }

  const role = currentUser.role === "ADMIN" ? "Admin" : currentUser.role === "AGENT" ? "Support Agent" : currentUser.role;
  if (!ADMIN_ROLES.includes(role as any)) {
    redirect("/account");
  }
  // Query verified database metrics directly from SQLite database (no fake statistics)
  const [
    totalBookings,
    confirmedBookings,
    paymentPendingBookings,
    cancelledBookings,
    revenueResult,
    totalCustomers,
    totalEnquiries,
    newEnquiries,
    inProgressEnquiries,
    convertedEnquiries,
    totalPackages,
    livePackages,
    totalDestinations,
    totalReviews,
    totalOffers,
    totalCoupons,
    totalContent,
    totalAudits,
    recentBookings,
    recentEnquiries,
    recentAudits,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "Confirmed" } }),
    prisma.booking.count({ where: { status: "Payment Pending" } }),
    prisma.booking.count({ where: { status: "Cancelled" } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    }),
    prisma.user.count({ where: { isArchived: false } }),
    prisma.enquiry.count({ where: { isArchived: false } }),
    prisma.enquiry.count({ where: { status: "New", isArchived: false } }),
    prisma.enquiry.count({ where: { status: "In Progress", isArchived: false } }),
    prisma.enquiry.count({ where: { status: "Converted", isArchived: false } }),
    prisma.package.count({ where: { isArchived: false } }),
    prisma.package.count({ where: { hasLiveAvailability: true, isArchived: false } }),
    prisma.destination.count({ where: { isArchived: false } }),
    prisma.review.count({ where: { isArchived: false } }),
    prisma.offer.count({ where: { isArchived: false } }),
    prisma.coupon.count({ where: { isArchived: false } }),
    prisma.contentItem.count({ where: { isArchived: false } }),
    prisma.auditLog.count(),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { package: { select: { name: true } } },
    }),
    prisma.enquiry.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const initialMetrics = {
    bookings: {
      total: totalBookings,
      confirmed: confirmedBookings,
      paymentPending: paymentPendingBookings,
      cancelled: cancelledBookings,
    },
    revenue: {
      totalAmount: revenueResult._sum.amount || 0,
      currency: "INR",
    },
    customers: {
      total: totalCustomers,
    },
    enquiries: {
      total: totalEnquiries,
      new: newEnquiries,
      inProgress: inProgressEnquiries,
      converted: convertedEnquiries,
    },
    packages: {
      total: totalPackages,
      liveAvailability: livePackages,
    },
    destinations: {
      total: totalDestinations,
    },
    reviews: { total: totalReviews },
    offers: { total: totalOffers },
    coupons: { total: totalCoupons },
    content: { total: totalContent },
    audits: { total: totalAudits },
  };

  const initialRecent = {
    bookings: recentBookings.map((b) => ({
      id: b.id,
      reference: b.bookingReference,
      customerName: b.customerName,
      packageName: b.package?.name || "Holiday Package",
      amount: b.totalAmount,
      currency: b.currency,
      status: b.status,
      paymentStatus: b.paymentStatus,
      date: b.createdAt.toISOString(),
    })),
    enquiries: recentEnquiries.map((e) => ({
      id: e.id,
      reference: e.referenceNo,
      customerName: e.name,
      destination: e.destination,
      status: e.status,
      date: e.createdAt.toISOString(),
    })),
    audits: recentAudits.map((a) => ({
      id: a.id,
      userName: a.userName,
      userRole: a.userRole,
      action: a.action,
      module: a.module,
      entityId: a.entityId,
      details: a.details,
      ipAddress: a.ipAddress,
      date: a.createdAt.toISOString(),
    })),
  };

  return (
    <AdminConsoleClient
      initialMetrics={initialMetrics}
      initialRecent={initialRecent}
    />
  );
}
