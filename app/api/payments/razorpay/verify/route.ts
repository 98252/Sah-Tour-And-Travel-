import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import {
  sendCustomerBookingConfirmation,
  sendBusinessBookingNotification,
} from "@/lib/email";
import { verifyCsrfOrigin, formatSafeErrorResponse } from "@/lib/security";

export async function POST(request: Request) {
  try {
    // CSRF Protection
    const csrf = verifyCsrfOrigin(request);
    if (!csrf.valid) {
      return NextResponse.json({ error: csrf.reason }, { status: 403 });
    }

    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      bookingReference,
      bookingId,
    } = body;

    // 1. Mandatory Parameter Validation
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required payment verification parameters (razorpayOrderId, razorpayPaymentId, razorpaySignature).",
          allowRetry: true,
        },
        { status: 400 }
      );
    }

    // 2. Resolve Associated Booking Record
    const booking = await prisma.booking.findFirst({
      where: bookingReference
        ? { bookingReference: String(bookingReference).trim().toUpperCase() }
        : bookingId
        ? { id: String(bookingId).trim() }
        : { razorpayOrderId: String(razorpayOrderId).trim() },
      include: {
        package: {
          include: {
            destination: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "Associated booking reference could not be found.",
          allowRetry: true,
        },
        { status: 404 }
      );
    }

    // 3. SECURITY: NEVER TRUST CLIENT CONFIRMATION.
    // Perform server-side HMAC SHA-256 signature verification.
    const verification = verifyRazorpayPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    // 4. FAILURE HANDLING: If cryptographic signature fails:
    if (!verification.isValid) {
      console.error(
        `[SECURITY WARNING] Payment verification failed for Booking ${booking.bookingReference}: ${verification.error}`
      );

      // Record failure in database - NEVER confirm booking!
      await prisma.payment.create({
        data: {
          transactionId: `FAIL-${Date.now()}-${razorpayPaymentId.slice(-6)}`,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          bookingId: booking.id,
          userId: booking.userId,
          amount: booking.totalAmount,
          currency: booking.currency,
          paymentMethod: "Razorpay",
          status: "FAILED",
          failureReason: verification.error || "Cryptographic signature verification failed",
        },
      }).catch((err) => console.error("Could not log failed payment:", err));

      // Keep booking as Payment Pending so traveler can retry
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "FAILED",
          status: "Payment Pending",
        },
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verification failed: Cryptographic signature mismatch. Your payment could not be authenticated on our servers. Your booking has NOT been confirmed.",
          allowRetry: true,
          bookingReference: booking.bookingReference,
        },
        { status: 400 }
      );
    }

    // 5. SUCCESS FLOW: Check idempotency (if already confirmed, return success)
    if (booking.status === "Confirmed" && booking.paymentStatus === "PAID") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified and booking confirmed.",
        bookingReference: booking.bookingReference,
        payment: {
          paymentId: razorpayPaymentId,
          orderId: razorpayOrderId,
          bookingId: booking.id,
          amount: booking.totalAmount,
          currency: booking.currency,
          status: "SUCCESS",
          timestamp: booking.updatedAt.toISOString(),
        },
      });
    }

    // 6. DB TRANSACTION:
    // Update Booking -> Confirmed, Record Payment, Deduct package slot.
    // SECURITY: NEVER STORE CARD DETAILS!
    const { updatedBooking, paymentRecord } = await prisma.$transaction(
      async (tx) => {
        // Update booking to Confirmed
        const updated = await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: "Confirmed",
            paymentStatus: "PAID",
            paymentMethod: "RAZORPAY",
            transactionId: razorpayPaymentId,
            razorpayOrderId,
          },
        });

        // Store Payment record strictly according to Phase 9 requirements:
        // Payment ID, Order ID, Booking ID, Amount, Currency, Status, Timestamp
        // ZERO card numbers, CVVs, expiry dates!
        const payment = await tx.payment.create({
          data: {
            transactionId: razorpayPaymentId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            bookingId: booking.id,
            userId: booking.userId,
            amount: booking.totalAmount,
            currency: booking.currency,
            paymentMethod: "Razorpay",
            status: "SUCCESS",
            failureReason: null,
          },
        });

        // Decrement available slots on package allotment
        const pkg = await tx.package.findUnique({
          where: { id: booking.packageId },
          select: { availableSlots: true },
        });

        if (pkg && pkg.availableSlots !== null) {
          await tx.package.update({
            where: { id: booking.packageId },
            data: {
              availableSlots: Math.max(0, pkg.availableSlots - booking.travelersCount),
            },
          });
        }

        return { updatedBooking: updated, paymentRecord: payment };
      }
    );

    // 7. Generate Confirmation & Dispatch Emails
    const emailPayload = {
      bookingReference: updatedBooking.bookingReference,
      customerName: updatedBooking.customerName,
      customerEmail: updatedBooking.customerEmail,
      customerPhone: updatedBooking.customerPhone,
      packageName: booking.package.name,
      destination: booking.package.destination?.name || "Global Destination",
      travelDate: updatedBooking.travelDate,
      adultsCount: updatedBooking.adultsCount,
      childrenCount: updatedBooking.childrenCount,
      infantsCount: updatedBooking.infantsCount,
      travelersCount: updatedBooking.travelersCount,
      basePrice: updatedBooking.basePrice,
      taxesAmount: updatedBooking.taxesAmount,
      feesAmount: updatedBooking.feesAmount,
      addonsAmount: updatedBooking.addonsAmount,
      totalAmount: updatedBooking.totalAmount,
      status: updatedBooking.status,
      paymentStatus: updatedBooking.paymentStatus,
      paymentMethod: updatedBooking.paymentMethod,
      transactionId: updatedBooking.transactionId,
    };

    await sendCustomerBookingConfirmation(emailPayload).catch((err) =>
      console.error("Customer booking email error:", err)
    );

    await sendBusinessBookingNotification(emailPayload).catch((err) =>
      console.error("Business booking notification error:", err)
    );

    // In-app notification if customer is authenticated
    if (updatedBooking.userId) {
      await prisma.notification
        .create({
          data: {
            userId: updatedBooking.userId,
            title: `Payment Verified: ${updatedBooking.bookingReference}`,
            message: `Payment of ₹${updatedBooking.totalAmount.toLocaleString(
              "en-IN"
            )} verified. Your tour booking for ${booking.package.name} is confirmed!`,
            type: "BOOKING",
            link: `/book/confirmation/${updatedBooking.bookingReference}`,
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified. Booking is confirmed.",
      bookingReference: updatedBooking.bookingReference,
      payment: {
        paymentId: paymentRecord.razorpayPaymentId || paymentRecord.transactionId,
        orderId: paymentRecord.razorpayOrderId,
        bookingId: updatedBooking.id,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency,
        status: paymentRecord.status,
        timestamp: paymentRecord.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    return formatSafeErrorResponse(
      error,
      "Server error while verifying payment. Please retry or contact support.",
      500
    );
  }
}
