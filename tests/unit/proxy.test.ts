import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import proxy from "@/proxy";

describe("Proxy Middleware Routing", () => {
  it("allows root homepage '/' without redirecting", () => {
    const req = new NextRequest("https://academy.radhevastraz.in/");
    const res = proxy(req);

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

  it("redirects unauthenticated requests to protected /dashboard to /login", () => {
    const req = new NextRequest("https://academy.radhevastraz.in/dashboard");
    const res = proxy(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/login");
    expect(location).toContain("callbackUrl=%2Fdashboard");
  });

  it("allows protected routes when session token cookie is present", () => {
    const req = new NextRequest("https://academy.radhevastraz.in/dashboard", {
      headers: {
        cookie: "raadhe.session_token=valid-test-token-12345",
      },
    });
    const res = proxy(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});
