import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_ROLES } from "@/lib/rbac";
import { maskEmail, maskPhone, formatSafeErrorResponse } from "@/lib/security";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { id },
          { transactionId: id },
          { razorpayPaymentId: id },
          { razorpayOrderId: id },
        ],
      },
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            status: true,
            paymentStatus: true,
            customerName: true,
            customerEmail: true,
            package: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Determine authorization level for PII masking
    const currentUser = await getCurrentUser();
    let isFullyAuthorized = false;

    if (currentUser) {
      const isOwner = payment.userId === currentUser.id;
      const isAdminStaff = ADMIN_ROLES.includes(currentUser.role as any);
      if (isOwner || isAdminStaff) {
        isFullyAuthorized = true;
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        paymentId: payment.razorpayPaymentId || payment.transactionId,
        orderId: payment.razorpayOrderId,
        bookingId: payment.bookingId,
        bookingReference: payment.booking?.bookingReference,
        packageName: payment.booking?.package?.name,
        customerName: payment.booking?.customerName,
        customerEmail: isFullyAuthorized ? payment.booking?.customerEmail : maskEmail(payment.booking?.customerEmail || ""),
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        refundId: payment.refundId,
        refundAmount: payment.refundAmount,
        refundStatus: payment.refundStatus,
        refundReason: payment.refundReason,
        refundedAt: payment.refundedAt?.toISOString() || null,
        failureReason: payment.failureReason,
        timestamp: payment.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    return formatSafeErrorResponse(error, "Failed to retrieve payment record.", 500);
  }
}
