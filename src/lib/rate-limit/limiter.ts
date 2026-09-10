/**
 * Simple in-memory rate limiter using sliding window algorithm.
 * Suitable for small-scale deployments without Redis.
 * When scaling horizontally, replace this with Upstash Ratelimit.
 */

interface RateLimitEntry {
  requests: number[];
  blockedUntil?: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (
      entry.requests.length === 0 &&
      (!entry.blockedUntil || entry.blockedUntil < now)
    ) {
      store.delete(key);
    }
  });
}, 60_000); // every 60s

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number; // how long to block after exceeding limit
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp ms
  retryAfter?: number; // seconds
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const { maxRequests, windowMs, blockDurationMs = 0 } = config;

  let entry = store.get(identifier);
  if (!entry) {
    entry = { requests: [] };
    store.set(identifier, entry);
  }

  // Check if currently blocked
  if (entry.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter,
    };
  }

  // Slide the window: remove requests older than windowMs
  const windowStart = now - windowMs;
  entry.requests = entry.requests.filter((ts) => ts > windowStart);

  if (entry.requests.length >= maxRequests) {
    // Block if configured
    if (blockDurationMs > 0) {
      entry.blockedUntil = now + blockDurationMs;
    }
    const oldestRequest = entry.requests[0] ?? now;
    const resetAt = oldestRequest + windowMs;
    const retryAfter = Math.ceil((resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt,
      retryAfter,
    };
  }

  entry.requests.push(now);
  const remaining = maxRequests - entry.requests.length;
  const resetAt =
    entry.requests.length > 0
      ? (entry.requests[0] ?? now) + windowMs
      : now + windowMs;

  return { success: true, remaining, resetAt };
}

// Pre-configured rate limiters for different endpoint types
export const rateLimiters = {
  auth: (ip: string) =>
    rateLimit(`auth:${ip}`, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 15 * 60 * 1000,
    }),

  passwordReset: (ip: string) =>
    rateLimit(`pwd-reset:${ip}`, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    }),

  payment: (userId: string) =>
    rateLimit(`payment:${userId}`, {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
    }),

  receiptPdf: (userId: string) =>
    rateLimit(`receipt-pdf:${userId}`, {
      maxRequests: 10,
      windowMs: 60 * 1000,
    }),

  report: (userId: string) =>
    rateLimit(`report:${userId}`, {
      maxRequests: 20,
      windowMs: 60 * 1000,
    }),

  export: (userId: string) =>
    rateLimit(`export:${userId}`, {
      maxRequests: 5,
      windowMs: 5 * 60 * 1000, // 5 minutes
    }),

  attendance: (userId: string) =>
    rateLimit(`attendance:${userId}`, {
      maxRequests: 30,
      windowMs: 60 * 1000,
    }),

  general: (identifier: string) =>
    rateLimit(`general:${identifier}`, {
      maxRequests: 100,
      windowMs: 60 * 1000,
    }),
};

