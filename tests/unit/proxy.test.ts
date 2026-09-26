import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import proxy from "@/proxy";

describe("Proxy Middleware Routing", () => {
  it("allows root homepage '/' without redirecting", () => {
    const req = new NextRequest("https://academy.radhevastraz.in/");
    const res = proxy(req);

    // Status should NOT be 307 or 308 redirect
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("allows public pages (/privacy, /terms, /thank-you, /login) without redirecting", () => {
    const paths = [
      "/privacy",
      "/terms",
      "/thank-you",
      "/login",
      "/images/brochures/boutique-courses-brochure.jpg",
    ];
    for (const path of paths) {
      const req = new NextRequest(`https://academy.radhevastraz.in${path}`);
      const res = proxy(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("passes requests through with x-request-id header", () => {
    const req = new NextRequest("https://academy.radhevastraz.in/");
    const res = proxy(req);

    expect(res.headers.get("x-request-id")).toBeDefined();
    expect(res.headers.get("x-request-id")?.length).toBeGreaterThan(0);
  });

  it("does not redirect unauthenticated dashboard requests in proxy layer", () => {
    const req = new NextRequest("https://academy.radhevastraz.in/dashboard");
    const res = proxy(req);

    // Proxy must not redirect — allow through so static CDN and page guards handle as needed
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});
