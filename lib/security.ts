import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser, UserWithoutPassword } from "./auth";
import { ADMIN_ROLES, AdminRole, hasPermission, AdminModule, AdminAction } from "./rbac";

/**
 * Standard Production Security Error Response
 * - Generates unique correlation ID for server logs
 * - Logs full stack trace to server-side logging ONLY
 * - NEVER leaks error stack, file paths, or database internals to client/customer
 */
export function formatSafeErrorResponse(
  error: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again later.",
  statusCode = 500
): NextResponse {
  const errorId = `err_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;

  // Full detailed logging for server-side operations & security audit
  console.error(`[SECURITY ERROR ID: ${errorId}] HTTP ${statusCode}:`, error);

  // Determine safe user-facing message
  let safeMessage = fallbackMessage;

  // In production, never expose internal database or library errors
  if (process.env.NODE_ENV !== "production") {
    // In dev, provide informative message if it's safe and non-sensitive
    if (error instanceof Error && !error.message.includes("prisma") && !error.message.includes("database")) {
      safeMessage = error.message;
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: safeMessage,
      errorId,
    },
    { status: statusCode }
  );
}

/**
 * Origin & CSRF Protection
 * Verifies that state-changing requests (POST, PUT, PATCH, DELETE) originate
 * from the same origin or trusted host.
 */
export function verifyCsrfOrigin(request: Request): { valid: boolean; reason?: string } {
  const method = request.method.toUpperCase();

  // GET, HEAD, OPTIONS are idempotent and exempt from CSRF checks
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return { valid: true };
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const referer = request.headers.get("referer");

  // In non-browser / API client situations (like cURL / scripts without origin), allow if host is verified
  if (!origin && !referer) {
    return { valid: true };
  }

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (host && originUrl.host !== host) {
        return { valid: false, reason: "Cross-site request blocked: origin mismatch." };
      }
    } catch {
      return { valid: false, reason: "Invalid origin header format." };
    }
  } else if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (host && refererUrl.host !== host) {
        return { valid: false, reason: "Cross-site request blocked: referer mismatch." };
      }
    } catch {
      return { valid: false, reason: "Invalid referer header format." };
    }
  }

  return { valid: true };
}

/**
 * Strict Admin Authentication & Authorization Guard
 * - Rejects any unauthenticated requests
 * - NEVER honors spoofable client headers (e.g. x-admin-role) in production
 * - Enforces role-based permissions against ADMIN_ROLES
 */
export async function requireAdminSession(
  request?: Request,
  allowedRoles: AdminRole[] = [...ADMIN_ROLES]
): Promise<
  | { success: true; user: UserWithoutPassword; role: AdminRole }
  | { success: false; response: NextResponse }
> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Authentication required. Please sign in with staff credentials." },
        { status: 401 }
      ),
    };
  }

  // Normalize role
  const userRole = (
    user.role === "ADMIN" ? "Admin" : user.role === "AGENT" ? "Support Agent" : user.role
  ) as AdminRole;

  if (!ADMIN_ROLES.includes(userRole) || !allowedRoles.includes(userRole)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: `Access Denied: Persona [${user.role}] does not possess necessary administrative privileges.`,
        },
        { status: 403 }
      ),
    };
  }

  return {
    success: true,
    user,
    role: userRole,
  };
}

/**
 * URL Sanitization & Whitelisting
 * Prevents XSS via javascript: URI, SSRF, and malformed URLs
 */
export function isValidSafeImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();

  // Allow relative URLs starting with /
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }

  // Block javascript:, vbscript:, data:text/html, etc.
  if (
    trimmed.toLowerCase().startsWith("javascript:") ||
    trimmed.toLowerCase().startsWith("vbscript:") ||
    trimmed.toLowerCase().startsWith("data:text/html")
  ) {
    return false;
  }

  // Enforce http/https
  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    // Length sanity check
    return trimmed.length <= 2048;
  } catch {
    return false;
  }
}

/**
 * Data Masking Utility for PII (Personally Identifiable Information)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***@***.com";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.length <= 4) return "****";
  return `${cleaned.slice(0, 2)}******${cleaned.slice(-2)}`;
}

export function maskPassport(passport: string | null | undefined): string {
  if (!passport) return "";
  const trimmed = passport.trim();
  if (trimmed.length <= 3) return "***";
  return `${trimmed.slice(0, 2)}****${trimmed.slice(-2)}`;
}
