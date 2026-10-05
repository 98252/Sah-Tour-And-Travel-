import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bookingReference,
      bookingId,
      orderId,
      errorCode,
      errorDescription,
      paymentId,
    } = body;

    // Resolve booking if reference or ID is supplied
    let booking = null;
    if (bookingReference || bookingId || orderId) {
      booking = await prisma.booking.findFirst({
        where: bookingReference
          ? { bookingReference: String(bookingReference).trim().toUpperCase() }
          : bookingId
          ? { id: String(bookingId).trim() }
          : { razorpayOrderId: String(orderId).trim() },
      });
    }

    if (booking) {
      // Ensure booking NEVER transitions to Confirmed on failure
      if (booking.status !== "Confirmed") {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentStatus: "FAILED",
            status: "Payment Pending",
            agentNotes: `Payment attempt failed: [${errorCode || "GATEWAY_ERROR"}] ${
              errorDescription || "User dismissed modal or transaction cancelled"
            }`,
          },
        });
      }

      // Record failed payment attempt
      await prisma.payment.create({
        data: {
          transactionId: `FAIL-${Date.now()}-${(paymentId || orderId || "ERR").slice(-6)}`,
          razorpayPaymentId: paymentId || null,
          razorpayOrderId: orderId || booking.razorpayOrderId || null,
          bookingId: booking.id,
          userId: booking.userId,
          amount: booking.totalAmount,
          currency: booking.currency,
          paymentMethod: "Razorpay",
          status: "FAILED",
          failureReason: `${errorCode || "ERROR"}: ${errorDescription || "Payment declined or cancelled by user"}`,
        },
      }).catch((err) => console.error("Error creating failed payment log:", err));
    }

    return NextResponse.json({
      success: true,
      allowRetry: true,
      message:
        "Payment failure recorded. Your booking reservation has not been confirmed. You may retry your payment.",
      bookingReference: booking?.bookingReference || bookingReference,
    });
  } catch (error: any) {
    console.error("Payment failure recording error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to record payment failure.",
        allowRetry: true,
      },
      { status: 500 }
    );
  }
}
