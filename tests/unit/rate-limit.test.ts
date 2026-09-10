import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit/limiter";

describe("In-Memory Sliding Window Rate Limiter", () => {
  it("allows requests under the maximum limit", () => {
    const id = "test-user-" + Math.random();
    const res1 = rateLimit(id, { maxRequests: 3, windowMs: 1000 });
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = rateLimit(id, { maxRequests: 3, windowMs: 1000 });
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = rateLimit(id, { maxRequests: 3, windowMs: 1000 });
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests that exceed the limit", () => {
    const id = "test-blocked-" + Math.random();
    // Consume all 2
    rateLimit(id, { maxRequests: 2, windowMs: 1000 });
    rateLimit(id, { maxRequests: 2, windowMs: 1000 });

    // 3rd attempt
    const res = rateLimit(id, { maxRequests: 2, windowMs: 1000 });
    expect(res.success).toBe(false);
    expect(res.remaining).toBe(0);
    expect(res.retryAfter).toBeGreaterThan(0);
  });
});

