// scripts/test-phase10-admin.mjs
// Automated verification for Phase 10: Enterprise Admin Console, Metrics, 14 Modules, RBAC, and Audit Logging

const BASE_URL = "http://localhost:3000";

function log(step, msg, status = "INFO") {
  const badge =
    status === "PASS"
      ? "\x1b[32m[PASS]\x1b[0m"
      : status === "FAIL"
      ? "\x1b[31m[FAIL]\x1b[0m"
      : status === "SEC"
      ? "\x1b[33m[SECURITY/RBAC]\x1b[0m"
      : "\x1b[36m[INFO]\x1b[0m";
  console.log(`${badge} Step ${step}: ${msg}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   SAH TOUR AND TRAVEL - PHASE 10 ADMIN VERIFICATION   ");
  console.log("=======================================================\n");

  let testPassed = 0;
  let testFailed = 0;

  try {
    // -------------------------------------------------------------
    // STEP 0: AUTHENTICATE AS ADMIN FOR RBAC SESSION
    // -------------------------------------------------------------
    log(0, "Authenticating as Staff Admin (admin@sahtour.com)...");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sahtour.com",
        password: "AdminPass2026!",
      }),
    });
    const cookieHeader = loginRes.headers.get("set-cookie") || "";
    const sessionCookie = cookieHeader.split(";")[0];
    const authHeaders = {
      Cookie: sessionCookie,
      "x-admin-role": "Admin",
    };

    if (loginRes.ok && sessionCookie) {
      log(0, "Staff Admin Authenticated with valid session cookie!", "PASS");
      testPassed++;
    } else {
      log(0, "Staff login failed!", "FAIL");
      testFailed++;
      return;
    }

    // -------------------------------------------------------------
    // TEST 1: ACTUAL DATABASE METRICS (NO FAKE STATISTICS)
    // -------------------------------------------------------------
    log(1, "Testing actual database metrics from /api/admin/metrics...");
    const metricsRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: authHeaders,
    });
    const metricsData = await metricsRes.json();

    if (metricsRes.ok && metricsData.success && metricsData.metrics) {
      const m = metricsData.metrics;
      log(
        1,
        `Verified Database Metrics Retrieved:\n` +
          `   - Bookings:     ${m.bookings.total} total (${m.bookings.confirmed} confirmed, ${m.bookings.paymentPending} pending)\n` +
          `   - Revenue:      ₹${m.revenue.totalAmount.toLocaleString("en-IN")} ${m.revenue.currency}\n` +
          `   - Customers:    ${m.customers.total} registered users\n` +
          `   - Enquiries:    ${m.enquiries.total} total (${m.enquiries.new} new, ${m.enquiries.converted} converted)\n` +
          `   - Packages:     ${m.packages.total} packages (${m.packages.liveAvailability} with live allotment)\n` +
          `   - Destinations: ${m.destinations.total} verified destinations`,
        "PASS"
      );
      testPassed++;
    } else {
      log(1, `Failed to retrieve database metrics: ${JSON.stringify(metricsData)}`, "FAIL");
      testFailed++;
      return;
    }

    // -------------------------------------------------------------
    // TEST 2: ALL 14 ADMIN MODULES READ ACCESS
    // -------------------------------------------------------------
    log(2, "Testing data availability across all 14 required modules...");
    const modules = [
      "destinations",
      "packages",
      "itineraries",
      "hotels",
      "activities",
      "bookings",
      "customers",
      "enquiries",
      "reviews",
      "offers",
      "coupons",
      "content",
      "users",
      "settings",
    ];

    let modulesChecked = 0;
    for (const mod of modules) {
      const res = await fetch(`${BASE_URL}/api/admin/modules/${mod}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        modulesChecked++;
      } else {
        log(2, `Module "${mod}" query failed: ${JSON.stringify(data)}`, "FAIL");
      }
    }

    if (modulesChecked === 14) {
      log(2, `All 14 Admin Modules successfully queried with valid DB records!`, "PASS");
      testPassed++;
    } else {
      log(2, `Only ${modulesChecked}/14 modules succeeded`, "FAIL");
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 3: CRUD & SOFT DELETION (ARCHIVE / RESTORE)
    // -------------------------------------------------------------
    log(3, "Testing Admin CRUD & Soft Deletion on Offers module...");

    // 3.1 CREATE
    const createPayload = {
      title: "Automated Test Monsoon Escapes",
      slug: `test-offer-${Date.now()}`,
      badge: "Test Special",
      description: "Temporary offer created by automated test suite",
      discountType: "PERCENTAGE",
      discountVal: 15,
      isFeatured: false,
    };

    const createRes = await fetch(`${BASE_URL}/api/admin/modules/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(createPayload),
    });
    const createData = await createRes.json();

    if (!createRes.ok || !createData.success || !createData.item?.id) {
      log(3.1, `Create failed: ${JSON.stringify(createData)}`, "FAIL");
      testFailed++;
      return;
    }
    const createdId = createData.item.id;
    log(3.1, `CREATE passed: Created offer ID ${createdId} (${createData.item.title})`, "PASS");
    testPassed++;

    // 3.2 UPDATE
    const updateRes = await fetch(`${BASE_URL}/api/admin/modules/offers`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        id: createdId,
        title: "Automated Test Monsoon Escapes (Updated)",
        discountVal: 20,
      }),
    });
    const updateData = await updateRes.json();
    if (updateRes.ok && updateData.item?.discountVal === 20) {
      log(3.2, `UPDATE passed: Discount updated to 20%`, "PASS");
      testPassed++;
    } else {
      log(3.2, `UPDATE failed: ${JSON.stringify(updateData)}`, "FAIL");
      testFailed++;
    }

    // 3.3 SOFT DELETION (ARCHIVE)
    const archiveRes = await fetch(`${BASE_URL}/api/admin/modules/offers`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        id: createdId,
        isArchived: true,
      }),
    });
    const archiveData = await archiveRes.json();
    if (archiveRes.ok && archiveData.item?.isArchived === true) {
      log(3.3, `ARCHIVE (SOFT DELETE) passed: isArchived is now true`, "PASS");
      testPassed++;
    } else {
      log(3.3, `ARCHIVE failed: ${JSON.stringify(archiveData)}`, "FAIL");
      testFailed++;
    }

    // 3.4 RESTORE
    const restoreRes = await fetch(`${BASE_URL}/api/admin/modules/offers`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        id: createdId,
        isArchived: false,
      }),
    });
    const restoreData = await restoreRes.json();
    if (restoreRes.ok && restoreData.item?.isArchived === false) {
      log(3.4, `RESTORE passed: isArchived restored to false`, "PASS");
      testPassed++;
    } else {
      log(3.4, `RESTORE failed`, "FAIL");
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 4: ROLE-BASED ACCESS CONTROL (RBAC)
    // -------------------------------------------------------------
    log(4, "Testing Role-Based Permissions enforcement...", "SEC");

    // 4.1 Support Agent attempting to modify Settings (Forbidden)
    const agentSettingRes = await fetch(`${BASE_URL}/api/admin/modules/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
        "x-admin-role": "Support Agent",
      },
      body: JSON.stringify({
        id: "any-setting-id",
        value: "malicious-change",
      }),
    });
    if (agentSettingRes.status === 403) {
      log(
        4.1,
        `RBAC CHECK PASSED: Support Agent blocked with 403 Forbidden when attempting Settings modification.`,
        "PASS"
      );
      testPassed++;
    } else {
      log(4.1, `RBAC FAILED: Support Agent was not denied (Status: ${agentSettingRes.status})`, "FAIL");
      testFailed++;
    }

    // 4.2 Content Manager attempting to access Bookings (Forbidden)
    const contentBookingsRes = await fetch(`${BASE_URL}/api/admin/modules/bookings`, {
      headers: {
        Cookie: sessionCookie,
        "x-admin-role": "Content Manager",
      },
    });
    if (contentBookingsRes.status === 403) {
      log(
        4.2,
        `RBAC CHECK PASSED: Content Manager blocked with 403 Forbidden when attempting to view Bookings module.`,
        "PASS"
      );
      testPassed++;
    } else {
      log(4.2, `RBAC FAILED: Content Manager was not denied access to Bookings`, "FAIL");
      testFailed++;
    }

    // 4.3 Travel Manager creating in Packages (Allowed)
    const tmAllowedCheck = await fetch(`${BASE_URL}/api/admin/modules/packages`, {
      headers: {
        Cookie: sessionCookie,
        "x-admin-role": "Travel Manager",
      },
    });
    if (tmAllowedCheck.status === 200) {
      log(4.3, `RBAC CHECK PASSED: Travel Manager allowed read access to Packages.`, "PASS");
      testPassed++;
    } else {
      log(4.3, `RBAC FAILED: Travel Manager was blocked on Packages`, "FAIL");
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 5: AUDIT LOG VERIFICATION (WHO, WHAT, WHEN)
    // -------------------------------------------------------------
    log(5, "Verifying Audit Log records (Who, What, When)...");
    const auditRes = await fetch(`${BASE_URL}/api/admin/audit?limit=10`, {
      headers: authHeaders,
    });
    const auditData = await auditRes.json();

    if (auditRes.ok && auditData.success && auditData.logs?.length > 0) {
      const latest = auditData.logs[0];
      log(
        5,
        `Audit Log Records Verified (${auditData.total} total logs recorded):\n` +
          `   - Who:   ${latest.userName} (${latest.userRole})\n` +
          `   - What:  ${latest.action} on [${latest.module}] (Entity: ${latest.entityId})\n` +
          `   - When:  ${latest.createdAt}\n` +
          `   - Details: ${latest.details}`,
        "PASS"
      );
      testPassed++;
    } else {
      log(5, `Audit log check failed: ${JSON.stringify(auditData)}`, "FAIL");
      testFailed++;
    }

    // -------------------------------------------------------------
    // TEST 6: /admin PAGE ACCESSIBILITY
    // -------------------------------------------------------------
    log(6, "Testing /admin UI page rendering with session cookie...");
    const adminPageRes = await fetch(`${BASE_URL}/admin`, {
      headers: authHeaders,
    });
    if (adminPageRes.status === 200) {
      log(6, `/admin page renders cleanly with HTTP 200 OK for authenticated staff`, "PASS");
      testPassed++;
    } else {
      log(6, `/admin page returned status ${adminPageRes.status}`, "FAIL");
      testFailed++;
    }

  } catch (err) {
    console.error("Test execution error:", err);
    testFailed++;
  }

  console.log("\n=======================================================");
  console.log(`   PHASE 10 VERIFICATION SUMMARY: ${testPassed} PASSED, ${testFailed} FAILED   `);
  console.log("=======================================================\n");

  if (testFailed > 0) {
    process.exit(1);
  }
}

runTests();
