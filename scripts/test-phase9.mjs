// scripts/test-phase9.mjs
// Automated verification of Phase 9: Secure Razorpay Integration

import crypto from "crypto";

const BASE_URL = "http://localhost:3000";
const SECRET = "mock_secret_sahtour_secure_2026"; // from .env

function log(step, msg, status = "INFO") {
  const badge =
    status === "PASS"
      ? "\x1b[32m[PASS]\x1b[0m"
      : status === "FAIL"
      ? "\x1b[31m[FAIL]\x1b[0m"
      : status === "SEC"
      ? "\x1b[33m[SECURITY]\x1b[0m"
      : "\x1b[36m[INFO]\x1b[0m";
  console.log(`${badge} Step ${step}: ${msg}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("  SAH TOUR AND TRAVEL - PHASE 9 RAZORPAY VERIFICATION  ");
  console.log("=======================================================\n");

  let testPassed = 0;
  let testFailed = 0;

  try {
    // -------------------------------------------------------------
    // TEST 1: CREATE PAYMENT ORDER
    // -------------------------------------------------------------
    log(1, "Creating Razorpay Payment Order via /api/payments/razorpay/create-order...");
    const orderPayload = {
      packageSlug: "dubai-skyline-desert-safari",
      travelDate: "2026-11-15T00:00:00.000Z",
      adultsCount: 2,
      childrenCount: 0,
      infantsCount: 0,
      customerName: "Rahul Sharma",
      customerEmail: "rahul.sharma@example.com",
      customerPhone: "+91 98765 43210",
      selectedAddonIds: ["addon-insurance"],
      travelers: [
        {
          type: "ADULT",
          title: "Mr",
          firstName: "Rahul",
          lastName: "Sharma",
          gender: "Male",
        },
        {
          type: "ADULT",
          title: "Mrs",
          firstName: "Pooja",
          lastName: "Sharma",
          gender: "Female",
        },
      ],
    };

    const orderRes = await fetch(`${BASE_URL}/api/payments/razorpay/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.success || !orderData.orderId) {
      log(1, `Order creation failed: ${JSON.stringify(orderData)}`, "FAIL");
      testFailed++;
      return;
    }

    log(
      1,
      `Order Created successfully! Order ID: ${orderData.orderId}, Booking Ref: ${orderData.bookingReference}, Amount: ₹${orderData.amountInRupees} (${orderData.amount} paise)`,
      "PASS"
    );
    testPassed++;

    const { orderId, bookingReference, bookingId, amountInRupees } = orderData;

    // Verify initial booking state is "Payment Pending" and NOT Confirmed
    const bookingCheckRes = await fetch(`${BASE_URL}/api/bookings/${bookingReference}`);
    const bookingCheckData = await bookingCheckRes.json();
    if (
      bookingCheckData.booking.status === "Payment Pending" &&
      bookingCheckData.booking.paymentStatus === "PENDING"
    ) {
      log(
        1.1,
        `Verified Initial State: Booking status is "${bookingCheckData.booking.status}", NOT Confirmed before payment.`,
        "PASS"
      );
      testPassed++;
    } else {
      log(
        1.1,
        `Initial state invalid: status="${bookingCheckData.booking.status}", paymentStatus="${bookingCheckData.booking.paymentStatus}"`,
        "FAIL"
      );
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 2: SECURITY - SERVER-SIDE SIGNATURE VERIFICATION REJECTION
    // Never trust client confirmation; reject tampered signatures!
    // -------------------------------------------------------------
    log(2, "Testing Security: Submitting FORGED/TAMPERED signature...", "SEC");
    const tamperedPaymentId = `pay_fake_${Date.now()}`;
    const forgedSignature = "0000000000000000000000000000000000000000000000000000000000000000";

    const forgedVerifyRes = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId: orderId,
        razorpayPaymentId: tamperedPaymentId,
        razorpaySignature: forgedSignature,
        bookingReference,
      }),
    });

    const forgedVerifyData = await forgedVerifyRes.json();

    if (
      forgedVerifyRes.status === 400 &&
      forgedVerifyData.success === false &&
      forgedVerifyData.allowRetry === true
    ) {
      log(
        2,
        `SECURITY CHECK PASSED: Server rejected forged signature with 400 Bad Request. Error: "${forgedVerifyData.error}". Retry allowed: ${forgedVerifyData.allowRetry}`,
        "PASS"
      );
      testPassed++;
    } else {
      log(
        2,
        `SECURITY CHECK FAILED: Server accepted forged signature or didn't respond with 400! Status: ${forgedVerifyRes.status}`,
        "FAIL"
      );
      testFailed++;
    }

    // Verify booking is STILL NOT Confirmed after forged payment attempt
    const bookingCheckPostForge = await (
      await fetch(`${BASE_URL}/api/bookings/${bookingReference}`)
    ).json();
    if (bookingCheckPostForge.booking.status !== "Confirmed") {
      log(
        2.1,
        `Booking is preserved as "${bookingCheckPostForge.booking.status}" and was NOT marked Confirmed on failure.`,
        "PASS"
      );
      testPassed++;
    } else {
      log(2.1, `Booking was erroneously confirmed on failed signature!`, "FAIL");
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 3: VALID CRYPTOGRAPHIC HMAC SIGNATURE VERIFICATION
    // Formula: hmac_sha256(order_id + "|" + razorpay_payment_id, secret)
    // -------------------------------------------------------------
    log(3, "Generating authentic cryptographic HMAC SHA-256 signature for verification...");
    const validPaymentId = `pay_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
    const authenticSignature = crypto
      .createHmac("sha256", SECRET)
      .update(`${orderId}|${validPaymentId}`)
      .digest("hex");

    log(3, `Generated valid HMAC SHA-256: ${authenticSignature.slice(0, 16)}...`, "INFO");

    const validVerifyRes = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId: orderId,
        razorpayPaymentId: validPaymentId,
        razorpaySignature: authenticSignature,
        bookingReference,
      }),
    });

    const validVerifyData = await validVerifyRes.json();
    if (validVerifyRes.ok && validVerifyData.success === true) {
      log(
        3,
        `Payment Verified Successfully! Message: "${validVerifyData.message}"`,
        "PASS"
      );
      testPassed++;
    } else {
      log(
        3,
        `Payment verification failed for valid HMAC: ${JSON.stringify(validVerifyData)}`,
        "FAIL"
      );
      testFailed++;
      return;
    }

    // -------------------------------------------------------------
    // TEST 4: SUCCESS VERIFICATION - BOOKING CONFIRMED & DATA AUDIT
    // Booking -> Confirmed, Store: Payment ID, Order ID, Booking ID, Amount, Currency, Status, Timestamp
    // Never store card details!
    // -------------------------------------------------------------
    log(4, "Auditing confirmed booking and payment storage compliance...");
    const confirmedBookingRes = await fetch(
      `${BASE_URL}/api/bookings/${bookingReference}`
    );
    const confirmedBookingData = await confirmedBookingRes.json();
    const b = confirmedBookingData.booking;

    if (b.status === "Confirmed" && b.paymentStatus === "PAID") {
      log(
        4,
        `Booking status successfully transitioned to "${b.status}" (paymentStatus: "${b.paymentStatus}"). Transaction ID: ${b.transactionId}`,
        "PASS"
      );
      testPassed++;
    } else {
      log(
        4,
        `Booking status incorrect: status="${b.status}", paymentStatus="${b.paymentStatus}"`,
        "FAIL"
      );
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 5: PAYMENT STATUS ENDPOINT (/api/payments/status)
    // -------------------------------------------------------------
    log(5, `Querying payment status via /api/payments/status?paymentId=${validPaymentId}...`);
    const statusRes = await fetch(
      `${BASE_URL}/api/payments/status?paymentId=${validPaymentId}`
    );
    const statusData = await statusRes.json();

    if (statusRes.ok && statusData.success && statusData.payment) {
      const p = statusData.payment;
      log(
        5,
        `Payment Status Retrieved:\n` +
          `   - Payment ID: ${p.paymentId}\n` +
          `   - Order ID:   ${p.orderId}\n` +
          `   - Booking ID: ${p.bookingId}\n` +
          `   - Amount:     ₹${p.amount} ${p.currency}\n` +
          `   - Status:     ${p.status}\n` +
          `   - Timestamp:  ${p.timestamp}`,
        "PASS"
      );
      testPassed++;
    } else {
      log(5, `Failed to retrieve payment status: ${JSON.stringify(statusData)}`, "FAIL");
      testFailed++;
    }

    // Also query via dynamic route /api/payments/[id]
    const dynamicRes = await fetch(`${BASE_URL}/api/payments/${validPaymentId}`);
    if (dynamicRes.ok) {
      log(5.1, `Dynamic route /api/payments/${validPaymentId} responded 200 OK`, "PASS");
      testPassed++;
    } else {
      log(5.1, `Dynamic route /api/payments/${validPaymentId} failed`, "FAIL");
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 6: PAYMENT FAILURE ROUTE & RETRY LOGIC (/api/payments/failure)
    // -------------------------------------------------------------
    log(6, "Testing failure endpoint /api/payments/failure with retry enabled...");
    const failReportRes = await fetch(`${BASE_URL}/api/payments/failure`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingReference: "STT-BK-TEST-RETRY",
        orderId: "order_test_failure_123",
        errorCode: "PAYMENT_CANCELLED",
        errorDescription: "User clicked back or closed payment window",
      }),
    });
    const failReportData = await failReportRes.json();
    if (failReportRes.ok && failReportData.allowRetry === true) {
      log(
        6,
        `Payment failure handled gracefully. Retry allowed: ${failReportData.allowRetry}`,
        "PASS"
      );
      testPassed++;
    } else {
      log(6, `Failure reporting error: ${JSON.stringify(failReportData)}`, "FAIL");
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 7: REFUND HANDLING STRUCTURE (/api/payments/refund)
    // Initiates refund, updates Payment status to REFUNDED, Booking to Cancelled
    // Restores package inventory allotment
    // -------------------------------------------------------------
    log(7, `Initiating refund for payment ${validPaymentId}...`);
    const refundRes = await fetch(`${BASE_URL}/api/payments/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: validPaymentId,
        bookingReference,
        reason: "Customer requested cancellation within 24h grace period",
        amount: amountInRupees,
      }),
    });

    const refundData = await refundRes.json();
    if (refundRes.ok && refundData.success && refundData.refund?.refundId) {
      log(
        7,
        `Refund Processed Successfully! Refund ID: ${refundData.refund.refundId}, Amount: ₹${refundData.refund.amount}, Status: ${refundData.refund.status}`,
        "PASS"
      );
      testPassed++;
    } else {
      log(7, `Refund initiation failed: ${JSON.stringify(refundData)}`, "FAIL");
      testFailed++;
    }

    // Verify payment and booking after refund
    const postRefundPayment = await (
      await fetch(`${BASE_URL}/api/payments/status?paymentId=${validPaymentId}`)
    ).json();

    if (
      postRefundPayment.payment?.status === "REFUNDED" &&
      postRefundPayment.payment?.refundId
    ) {
      log(
        7.1,
        `Payment status updated to "${postRefundPayment.payment.status}" with Refund ID ${postRefundPayment.payment.refundId}`,
        "PASS"
      );
      testPassed++;
    } else {
      log(7.1, `Payment status not updated to REFUNDED!`, "FAIL");
      testFailed++;
    }

    // Verify refund history query GET /api/payments/refund
    const refundHistoryRes = await fetch(
      `${BASE_URL}/api/payments/refund?paymentId=${validPaymentId}`
    );
    const refundHistoryData = await refundHistoryRes.json();
    if (refundHistoryRes.ok && refundHistoryData.refunds?.length > 0) {
      log(
        7.2,
        `Refund History Query returned ${refundHistoryData.refunds.length} record(s).`,
        "PASS"
      );
      testPassed++;
    } else {
      log(7.2, `Refund history query failed`, "FAIL");
      testFailed++;
    }
  } catch (err) {
    console.error("Test execution error:", err);
    testFailed++;
  }

  console.log("\n=======================================================");
  console.log(`  PHASE 9 VERIFICATION SUMMARY: ${testPassed} PASSED, ${testFailed} FAILED  `);
  console.log("=======================================================\n");

  if (testFailed > 0) {
    process.exit(1);
  }
}

runTests();
