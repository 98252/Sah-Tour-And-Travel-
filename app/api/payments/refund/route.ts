import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initiateRazorpayRefund } from "@/lib/razorpay";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/rbac";
import { requireAdminSession, verifyCsrfOrigin, formatSafeErrorResponse } from "@/lib/security";
import { createAuditLog } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    const body = await request.json();
    const {
      paymentId,
      bookingReference,
      bookingId,
      amount,
      reason = "Traveler cancellation requested",
      adminNotes,
    } = body;

    if (!paymentId && !bookingReference && !bookingId) {
      return NextResponse.json(
        {
          error:
            "Please provide paymentId, bookingReference, or bookingId to process a refund.",
        },
        { status: 400 }
      );
    }

    // 2. Authorization check: Staff session OR verified booking cancellation credentials
    const currentUser = await getCurrentUser();
    const isStaff = currentUser && ["Admin", "Travel Manager"].includes(currentUser.role);
    const isDevStaffOverride =
      process.env.NODE_ENV !== "production" &&
      ["Admin", "Travel Manager"].includes(request.headers.get("x-admin-role") || "");

    // Customer cancellation check: must provide both paymentId AND matching bookingReference
    const hasBookingCredentials = Boolean(paymentId && (bookingReference || bookingId));

    if (!isStaff && !isDevStaffOverride && !hasBookingCredentials) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in with staff credentials or provide verified booking reference." },
        { status: 401 }
      );
    }

    // 3. Find the original payment record
    const payment = await prisma.payment.findFirst({
      where: paymentId
        ? {
            OR: [
              { razorpayPaymentId: paymentId },
              { transactionId: paymentId },
              { id: paymentId },
            ],
          }
        : bookingReference
        ? { booking: { bookingReference } }
        : { bookingId },
      include: {
        booking: {
          include: {
            package: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record for refund could not be found." },
        { status: 404 }
      );
    }

    // If caller is not staff, verify that bookingReference strictly matches
    if (!isStaff && !isDevStaffOverride) {
      if (
        bookingReference &&
        payment.booking?.bookingReference.toUpperCase() !== String(bookingReference).trim().toUpperCase()
      ) {
        return NextResponse.json(
          { error: "Access Denied: Booking reference mismatch." },
          { status: 403 }
        );
      }
    }

    if (payment.status === "REFUNDED") {
      return NextResponse.json(
        {
          error: `Payment was already refunded on ${payment.refundedAt?.toISOString() || "record"}. Refund ID: ${payment.refundId}`,
          refundId: payment.refundId,
        },
        { status: 400 }
      );
    }

    if (payment.status !== "SUCCESS") {
      return NextResponse.json(
        {
          error: `Cannot refund a payment with status "${payment.status}". Only successful payments can be refunded.`,
        },
        { status: 400 }
      );
    }

    const targetPaymentId = payment.razorpayPaymentId || payment.transactionId;
    const refundAmount = amount && amount > 0 ? Number(amount) : payment.amount;

    if (refundAmount > payment.amount) {
      return NextResponse.json(
        {
          error: `Refund amount (₹${refundAmount}) cannot exceed original payment amount (₹${payment.amount}).`,
        },
        { status: 400 }
      );
    }

    // 4. Initiate Razorpay Refund
    const refundResult = await initiateRazorpayRefund({
      paymentId: targetPaymentId,
      amount: refundAmount,
      reason,
      notes: {
        bookingReference: payment.booking?.bookingReference || "",
        bookingId: payment.bookingId || "",
        adminNotes: adminNotes || "",
      },
    });

    // 5. Update Database in Transaction
    const updatedPayment = await prisma.$transaction(async (tx) => {
      const p = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "REFUNDED",
          refundId: refundResult.refundId,
          refundAmount,
          refundStatus: refundResult.status,
          refundReason: reason,
          refundedAt: new Date(),
        },
      });

      if (payment.bookingId) {
        await tx.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: "Cancelled",
            paymentStatus: "REFUNDED",
          },
        });

        if (payment.booking?.packageId) {
          const pkg = await tx.package.findUnique({
            where: { id: payment.booking.packageId },
            select: { availableSlots: true },
          });

          if (pkg && pkg.availableSlots !== null) {
            await tx.package.update({
              where: { id: payment.booking.packageId },
              data: {
                availableSlots: pkg.availableSlots + payment.booking.travelersCount,
              },
            });
          }
        }
      }

      return p;
    });

    // 6. Record immutable audit log
    await createAuditLog({
      userId: currentUser?.id || null,
      userName: currentUser?.name || (isStaff ? "Staff Member" : "Customer (Self-Cancellation)"),
      userRole: currentUser?.role || (isStaff ? "Admin" : "CUSTOMER"),
      action: "UPDATE",
      module: "bookings",
      entityId: payment.id,
      details: {
        action: "REFUND_PROCESSED",
        refundId: refundResult.refundId,
        refundAmount,
        bookingReference: payment.booking?.bookingReference,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Refund has been processed successfully.",
      refund: {
        refundId: updatedPayment.refundId,
        paymentId: targetPaymentId,
        bookingReference: payment.booking?.bookingReference,
        amount: updatedPayment.refundAmount,
        currency: updatedPayment.currency,
        status: updatedPayment.refundStatus,
        reason: updatedPayment.refundReason,
        refundedAt: updatedPayment.refundedAt?.toISOString(),
      },
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to process refund.", 500);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refundId = searchParams.get("refundId");
    const paymentId = searchParams.get("paymentId");
    const bookingReference = searchParams.get("bookingReference");

    // Bulk query without specific identifier requires staff auth
    if (!refundId && !paymentId && !bookingReference) {
      const authCheck = await requireAdminSession(request, ["Admin", "Travel Manager", "Support Agent"]);
      if (!authCheck.success) {
        return authCheck.response;
      }
    }

    const refundedPayments = await prisma.payment.findMany({
      where: {
        status: "REFUNDED",
        ...(refundId ? { refundId } : {}),
        ...(paymentId ? { OR: [{ razorpayPaymentId: paymentId }, { transactionId: paymentId }] } : {}),
        ...(bookingReference ? { booking: { bookingReference } } : {}),
      },
      include: {
        booking: {
          select: {
            bookingReference: true,
            customerName: true,
            customerEmail: true,
            status: true,
            package: { select: { name: true } },
          },
        },
      },
      orderBy: { refundedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      refunds: refundedPayments.map((p) => ({
        refundId: p.refundId,
        paymentId: p.razorpayPaymentId || p.transactionId,
        bookingReference: p.booking?.bookingReference,
        packageName: p.booking?.package?.name,
        customerName: p.booking?.customerName,
        customerEmail: p.booking?.customerEmail,
        amount: p.refundAmount || p.amount,
        currency: p.currency,
        status: p.refundStatus || "PROCESSED",
        reason: p.refundReason,
        refundedAt: p.refundedAt?.toISOString(),
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to fetch refund history.", 500);
  }
}
