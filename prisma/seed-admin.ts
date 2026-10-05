import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Phase 10 Admin models & initial data...");

  // 1. Initial Staff Users with 4 Roles
  const passwordHash = await bcrypt.hash("AdminPass2026!", 10);

  const staffUsers = [
    {
      name: "Sah Master Admin",
      email: "admin@sahtour.com",
      role: "Admin",
      phone: "+91 98765 00001",
      preferredLanguage: "English",
    },
    {
      name: "Vikram Malhotra",
      email: "travel.manager@sahtour.com",
      role: "Travel Manager",
      phone: "+91 98765 00002",
      preferredLanguage: "English",
    },
    {
      name: "Ananya Deshmukh",
      email: "content.manager@sahtour.com",
      role: "Content Manager",
      phone: "+91 98765 00003",
      preferredLanguage: "English",
    },
    {
      name: "Rohan Varma",
      email: "support.agent@sahtour.com",
      role: "Support Agent",
      phone: "+91 98765 00004",
      preferredLanguage: "Hindi",
    },
  ];

  for (const staff of staffUsers) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        role: staff.role,
        name: staff.name,
        phone: staff.phone,
      },
      create: {
        ...staff,
        passwordHash,
      },
    });
  }

  // 2. System Settings
  const settings = [
    {
      key: "company_name",
      value: "Sah Tour And Travel Pvt. Ltd.",
      category: "GENERAL",
      description: "Registered trade and company brand name",
    },
    {
      key: "support_email",
      value: "inquiry@sahtourandtravel.com",
      category: "CONTACT",
      description: "Primary customer service and inquiry inbox",
    },
    {
      key: "support_phone",
      value: "+91 98765 43210",
      category: "CONTACT",
      description: "Direct customer hotline and emergency travel desk",
    },
    {
      key: "headquarters_address",
      value: "Level 4, Sah Heritage Tower, Connaught Place, New Delhi - 110001",
      category: "CONTACT",
      description: "Registered corporate travel headquarters",
    },
    {
      key: "gst_number",
      value: "07AAAAA0000A1Z5",
      category: "FINANCIAL",
      description: "Indian Goods & Services Tax (GST) registration identifier",
    },
    {
      key: "base_currency",
      value: "INR",
      category: "FINANCIAL",
      description: "Default standard pricing currency across catalogue",
    },
    {
      key: "razorpay_gateway_status",
      value: "ACTIVE_VERIFIED",
      category: "FINANCIAL",
      description: "Payment gateway operational state",
    },
    {
      key: "cancellation_notice_period",
      value: "14 Days Before Departure",
      category: "POLICIES",
      description: "Standard threshold for full deposit refund guarantee",
    },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, category: s.category, description: s.description },
      create: s,
    });
  }

  // 3. Offers
  const offers = [
    {
      title: "Early Bird Alpine Summer Escapes",
      slug: "early-bird-alpine-summer-2026",
      badge: "Early Bird",
      description:
        "Book Switzerland & The Alps 60 days ahead to receive an instant ₹10,000 flat discount and complimentary scenic rail class upgrade.",
      discountType: "FLAT",
      discountVal: 10000,
      bannerImage:
        "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      isFeatured: true,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
    },
    {
      title: "Dubai Skyline Festive Bonanza",
      slug: "dubai-festive-bonanza-2026",
      badge: "Festive Saver",
      description:
        "Enjoy 12% off on all Dubai Marina & Desert Safari escorted itineraries with guaranteed 5-star hotel allotments.",
      discountType: "PERCENTAGE",
      discountVal: 12,
      bannerImage:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      isFeatured: true,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
    },
    {
      title: "Kerala Backwaters Monsoon Serenity",
      slug: "kerala-monsoon-serenity-2026",
      badge: "Special Allotment",
      description:
        "Book luxury houseboat stays in Alleppey and Munnar tea mist resorts with ₹5,000 per booking voucher.",
      discountType: "FLAT",
      discountVal: 5000,
      bannerImage:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      isFeatured: false,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
    },
  ];

  for (const o of offers) {
    await prisma.offer.upsert({
      where: { slug: o.slug },
      update: o,
      create: o,
    });
  }

  // 4. Coupons
  const coupons = [
    {
      code: "SAHTRAVEL2026",
      description: "Welcome voucher for premium international and domestic tours",
      discountType: "FLAT",
      discountVal: 3000,
      minBookingVal: 50000,
      usageLimit: 500,
      usedCount: 28,
    },
    {
      code: "HONEYMOON10",
      description: "Exclusive 10% discount for registered newlyweds and couples",
      discountType: "PERCENTAGE",
      discountVal: 10,
      minBookingVal: 75000,
      maxDiscount: 15000,
      usageLimit: 100,
      usedCount: 14,
    },
    {
      code: "EXPLORE5000",
      description: "Flat ₹5,000 allowance for group bookings with 4+ adult passengers",
      discountType: "FLAT",
      discountVal: 5000,
      minBookingVal: 100000,
      usageLimit: 200,
      usedCount: 42,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  // 5. Content Items
  const contentItems = [
    {
      title: "Comprehensive Travel Advisory: Schengen Visa Preparation Guidelines",
      slug: "schengen-visa-preparation-guidelines-2026",
      category: "Travel Advisory",
      summary:
        "Essential checklist, official VFS appointment timetables, and mandatory biometric documentation required for European Alps travel.",
      body: "Travelers planning visits to Switzerland, France, or Italy must schedule appointments at least 45 calendar days before scheduled departure. A minimum 3-month passport validity beyond the scheduled return date and verified travel insurance coverage of EUR 30,000 are compulsory.",
      author: "Sah Tour Regulatory Advisory Desk",
      isPublished: true,
    },
    {
      title: "Customer Protection & Verified Deposit Guarantee Policy",
      slug: "customer-protection-deposit-guarantee",
      category: "Policy",
      summary:
        "How Sah Tour And Travel escrows tour payments, guarantees live hotel allotments, and protects customer funds.",
      body: "All consumer deposits received via Razorpay or direct bank transfer are placed in escrowed client trust accounts. Allotments are pre-contracted with licensed destination management companies, eliminating booking displacement risk.",
      author: "Sah Tour Compliance Team",
      isPublished: true,
    },
    {
      title: "Monsoon Season Holidaying in South India: Tips & Highlights",
      slug: "monsoon-season-holidaying-south-india",
      category: "Destination Guide",
      summary:
        "Experiencing Kerala's Ayurvedic healing traditions, lush emerald hills of Munnar, and tranquil Vembanad waters.",
      body: "June to September in God's Own Country brings rejuvenated waterfalls and pleasant temperatures. Ayurvedic rejuvenations are especially effective during the cool Karkidakam monsoon period.",
      author: "Ananya Deshmukh (Content Lead)",
      isPublished: true,
    },
  ];

  for (const ci of contentItems) {
    await prisma.contentItem.upsert({
      where: { slug: ci.slug },
      update: ci,
      create: ci,
    });
  }

  // 6. Audit Logs Initial Entries
  const existingAudit = await prisma.auditLog.count();
  if (existingAudit === 0) {
    await prisma.auditLog.createMany({
      data: [
        {
          userName: "Sah Master Admin",
          userRole: "Admin",
          action: "CREATE",
          module: "Settings",
          entityId: "SETTING-INIT",
          details: "Initialized system configuration, payment gateway bindings, and contact records.",
          ipAddress: "127.0.0.1",
        },
        {
          userName: "Vikram Malhotra",
          userRole: "Travel Manager",
          action: "UPDATE",
          module: "Packages",
          entityId: "dubai-skyline-desert-safari",
          details: "Verified inventory allotments and updated standard departure departures calendar.",
          ipAddress: "127.0.0.1",
        },
        {
          userName: "Ananya Deshmukh",
          userRole: "Content Manager",
          action: "CREATE",
          module: "Offers",
          entityId: "early-bird-alpine-summer-2026",
          details: "Published seasonal promotion: Early Bird Alpine Summer 2026 with ₹10,000 incentive.",
          ipAddress: "127.0.0.1",
        },
      ],
    });
  }

  console.log("Admin seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during admin seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
