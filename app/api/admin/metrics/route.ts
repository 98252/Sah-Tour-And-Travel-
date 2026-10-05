import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, formatSafeErrorResponse } from "@/lib/security";

export async function GET(request: Request) {
  try {
    const authCheck = await requireAdminSession(request);
    if (!authCheck.success) {
      return authCheck.response;
    }

    // Query actual, verified metrics from database
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
      // Bookings counts
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "Confirmed" } }),
      prisma.booking.count({ where: { status: "Payment Pending" } }),
      prisma.booking.count({ where: { status: "Cancelled" } }),

      // Revenue from paid payments
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESS" },
      }),

      // Customers
      prisma.user.count({ where: { isArchived: false } }),

      // Enquiries
      prisma.enquiry.count({ where: { isArchived: false } }),
      prisma.enquiry.count({ where: { status: "New", isArchived: false } }),
      prisma.enquiry.count({ where: { status: "In Progress", isArchived: false } }),
      prisma.enquiry.count({ where: { status: "Converted", isArchived: false } }),

      // Packages & Allotment
      prisma.package.count({ where: { isArchived: false } }),
      prisma.package.count({ where: { hasLiveAvailability: true, isArchived: false } }),

      // Destinations
      prisma.destination.count({ where: { isArchived: false } }),

      // Other modules
      prisma.review.count({ where: { isArchived: false } }),
      prisma.offer.count({ where: { isArchived: false } }),
      prisma.coupon.count({ where: { isArchived: false } }),
      prisma.contentItem.count({ where: { isArchived: false } }),
      prisma.auditLog.count(),

      // Recent Records for Dashboard
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          package: { select: { name: true } },
        },
      }),

      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),

      prisma.auditLog.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          paymentPending: paymentPendingBookings,
          cancelled: cancelledBookings,
        },
        revenue: {
          totalAmount: totalRevenue,
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
      },
      recent: {
        bookings: recentBookings.map((b) => ({
          id: b.id,
          reference: b.bookingReference,
          customerName: b.customerName,
          packageName: b.package?.name,
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
          details: a.details,
          date: a.createdAt.toISOString(),
        })),
      },
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to calculate database metrics.", 500);
  }
}
