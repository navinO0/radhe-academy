import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_PREFIXES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/thank-you",
  "/privacy",
  "/terms",
  "/api/auth",
  "/api/health",
  "/health",
  "/api/academy/students/avatar",
  "/images",
  "/robots",
  "/sitemap",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Preserve or generate correlation request ID
  const requestId = request.headers.get("x-request-id")?.trim() || crypto.randomUUID();

  // Forward request ID to downstream server components & API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  // Allow static assets, next internal files, and files with extensions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Allow root homepage and public routes
  const isPublic =
    pathname === "/" ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isPublic) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Edge-safe session cookie presence check
  const sessionToken =
    request.cookies.get("raadhe.session_token")?.value ||
    request.cookies.get("__Secure-raadhe.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set("x-request-id", requestId);
    return redirectResponse;
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("x-request-id", requestId);

  return response;
}

// Support both Next.js 16 proxy convention and legacy middleware convention
export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

