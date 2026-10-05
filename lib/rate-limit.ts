import { NextResponse } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory cache for sliding-window rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      // Discard timestamps older than 1 hour
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitConfig {
  limit: number; // Max requests allowed
  windowSeconds: number; // Window size in seconds
  actionName?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Core sliding window rate limiter
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `${config.actionName || "default"}:${identifier}`;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= config.limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, config.limit - record.timestamps.length);

  return {
    allowed: true,
    limit: config.limit,
    remaining,
    resetInSeconds: config.windowSeconds,
  };
}

/**
 * Extract client IP or identifier safely from Request
 */
export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Return first IP in list
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Rate limit helper that returns a 429 response if limit is exceeded
 */
export function enforceRateLimit(
  request: Request,
  actionName: string,
  config: RateLimitConfig
): { allowed: true } | { allowed: false; response: NextResponse } {
  const ip = getClientIdentifier(request);
  const result = checkRateLimit(ip, { ...config, actionName });

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          error: `Too many requests for ${actionName}. Please slow down and try again in ${result.resetInSeconds} seconds.`,
          retryAfter: result.resetInSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.resetInSeconds),
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetInSeconds),
          },
        }
      ),
    };
  }

  return { allowed: true };
}
