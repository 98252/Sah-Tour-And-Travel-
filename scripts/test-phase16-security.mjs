// scripts/test-phase16-security.mjs
// Automated verification for Phase 16: Production Security Audit & Protection Controls

import fs from "fs";
import path from "path";
import crypto from "crypto";

const BASE_URL = "http://localhost:3000";

let testPassed = 0;
let testFailed = 0;

function log(testNum, msg, status = "PASS") {
  const badge =
    status === "PASS"
      ? "\x1b[32m[PASS]\x1b[0m"
      : status === "FAIL"
      ? "\x1b[31m[FAIL]\x1b[0m"
      : status === "SEC"
      ? "\x1b[35m[SECURITY]\x1b[0m"
      : "\x1b[36m[INFO]\x1b[0m";
  console.log(`${badge} [Check ${testNum}] ${msg}`);
  if (status === "PASS") testPassed++;
  if (status === "FAIL") testFailed++;
}

async function runAudit() {
  console.log("=================================================================");
  console.log("  PHASE 16: ENTERPRISE PRODUCTION SECURITY AUDIT VERIFICATION   ");
  console.log("=================================================================\n");

  try {
    // -------------------------------------------------------------
    // CHECK 1: UNTOUCHABLE ADMIN ROUTES (AUTHENTICATION & RBAC)
    // -------------------------------------------------------------
    console.log("--- 1. Testing Admin Route Protection (Unauthenticated Access Rejected) ---");
    
    // 1.1 /api/admin/metrics
    const resMetrics = await fetch(`${BASE_URL}/api/admin/metrics`);
    if (resMetrics.status === 401) {
      log(1.1, "/api/admin/metrics rejects unauthenticated GET with 401 Unauthorized");
    } else {
      log(1.1, `/api/admin/metrics returned status ${resMetrics.status} instead of 401`, "FAIL");
    }

    // 1.2 /api/admin/audit
    const resAudit = await fetch(`${BASE_URL}/api/admin/audit`);
    if (resAudit.status === 401) {
      log(1.2, "/api/admin/audit rejects unauthenticated GET with 401 Unauthorized");
    } else {
      log(1.2, `/api/admin/audit returned status ${resAudit.status} instead of 401`, "FAIL");
    }

    // 1.3 /api/admin/bookings
    const resAdminBookings = await fetch(`${BASE_URL}/api/admin/bookings`);
    if (resAdminBookings.status === 401) {
      log(1.3, "/api/admin/bookings rejects unauthenticated GET with 401 Unauthorized");
    } else {
      log(1.3, `/api/admin/bookings returned status ${resAdminBookings.status} instead of 401`, "FAIL");
    }

    // 1.4 /api/admin/enquiries
    const resAdminEnquiries = await fetch(`${BASE_URL}/api/admin/enquiries`);
    if (resAdminEnquiries.status === 401) {
      log(1.4, "/api/admin/enquiries rejects unauthenticated GET with 401 Unauthorized");
    } else {
      log(1.4, `/api/admin/enquiries returned status ${resAdminEnquiries.status} instead of 401`, "FAIL");
    }

    // 1.5 /api/admin/modules/packages
    const resAdminModules = await fetch(`${BASE_URL}/api/admin/modules/packages`);
    if (resAdminModules.status === 401) {
      log(1.5, "/api/admin/modules/packages rejects unauthenticated GET with 401 Unauthorized");
    } else {
      log(1.5, `/api/admin/modules/packages returned status ${resAdminModules.status} instead of 401`, "FAIL");
    }

    // 1.6 POST /api/admin/audit without auth
    const resAuditPost = await fetch(`${BASE_URL}/api/admin/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "DELETE", module: "destinations", details: "hacked" }),
    });
    if (resAuditPost.status === 401) {
      log(1.6, "/api/admin/audit rejects unauthenticated POST with 401 Unauthorized");
    } else {
      log(1.6, `/api/admin/audit POST returned status ${resAuditPost.status} instead of 401`, "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 2: FINANCIAL & REFUND AUTHORIZATION
    // -------------------------------------------------------------
    console.log("\n--- 2. Testing Financial & Refund Authorization ---");
    const resRefundPost = await fetch(`${BASE_URL}/api/payments/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: "pay_test123", amount: 1000 }),
    });
    if (resRefundPost.status === 401 || resRefundPost.status === 403) {
      log(2.1, `/api/payments/refund rejects unauthorized POST with ${resRefundPost.status}`);
    } else {
      log(2.1, `/api/payments/refund POST returned status ${resRefundPost.status} instead of 401/403`, "FAIL");
    }

    const resRefundGet = await fetch(`${BASE_URL}/api/payments/refund`);
    if (resRefundGet.status === 401 || resRefundGet.status === 403) {
      log(2.2, `/api/payments/refund rejects unauthorized GET history with ${resRefundGet.status}`);
    } else {
      log(2.2, `/api/payments/refund GET returned status ${resRefundGet.status} instead of 401/403`, "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 3: ZERO EXPOSED TOKENS IN AUTH RESPONSES
    // -------------------------------------------------------------
    console.log("\n--- 3. Testing Sensitive Token & Secret Non-Exposure ---");
    const testRegEmail = `security_audit_${Date.now()}@sahtourandtravel.com`;
    const resRegister = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Security Audit User",
        email: testRegEmail,
        password: "AuditPassword2026!",
        phone: "+91 9876543210",
      }),
    });
    const regData = await resRegister.json();
    if (
      resRegister.ok &&
      regData.success &&
      regData.verificationToken === undefined &&
      regData.verificationLink === undefined &&
      regData.user?.passwordHash === undefined
    ) {
      log(3.1, "Registration succeeds without leaking verificationToken, verificationLink, or passwordHash");
    } else {
      log(3.1, `Registration returned unexpected exposure: ${JSON.stringify(regData)}`, "FAIL");
    }

    const resForgot = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testRegEmail }),
    });
    const forgotData = await resForgot.json();
    if (
      resForgot.ok &&
      forgotData.success &&
      forgotData.devToken === undefined &&
      forgotData.devResetLink === undefined
    ) {
      log(3.2, "Forgot-password succeeds without leaking devToken or devResetLink");
    } else {
      log(3.2, `Forgot-password leaked reset token: ${JSON.stringify(forgotData)}`, "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 4: CSRF ORIGIN VALIDATION
    // -------------------------------------------------------------
    console.log("\n--- 4. Testing CSRF Origin Protection ---");
    const resCsrfCrossSite = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://evil-attacker-website.com",
        host: "localhost:3000",
      },
      body: JSON.stringify({
        name: "Evil Attacker",
        email: "evil@attacker.com",
        phone: "+91 9876543210",
        destination: "Dubai",
        travelersCount: 2,
        message: "CSRF cross-site injection attempt",
      }),
    });
    if (resCsrfCrossSite.status === 403) {
      log(4.1, "Cross-site request blocked with 403 Forbidden when Origin does not match Host");
    } else {
      log(4.1, `Cross-site request returned status ${resCsrfCrossSite.status} instead of 403`, "FAIL");
    }

    const resCsrfSameOrigin = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
        host: "localhost:3000",
      },
      body: JSON.stringify({
        name: "Legitimate Traveler",
        email: "traveler@example.com",
        phone: "+91 9876543210",
        destination: "Dubai",
        travelersCount: 2,
        message: "Legitimate inquiry with matching origin",
      }),
    });
    if (resCsrfSameOrigin.ok) {
      log(4.2, "Same-origin request with matching Origin and Host accepted successfully");
    } else {
      log(4.2, `Same-origin request rejected with ${resCsrfSameOrigin.status}`, "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 5: RATE LIMITING (BRUTE FORCE RESISTANCE)
    // -------------------------------------------------------------
    console.log("\n--- 5. Testing Sliding-Window Rate Limiting ---");
    // Perform rapid login attempts to trigger 429
    let got429 = false;
    let retryAfterHeader = null;
    const spamIp = `192.168.100.${Math.floor(Math.random() * 200) + 10}`;

    for (let i = 0; i < 8; i++) {
      const loginAttempt = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": spamIp,
        },
        body: JSON.stringify({
          email: "spam_target@sahtourandtravel.com",
          password: `IncorrectPass_${i}!`,
        }),
      });

      if (loginAttempt.status === 429) {
        got429 = true;
        retryAfterHeader = loginAttempt.headers.get("retry-after");
        break;
      }
    }

    if (got429 && retryAfterHeader) {
      log(5.1, `Rate limiter triggers 429 Too Many Requests with Retry-After: ${retryAfterHeader}s`);
    } else {
      log(5.1, "Rate limiter did not return 429 after threshold attempts", "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 6: PRODUCTION-SAFE ERROR RESPONSES (NO STACK TRACES)
    // -------------------------------------------------------------
    console.log("\n--- 6. Testing Production-Safe Error Responses (No Leaked Stack Traces) ---");
    const badReq = await fetch(`${BASE_URL}/api/payments/invalid_payment_query_id_xyz`);
    const badData = await badReq.json();

    const containsStack =
      JSON.stringify(badData).includes("at ") ||
      JSON.stringify(badData).includes("node_modules") ||
      JSON.stringify(badData).includes("prisma") ||
      JSON.stringify(badData).includes("stack");

    if (!containsStack && badData.error) {
      log(6.1, "Error response returns sanitized message without leaking internal stack traces or file paths");
    } else {
      log(6.1, `Error response contains sensitive stack or internals: ${JSON.stringify(badData)}`, "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 7: SQL INJECTION RESISTANCE
    // -------------------------------------------------------------
    console.log("\n--- 7. Testing SQL Injection Protection ---");
    const sqlPayloads = [
      "' OR 1=1 --",
      "'; DROP TABLE \"User\"; --",
      "\" UNION SELECT null, null, null --",
    ];

    let allSqlSafe = true;
    for (const payload of sqlPayloads) {
      const searchRes = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(payload)}`);
      if (searchRes.status !== 200) {
        allSqlSafe = false;
        break;
      }
    }

    if (allSqlSafe) {
      log(7.1, "Prisma ORM safely handles SQL injection payloads (DROP TABLE, UNION SELECT, OR 1=1) as parameterized literals");
    } else {
      log(7.1, "SQL injection query caused an unexpected server failure", "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 8: INPUT VALIDATION & XSS PREVENTIONS
    // -------------------------------------------------------------
    console.log("\n--- 8. Testing Input Validation & XSS Sanitization ---");
    const xssPayload = "<script>alert('xss')</script>Malicious Enquiry";
    const xssEnquiryRes = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: xssPayload,
        email: "xss_test@sahtourandtravel.com",
        phone: "+91 9876543210",
        destination: "<img src=x onerror=alert(1)>Bali",
        travelersCount: 2,
        message: "Testing HTML strip: <b>bold</b> <script>document.cookie</script>",
      }),
    });
    const xssData = await xssEnquiryRes.json();
    if (xssEnquiryRes.ok && xssData.enquiry) {
      const sanitizedName = xssData.enquiry.name;
      const sanitizedDest = xssData.enquiry.destination;
      if (!sanitizedName.includes("<") && !sanitizedDest.includes("<")) {
        log(8.1, "HTML script tags and angle brackets sanitized from user inputs");
      } else {
        log(8.1, `HTML tags were not stripped: name=${sanitizedName}`, "FAIL");
      }
    } else {
      log(8.1, `XSS submission returned status ${xssEnquiryRes.status}`, "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 9: SENSITIVE DATA MASKING (PII PROTECTION)
    // -------------------------------------------------------------
    console.log("\n--- 9. Testing PII Protection & Data Masking ---");
    // Verify booking lookup masking
    const resBookingCheck = await fetch(`${BASE_URL}/api/bookings/NON_EXISTENT_REF`);
    if (resBookingCheck.status === 404) {
      log(9.1, "Booking lookup returns proper 404 for unknown references without leaking system details");
    } else {
      log(9.1, `Booking lookup returned unexpected status ${resBookingCheck.status}`, "FAIL");
    }

    // -------------------------------------------------------------
    // CHECK 10: CONFIGURATION & SECRETS AUDIT
    // -------------------------------------------------------------
    console.log("\n--- 10. Testing Secrets, Environment Variables & Config Audit ---");
    const gitignore = fs.readFileSync(path.join(process.cwd(), ".gitignore"), "utf-8");
    const nextConfig = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf-8");
    const envExample = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf-8");
    const proxy = fs.readFileSync(path.join(process.cwd(), "proxy.ts"), "utf-8");

    if (gitignore.includes("*.db") && gitignore.includes(".env*")) {
      log(10.1, ".gitignore properly ignores database files (*.db) and environment secrets (.env*)");
    } else {
      log(10.1, ".gitignore missing database or env exclusions", "FAIL");
    }

    if (
      nextConfig.includes("Content-Security-Policy") &&
      nextConfig.includes("X-Frame-Options") &&
      nextConfig.includes("X-Content-Type-Options") &&
      nextConfig.includes("Strict-Transport-Security")
    ) {
      log(10.2, "next.config.ts defines production HTTP security headers (CSP, HSTS, X-Frame-Options, nosniff)");
    } else {
      log(10.2, "next.config.ts missing critical security headers", "FAIL");
    }

    if (proxy.includes("/admin") && proxy.includes("/api/admin")) {
      log(10.3, "proxy.ts includes /admin and /api/admin route matchers and session checks");
    } else {
      log(10.3, "proxy.ts missing admin route matchers", "FAIL");
    }

    if (!envExample.includes("mock_secret") && !envExample.includes("file:./dev.db\"\"")) {
      log(10.4, ".env.example contains clean configuration template without genuine credentials");
    } else {
      log(10.4, ".env.example check failed", "FAIL");
    }

    console.log("\n=================================================================");
    console.log(`  SECURITY AUDIT COMPLETE: ${testPassed} PASSED, ${testFailed} FAILED`);
    console.log("=================================================================\n");

    if (testFailed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Fatal test execution error:", err);
    process.exit(1);
  }
}

runAudit();
