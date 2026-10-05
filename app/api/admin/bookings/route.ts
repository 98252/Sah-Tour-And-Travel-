import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/auth";
import { VALID_BOOKING_STATUSES, BookingStatus } from "@/lib/booking";
import { requireAdminSession, formatSafeErrorResponse } from "@/lib/security";
import { createAuditLog } from "@/lib/audit";

export async function GET(request: Request) {
  try {
    const authCheck = await requireAdminSession(request, ["Admin", "Travel Manager", "Support Agent"]);
    if (!authCheck.success) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = (searchParams.get("search") || "").trim();

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { bookingReference: { contains: search } },
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { customerPhone: { contains: search } },
        { package: { name: { contains: search } } },
      ];
    }

    const [bookings, statusCounts] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          package: {
            select: {
              id: true,
              name: true,
              slug: true,
              destination: { select: { name: true } },
            },
          },
          payments: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      Promise.all(
        VALID_BOOKING_STATUSES.map(async (st) => ({
          status: st,
          count: await prisma.booking.count({ where: { status: st } }),
        }))
      ),
    ]);

    const totalCount = await prisma.booking.count();

    return NextResponse.json({
      success: true,
      totalCount,
      statusCounts,
      bookings,
    });
  } catch (error) {
    return formatSafeErrorResponse(error, "Failed to fetch bookings for administration.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const authCheck = await requireAdminSession(request, ["Admin", "Travel Manager", "Support Agent"]);
    if (!authCheck.success) {
      return authCheck.response;
    }

    const body = await request.json();
    const { id, status, paymentStatus, agentNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    if (status && !VALID_BOOKING_STATUSES.includes(status as BookingStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_BOOKING_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (agentNotes !== undefined) updateData.agentNotes = sanitizeText(agentNotes);

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        package: true,
      },
    });

    // Audit log
    await createAuditLog({
      userId: authCheck.user.id,
      userName: authCheck.user.name,
      userRole: authCheck.role,
      action: "UPDATE",
      module: "bookings",
      entityId: id,
      details: {
        bookingReference: updatedBooking.bookingReference,
        status: updatedBooking.status,
        paymentStatus: updatedBooking.paymentStatus,
      },
    });

    // Notify user if linked
    if (updatedBooking.userId && status) {
      await prisma.notification
        .create({
          data: {
            userId: updatedBooking.userId,
            title: `Booking Update: ${updatedBooking.bookingReference}`,
            message: `Your booking status for ${updatedBooking.package.name} has been updated to "${updatedBooking.status}".`,
            type: "BOOKING",
            link: "/account?tab=bookings",
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: `Booking updated to "${updatedBooking.status}".`,
      booking: updatedBooking,
    });
  } catch (error) {
    return formatSafeErrorResponse(error, "Failed to update booking status.", 500);
  }
}
