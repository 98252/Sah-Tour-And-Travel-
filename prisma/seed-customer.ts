import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedCustomer() {
  console.log("Seeding Phase 6 Demo Customer & Dashboard Data...");

  const email = "customer@sahtour.com";
  const passwordHash = await bcrypt.hash("SahTravel@2026", 10);

  // 1. Upsert Customer
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Rahul Sharma",
        email,
        passwordHash,
        phone: "+91 98765 43210",
        country: "India",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        preferredLanguage: "English",
        travelPreferences: "Luxury Escorted Tour, Beach & Island, Alpine Rail, Cultural Heritage",
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    });
    console.log("Created user:", user.email);
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        emailVerified: new Date(),
      },
    });
    console.log("Updated user:", user.email);
  }

  // Find packages
  const packages = await prisma.package.findMany({ take: 5 });
  if (packages.length < 2) {
    console.log("Not enough packages to seed customer relations.");
    return;
  }

  const swissPkg = packages.find((p) => p.slug.includes("switzerland")) || packages[0];
  const dubaiPkg = packages.find((p) => p.slug.includes("dubai")) || packages[1];
  const keralaPkg = packages.find((p) => p.slug.includes("kerala")) || packages[packages.length - 1];

  // 2. Wishlist
  await prisma.wishlistItem.deleteMany({ where: { userId: user.id } });
  await prisma.wishlistItem.createMany({
    data: [
      { userId: user.id, packageId: swissPkg.id },
      { userId: user.id, packageId: keralaPkg.id },
    ],
  });
  console.log("Seeded Wishlist items.");

  // 3. Bookings
  await prisma.booking.deleteMany({ where: { userId: user.id } });
  const booking1 = await prisma.booking.create({
    data: {
      bookingReference: "STT-BK-2026-9812",
      userId: user.id,
      packageId: swissPkg.id,
      travelDate: new Date("2026-11-15T09:00:00Z"),
      travelersCount: 2,
      totalAmount: swissPkg.startingPrice * 2,
      currency: "INR",
      status: "CONFIRMED",
      specialRequests: "Vegetarian breakfast requested, high floor scenic room preferred.",
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      bookingReference: "STT-BK-2026-4401",
      userId: user.id,
      packageId: dubaiPkg.id,
      travelDate: new Date("2026-08-10T10:00:00Z"),
      travelersCount: 2,
      totalAmount: dubaiPkg.startingPrice * 2,
      currency: "INR",
      status: "COMPLETED",
      specialRequests: "Desert safari private 4x4 dune bashing vehicle.",
    },
  });
  console.log("Seeded Bookings.");

  // 4. Payments
  await prisma.payment.deleteMany({ where: { userId: user.id } });
  await prisma.payment.createMany({
    data: [
      {
        transactionId: "TXN-2026-9812-UPI",
        userId: user.id,
        bookingId: booking1.id,
        amount: swissPkg.startingPrice * 2,
        currency: "INR",
        paymentMethod: "UPI (Razorpay Verified)",
        status: "SUCCESS",
        receiptUrl: "#",
      },
      {
        transactionId: "TXN-2026-4401-CC",
        userId: user.id,
        bookingId: booking2.id,
        amount: dubaiPkg.startingPrice * 2,
        currency: "INR",
        paymentMethod: "Credit Card (HDFC Visa)",
        status: "SUCCESS",
        receiptUrl: "#",
      },
    ],
  });
  console.log("Seeded Payments.");

  // 5. Enquiries
  await prisma.enquiry.deleteMany({ where: { userId: user.id } });
  await prisma.enquiry.createMany({
    data: [
      {
        referenceNo: "STT-ENQ-2026-819",
        userId: user.id,
        packageId: swissPkg.id,
        subject: "Glacier Express 1st Class upgrade quotation",
        message: "Can we upgrade our 2nd class Swiss Travel Pass segment on the Glacier Express to Excellence Class panoramic car?",
        status: "RESPONDED",
        agentNotes: "Concierge Advisor: Upgrade available for CHF 470 per person including 5-course regional wine tasting meal.",
      },
      {
        referenceNo: "STT-ENQ-2026-104",
        userId: user.id,
        packageId: null,
        subject: "Custom 10-day Japan Cherry Blossom Itinerary for April",
        message: "Looking for Tokyo, Kyoto, Hakone private escorted itinerary with onsen ryokan stay for 4 adults.",
        status: "IN_REVIEW",
        agentNotes: "Assigned to Far East Specialist Team. Draft itinerary being compiled.",
      },
    ],
  });
  console.log("Seeded Enquiries.");

  // 6. Reviews
  await prisma.review.deleteMany({ where: { userId: user.id } });
  await prisma.review.create({
    data: {
      userId: user.id,
      packageId: dubaiPkg.id,
      rating: 5,
      title: "Flawless Execution & Unmatched Desert Safari Experience",
      comment: "Every voucher, airport transfer, and hotel check-in at Aloft Deira was seamless. The official partner license gives great peace of mind. Highly recommend Sah Tour And Travel!",
      isVerified: true,
    },
  });
  console.log("Seeded Reviews.");

  // 7. Notifications
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: "Swiss Booking Voucher Confirmed",
        message: "Your e-tickets for Switzerland Scenic Rail & Alpine Glaciers (STT-BK-2026-9812) are ready.",
        type: "BOOKING",
        isRead: false,
        link: "/account?tab=bookings",
      },
      {
        userId: user.id,
        title: "Agent Responded to Enquiry",
        message: "Specialist note added for Glacier Express upgrade inquiry (Ref: STT-ENQ-2026-819).",
        type: "INFO",
        isRead: false,
        link: "/account?tab=enquiries",
      },
      {
        userId: user.id,
        title: "New Swiss Alps Winter Departures",
        message: "Special verified allotments available for St. Moritz Winter Festival.",
        type: "OFFER",
        isRead: true,
        link: `/holidays/${swissPkg.slug}`,
      },
      {
        userId: user.id,
        title: "Account Security Verified",
        message: "Your phone and email have been verified with 256-Bit SSL protection.",
        type: "SECURITY",
        isRead: true,
      },
    ],
  });
  console.log("Seeded Notifications.");

  console.log("Customer Seed Complete!");
  console.log("Demo Credentials: email: customer@sahtour.com | password: SahTravel@2026");
}

seedCustomer()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
