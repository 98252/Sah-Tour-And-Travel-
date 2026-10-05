import { NextResponse } from "next/server";
import { getCurrentUser, sanitizeText } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message, packageId } = body;

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json(
        { error: "Subject is required and must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a detailed inquiry message (minimum 10 characters)." },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNo = `STT-ENQ-${new Date().getFullYear()}-${randomSuffix}`;

    const enquiry = await prisma.enquiry.create({
      data: {
        referenceNo,
        userId: user.id,
        packageId: packageId || null,
        subject: sanitizeText(subject),
        message: sanitizeText(message),
        status: "OPEN",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Enquiry Received (${referenceNo})`,
        message: `Your travel query "${sanitizeText(subject)}" has been assigned to a Sah travel specialist. Response expected within 4 hours.`,
        type: "BOOKING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully.",
      enquiry,
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again." },
      { status: 500 }
    );
  }
}
