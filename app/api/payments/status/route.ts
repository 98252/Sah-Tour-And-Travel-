import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");
    const orderId = searchParams.get("orderId");
    const bookingReference = searchParams.get("bookingReference");
    const transactionId = searchParams.get("transactionId");

    if (!paymentId && !orderId && !bookingReference && !transactionId) {
      return NextResponse.json(
        {
          error:
            "Please provide paymentId, orderId, bookingReference, or transactionId query parameter.",
        },
        { status: 400 }
      );
    }

    // Lookup payment
    const whereClause: any = {};
    if (paymentId) {
      whereClause.OR = [
        { razorpayPaymentId: paymentId },
        { transactionId: paymentId },
        { id: paymentId },
      ];
    } else if (orderId) {
      whereClause.razorpayOrderId = orderId;
    } else if (transactionId) {
      whereClause.transactionId = transactionId;
    } else if (bookingReference) {
      whereClause.booking = { bookingReference };
    }

    const payment: any = await prisma.payment.findFirst({
      where: whereClause,
      include: {
        booking: {
          select: {
            id: true,
            bookingReference: true,
            status: true,
            paymentStatus: true,
            customerName: true,
            customerEmail: true,
            travelDate: true,
            package: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!payment) {
      // If payment record not found yet, check if there is a pending booking with that reference/orderId
      if (bookingReference || orderId) {
        const booking = await prisma.booking.findFirst({
          where: bookingReference
            ? { bookingReference }
            : { razorpayOrderId: orderId! },
        });

        if (booking) {
          return NextResponse.json({
            success: true,
            payment: {
              paymentId: booking.transactionId || null,
              orderId: booking.razorpayOrderId || null,
              bookingId: booking.id,
              bookingReference: booking.bookingReference,
              amount: booking.totalAmount,
              currency: booking.currency,
              status: booking.paymentStatus,
              timestamp: booking.createdAt.toISOString(),
              bookingStatus: booking.status,
            },
          });
        }
      }

      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
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
        customerEmail: payment.booking?.customerEmail,
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
    console.error("Payment status query error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve payment status." },
      { status: 500 }
    );
  }
}
