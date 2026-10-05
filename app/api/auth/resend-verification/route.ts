import { NextResponse } from "next/server";
import { getCurrentUser, createVerificationToken, isValidEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    let email: string | undefined;
    try {
      const body = await request.json();
      email = body.email;
    } catch {
      // Body may be empty if called by logged in user
    }

    let userId: string | null = null;
    let recipientEmail: string | null = null;

    if (email && isValidEmail(email)) {
      const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (user) {
        userId = user.id;
        recipientEmail = user.email;
      }
    } else {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        userId = currentUser.id;
        recipientEmail = currentUser.email;
      }
    }

    if (!userId || !recipientEmail) {
      return NextResponse.json(
        { error: "Unable to find associated user account." },
        { status: 404 }
      );
    }

    const token = await createVerificationToken(userId);

    return NextResponse.json({
      success: true,
      message: `Verification link generated for ${recipientEmail}.`,
      verificationToken: token,
      verificationLink: `/auth/verify-email?token=${token}`,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while resending verification." },
      { status: 500 }
    );
  }
}
