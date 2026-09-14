import type { NextRequest } from "next/server";

// Standard IPv4 and IPv6 format matchers
const IPV4_REGEX =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const IPV6_REGEX =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

/**
 * Validate whether a string is a valid IPv4 or IPv6 address.
 */
export function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  const trimmed = ip.trim();
  return IPV4_REGEX.test(trimmed) || IPV6_REGEX.test(trimmed);
}

/**
 * Extract and sanitize the real client IP.
 *
 * Trust priority:
 * 1. Cloudflare's `cf-connecting-ip` (injected by Cloudflare at the edge).
 * 2. Coolify/reverse-proxy `x-real-ip`.
 * 3. Left-most IP in `x-forwarded-for`.
 * 4. Fallback to "127.0.0.1".
 */
export function getClientIp(
  requestOrHeaders: NextRequest | Request | Headers | Record<string, string | string[] | undefined>
): string {
  const getHeader = (name: string): string | undefined => {
    if ("headers" in requestOrHeaders && requestOrHeaders.headers) {
      if (typeof (requestOrHeaders.headers as Headers).get === "function") {
        return (requestOrHeaders.headers as Headers).get(name) ?? undefined;
      }
      const headersObj = requestOrHeaders.headers as unknown as Record<string, string | string[] | undefined>;
      const val = headersObj[name] ?? headersObj[name.toLowerCase()];
      return Array.isArray(val) ? val[0] : val;
    }
    if (typeof (requestOrHeaders as Headers).get === "function") {
      return (requestOrHeaders as Headers).get(name) ?? undefined;
    }
    const record = requestOrHeaders as Record<string, string | string[] | undefined>;
    const val = record[name] ?? record[name.toLowerCase()];
    return Array.isArray(val) ? val[0] : val;
  };

  // 1. Cloudflare header
  const cfConnectingIp = getHeader("cf-connecting-ip");
  if (cfConnectingIp && isValidIp(cfConnectingIp.trim())) {
    return cfConnectingIp.trim();
  }

  // 2. Reverse proxy real IP header
  const xRealIp = getHeader("x-real-ip");
  if (xRealIp && isValidIp(xRealIp.trim())) {
    return xRealIp.trim();
  }

  // 3. X-Forwarded-For header (first valid client entry)
  const xForwardedFor = getHeader("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((s) => s.trim());
    for (const ip of ips) {
      if (isValidIp(ip)) {
        return ip;
      }
    }
  }

  return "127.0.0.1";
}
