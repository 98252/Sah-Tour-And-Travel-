import { PrismaClient } from "@prisma/client";
import {
  checkReviewEligibility,
  submitCustomerReview,
  getApprovedReviews,
  moderateCustomerReview,
} from "../lib/reviews";

const prisma = new PrismaClient();

async function runPhase12Tests() {
  console.log("==================================================");
  console.log("PHASE 12 AUTOMATED VERIFICATION: REVIEWS & MODERATION");
  console.log("==================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      throw new Error(message);
    }
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  }

  try {
    // 0. Setup test users and package
    console.log("\n--- Setting up test fixtures ---");
    let testUser = await prisma.user.findFirst({ where: { email: "ineligible_tester@sahtour.com" } });
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          name: "Test Ineligible Traveler",
          email: "ineligible_tester@sahtour.com",
          phone: "+91 99999 11111",
          passwordHash: "hash123",
          role: "Customer",
        },
      });
    }

    let completedUser = await prisma.user.findFirst({ where: { email: "completed_traveler@sahtour.com" } });
    if (!completedUser) {
      completedUser = await prisma.user.create({
        data: {
          name: "Dr. Aakash Verma",
          email: "completed_traveler@sahtour.com",
          phone: "+91 98888 22222",
          country: "India",
          passwordHash: "hash123",
          role: "Customer",
        },
      });
    }

    const testPackage = await prisma.package.findFirst();
    if (!testPackage) {
      throw new Error("No package found in database to test against.");
    }
    console.log(`Using test package: "${testPackage.name}" (${testPackage.id})`);

    // Clean up any old test reviews from prior runs
    await prisma.review.deleteMany({
      where: {
        userId: { in: [testUser.id, completedUser.id] },
      },
    });
    await prisma.booking.deleteMany({
      where: {
        userId: { in: [testUser.id, completedUser.id] },
      },
    });

    // TEST 1: Ineligible customer (no completed booking) eligibility check
    console.log("\n--- Test 1: Ineligible Customer Check ---");
    const ineligibility = await checkReviewEligibility(testUser.id, testPackage.id);
    assert(ineligibility.eligible === false, "Customer with zero bookings is NOT eligible to review");
    assert(ineligibility.eligibleBookings.length === 0, "Eligible bookings array is empty");

    // TEST 2: Ineligible customer cannot submit review
    console.log("\n--- Test 2: Ineligible Customer Submission Rejection ---");
    let submissionFailed = false;
    try {
      await submitCustomerReview({
        userId: testUser.id,
        packageId: testPackage.id,
        rating: 5,
        comment: "This tour was great even though I never booked or traveled.",
      });
    } catch (err: any) {
      submissionFailed = true;
      console.log("Caught expected rejection error:", err.message);
    }
    assert(submissionFailed, "Submission from ineligible customer was strictly rejected");

    // TEST 3: Create a Completed Booking for eligible customer
    console.log("\n--- Test 3: Setting Up Verified Completed Booking ---");
    const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const completedBooking = await prisma.booking.create({
      data: {
        bookingReference: `STT-REV-${Date.now().toString().slice(-6)}`,
        userId: completedUser.id,
        packageId: testPackage.id,
        travelDate: pastDate,
        travelersCount: 2,
        adultsCount: 2,
        childrenCount: 0,
        infantsCount: 0,
        basePrice: 50000,
        taxesAmount: 2500,
        totalAmount: 52500,
        currency: "INR",
        status: "Completed",
        paymentStatus: "PAID",
      },
    });
    console.log(`Created verified completed booking: ${completedBooking.bookingReference}`);

    const eligibilityCheck = await checkReviewEligibility(completedUser.id, testPackage.id);
    assert(eligibilityCheck.eligible === true, "Customer with completed booking is eligible to review");
    assert(eligibilityCheck.eligibleBookings.length > 0, "Eligible bookings contains the completed booking");

    // TEST 4: Customer submits review with all required and optional fields
    console.log("\n--- Test 4: Submitting Verified Review with Fields ---");
    const submittedReview = await submitCustomerReview({
      userId: completedUser.id,
      packageId: testPackage.id,
      bookingId: completedBooking.id,
      rating: 5,
      title: "Exemplary Swiss Alpine Itinerary & Flawless Transfers",
      comment:
        "The scenic mountain train transfers were on time, hotel accommodations in Zermatt exceeded expectations, and our local tour manager was exceptionally knowledgeable.",
      travelDate: pastDate,
      photoUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
    });

    assert(submittedReview.id !== undefined, "Review record created in database");
    assert(submittedReview.status === "Pending", "Review status is strictly 'Pending' upon initial submission");
    assert(submittedReview.rating === 5, "Rating recorded accurately as 5");
    assert(submittedReview.photoUrl !== null, "Optional photo URL preserved");
    assert(submittedReview.travelDate !== null, "Travel date preserved");

    // TEST 5: Public review visibility check before moderation
    console.log("\n--- Test 5: Public Visibility Before Moderation ---");
    const publicBeforeModeration = await getApprovedReviews(testPackage.id);
    const foundPendingInPublic = publicBeforeModeration.reviews.find((r) => r.id === submittedReview.id);
    assert(!foundPendingInPublic, "Pending review does NOT appear publicly");

    // TEST 6: Moderation - Admin Approves Review
    console.log("\n--- Test 6: Admin Moderation -> Approved ---");
    const approvedReview = await moderateCustomerReview({
      reviewId: submittedReview.id,
      status: "Approved",
      moderationNotes: "Verified against completed booking STT-REV and passport travel record.",
      adminName: "Executive Travel Desk",
      adminRole: "Content Manager",
    });
    assert(approvedReview.status === "Approved", "Review status successfully updated to 'Approved'");

    // TEST 7: Public review visibility check after approval
    console.log("\n--- Test 7: Public Visibility After Approval ---");
    const publicAfterApproval = await getApprovedReviews(testPackage.id);
    const foundApprovedInPublic = publicAfterApproval.reviews.find((r) => r.id === submittedReview.id);
    assert(Boolean(foundApprovedInPublic), "Approved review now appears in public package reviews");
    assert(publicAfterApproval.averageRating !== null, "Public average rating is calculated from genuine reviews");
    assert(foundApprovedInPublic?.authorName === "Dr. Aakash Verma", "Author name matches genuine customer");

    // TEST 8: Moderation - Admin Rejects Review
    console.log("\n--- Test 8: Admin Moderation -> Rejected ---");
    const rejectedReview = await moderateCustomerReview({
      reviewId: submittedReview.id,
      status: "Rejected",
      moderationNotes: "Customer requested withdrawal of photo asset.",
      adminName: "Senior Travel Auditor",
      adminRole: "Admin",
    });
    assert(rejectedReview.status === "Rejected", "Review status successfully updated to 'Rejected'");

    const publicAfterRejection = await getApprovedReviews(testPackage.id);
    const foundRejectedInPublic = publicAfterRejection.reviews.find((r) => r.id === submittedReview.id);
    assert(!foundRejectedInPublic, "Rejected review is strictly excluded from public display");

    // TEST 9: Empty State Verification (No fake ratings or testimonials)
    console.log("\n--- Test 9: Empty State Contract Verification ---");
    const emptyPackageReviews = await getApprovedReviews("unreviewed-isolated-package-id");
    assert(emptyPackageReviews.totalCount === 0, "Package with no reviews reports totalCount 0");
    assert(
      emptyPackageReviews.averageRating === null,
      "Package with no reviews reports averageRating null (No fake 5.0 or 0.0)"
    );
    assert(emptyPackageReviews.reviews.length === 0, "Package with no reviews returns empty array");

    // Clean up test data
    await prisma.review.deleteMany({ where: { id: submittedReview.id } });
    await prisma.booking.deleteMany({ where: { id: completedBooking.id } });
    await prisma.user.deleteMany({ where: { id: { in: [testUser.id, completedUser.id] } } });

    console.log("\n==================================================");
    console.log(`ALL ${passedTests}/${totalTests} PHASE 12 REVIEW TESTS PASSED!`);
    console.log("==================================================");
  } catch (error) {
    console.error("Phase 12 Verification Failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase12Tests();
