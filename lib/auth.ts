import { cookies, headers } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "sah_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  image: string | null;
  preferredLanguage: string;
  travelPreferences: string | null;
  role: string;
  emailVerified: Date | null;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Server-side input validation utilities
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required" };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain both letters and numbers" };
  }
  return { valid: true };
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, "");
  return cleanPhone.length >= 7 && cleanPhone.length <= 15;
}

export function sanitizeText(text: string): string {
  if (!text) return "";
  return text.trim().replace(/[<>]/g, "");
}

/**
 * Cryptographic Password Hashing & Verification
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Session Management
 */
export async function createSession(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    expires: expiresAt,
  });

  return sessionToken;
}

export async function getCurrentUser(): Promise<UserWithoutPassword | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            country: true,
            image: true,
            preferredLanguage: true,
            travelPreferences: true,
            role: true,
            emailVerified: true,
            googleId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await prisma.session.delete({
        where: { sessionToken: token },
      }).catch(() => {});
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error destroying session:", error);
  }
}

/**
 * Role-Based Route Protection Guard
 */
export async function requireAuth(): Promise<UserWithoutPassword> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireRole(allowedRoles: string[]): Promise<UserWithoutPassword> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/**
 * Verification Token Generation & Verification
 */
export async function createVerificationToken(userId: string): Promise<string> {
  // Invalidate any older tokens for this user
  await prisma.verificationToken.deleteMany({
    where: { userId },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.verificationToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function verifyEmailWithToken(
  token: string
): Promise<{ success: boolean; message: string; userId?: string }> {
  if (!token) {
    return { success: false, message: "Verification token is required" };
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return { success: false, message: "Invalid or expired verification token" };
  }

  if (new Date() > record.expiresAt) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return { success: false, message: "Verification token has expired. Please request a new one." };
  }

  // Update user emailVerified
  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  });

  // Remove used token
  await prisma.verificationToken.delete({
    where: { id: record.id },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: record.userId,
      title: "Email Address Verified",
      message: "Your email address has been verified successfully. Your account is fully protected.",
      type: "SECURITY",
    },
  }).catch(() => {});

  return { success: true, message: "Email verified successfully!", userId: record.userId };
}

/**
 * Password Reset Token Generation & Handling
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  // Invalidate any existing reset tokens
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  if (!token) {
    return { success: false, message: "Reset token is required" };
  }

  const passCheck = isValidPassword(newPassword);
  if (!passCheck.valid) {
    return { success: false, message: passCheck.message || "Invalid password" };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record) {
    return { success: false, message: "Invalid or expired password reset link" };
  }

  if (new Date() > record.expiresAt) {
    await prisma.passwordResetToken.delete({ where: { id: record.id } });
    return { success: false, message: "Reset link has expired. Please request a new link." };
  }

  const passwordHash = await hashPassword(newPassword);

  // Update user password and terminate all previous sessions for safety
  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });

  await prisma.session.deleteMany({
    where: { userId: record.userId },
  });

  await prisma.passwordResetToken.delete({
    where: { id: record.id },
  });

  // Create security notification
  await prisma.notification.create({
    data: {
      userId: record.userId,
      title: "Password Changed Successfully",
      message: "Your account password was updated. If you did not make this change, contact support immediately.",
      type: "SECURITY",
    },
  }).catch(() => {});

  return { success: true, message: "Password updated successfully. You can now log in with your new password." };
}
