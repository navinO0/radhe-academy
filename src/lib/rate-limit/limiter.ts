import { NextResponse } from "next/server";

/**
 * ============================================================================
 * BOUNDED IN-MEMORY RATE LIMITER (SLIDING WINDOW)
 * ============================================================================
 *
 * NOTE & ARCHITECTURAL CAVEAT:
 * This rate limiter is strictly in-memory and local to this Node.js process.
 * - It resets on container restart.
 * - It is not shared across multiple distributed instances (no Redis).
 * - For this single-instance Coolify deployment, this protects against abuse,
 *   brute force attacks, and resource exhaustion without introducing extra
 *   infrastructure.
 * - Edge-level DDoS mitigation and distributed bot traffic filtering are
 *   handled by Cloudflare in front of this service.
 */

export interface RateLimitEntry {
  requests: number[];
  blockedUntil?: number;
  lastAccess: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number; // Optional cooldown block duration
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp in ms
  retryAfter?: number; // In seconds (for HTTP 429 Retry-After)
}

// Memory bounds: cap max keys to prevent memory exhaustion DoS
const MAX_KEYS = 10_000;
const store = new Map<string, RateLimitEntry>();

/**
 * Periodic eviction to prevent memory leaks.
 * Runs every 60 seconds.
 */
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      // Remove requests older than 1 hour or expired blocked state
      const isBlocked = entry.blockedUntil && entry.blockedUntil > now;
      const hasRecentRequests = entry.requests.some((ts) => ts > now - 3600_000);
      if (!isBlocked && !hasRecentRequests) {
        store.delete(key);
      }
    }
  }, 60_000);

  // Allow Node.js to exit without waiting on this background interval
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

/**
 * Enforce maximum store size (LRU-style eviction).
 */
function evictIfCapacityExceeded() {
  if (store.size <= MAX_KEYS) return;

  // Evict 10% oldest accessed entries
  const entriesToEvict = Math.ceil(MAX_KEYS * 0.1);
  const sorted = Array.from(store.entries()).sort(
    (a, b) => a[1].lastAccess - b[1].lastAccess
  );

  for (let i = 0; i < entriesToEvict && i < sorted.length; i++) {
    const item = sorted[i];
    if (item) {
      store.delete(item[0]);
    }
  }
}

/**
 * Core rate limit check using a sliding window algorithm.
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const { maxRequests, windowMs, blockDurationMs = 0 } = config;

  let entry = store.get(identifier);
  if (!entry) {
    evictIfCapacityExceeded();
    entry = { requests: [], lastAccess: now };
    store.set(identifier, entry);
  } else {
    entry.lastAccess = now;
  }

  // 1. Check if identifier is currently in a cooldown block
  if (entry.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.max(1, Math.ceil((entry.blockedUntil - now) / 1000));
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter,
    };
  }

  // 2. Slide window: prune timestamps outside the active window
  const windowStart = now - windowMs;
  entry.requests = entry.requests.filter((ts) => ts > windowStart);

  // 3. Exceeded max requests
  if (entry.requests.length >= maxRequests) {
    if (blockDurationMs > 0) {
      entry.blockedUntil = now + blockDurationMs;
    }
    const oldest = entry.requests[0] ?? now;
    const resetAt = entry.blockedUntil ?? (oldest + windowMs);
    const retryAfter = Math.max(1, Math.ceil((resetAt - now) / 1000));

    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetAt,
      retryAfter,
    };
  }

  // 4. Allowed request
  entry.requests.push(now);
  const remaining = Math.max(0, maxRequests - entry.requests.length);
  const oldest = entry.requests[0] ?? now;
  const resetAt = oldest + windowMs;

  return {
    success: true,
    limit: maxRequests,
    remaining,
    resetAt,
  };
}

/**
 * Pre-configured rate limiters for sensitive endpoints and mutations.
 */
export const rateLimiters = {
  // Login: 5 attempts per 15 min per IP / account identifier (with 15 min block)
  auth: (identifier: string) =>
    rateLimit(`auth:${identifier}`, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
      blockDurationMs: 15 * 60 * 1000,
    }),

  // Password reset request: 3 per hour per IP / email
  passwordReset: (identifier: string) =>
    rateLimit(`pwd-reset:${identifier}`, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000,
      blockDurationMs: 30 * 60 * 1000,
    }),

  // Password reset verify/complete: 5 attempts per 15 min
  passwordResetVerify: (identifier: string) =>
    rateLimit(`pwd-reset-verify:${identifier}`, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
      blockDurationMs: 15 * 60 * 1000,
    }),

  // Sensitive mutations (payment creation): 10 per minute per user
  payment: (userId: string) =>
    rateLimit(`payment:${userId}`, {
      maxRequests: 10,
      windowMs: 60 * 1000,
    }),

  // PDF receipt rendering: 10 per minute per user
  receiptPdf: (userId: string) =>
    rateLimit(`receipt-pdf:${userId}`, {
      maxRequests: 10,
      windowMs: 60 * 1000,
    }),

  // Reports and data export: 5 per 5 minutes per user
  export: (userId: string) =>
    rateLimit(`export:${userId}`, {
      maxRequests: 5,
      windowMs: 5 * 60 * 1000,
    }),

  // Attendance marking/editing: 30 per minute per user
  attendance: (userId: string) =>
    rateLimit(`attendance:${userId}`, {
      maxRequests: 30,
      windowMs: 60 * 1000,
    }),

  // User management mutations: 10 per minute per admin
  userManagement: (adminUserId: string) =>
    rateLimit(`user-mgmt:${adminUserId}`, {
      maxRequests: 10,
      windowMs: 60 * 1000,
    }),

  // General API requests: 100 requests per minute per IP
  general: (ip: string) =>
    rateLimit(`general:${ip}`, {
      maxRequests: 100,
      windowMs: 60 * 1000,
    }),
};

/**
 * Helper to build standard HTTP 429 Too Many Requests response with RFC headers.
 */
export function buildRateLimitResponse(
  result: RateLimitResult,
  message = "Too many requests. Please try again later."
) {
  const response = NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message,
      },
    },
    { status: 429 }
  );

  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
  if (result.retryAfter) {
    response.headers.set("Retry-After", String(result.retryAfter));
  }

  return response;
}
