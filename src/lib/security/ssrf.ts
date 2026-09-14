import { URL } from "url";

// Disallowed hostnames and metadata endpoints
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254", // AWS/GCP/Azure instance metadata
  "metadata.google.internal",
]);

/**
 * Check if an IP address belongs to a private, loopback, or link-local range.
 */
function isPrivateOrLocalIp(hostname: string): boolean {
  // IPv4 checks
  const ipv4Parts = hostname.split(".").map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    const [a, b] = ipv4Parts as [number, number, number, number];
    if (a === 127) return true; // 127.0.0.0/8 (loopback)
    if (a === 10) return true; // 10.0.0.0/8 (private)
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 (private)
    if (a === 192 && b === 168) return true; // 192.168.0.0/16 (private)
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 (link-local / cloud metadata)
    if (a === 0) return true; // 0.0.0.0/8
  }

  // IPv6 checks
  const lower = hostname.toLowerCase();
  if (lower === "::1" || lower.startsWith("fe80:") || lower.startsWith("fc00:") || lower.startsWith("fd00:")) {
    return true;
  }

  return false;
}

export interface ValidateUrlOptions {
  allowedProtocols?: string[];
  allowedDomains?: string[];
}

/**
 * Validate that an external URL is safe against SSRF attacks.
 */
export function isSafeUrl(rawUrl: string, options: ValidateUrlOptions = {}): { safe: boolean; reason?: string; parsedUrl?: URL } {
  const allowedProtocols = options.allowedProtocols ?? ["https:"];

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { safe: false, reason: "Malformed URL" };
  }

  // Protocol check
  if (!allowedProtocols.includes(parsed.protocol)) {
    return { safe: false, reason: `Protocol ${parsed.protocol} is not allowed` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Hostname blocklist
  if (BLOCKED_HOSTNAMES.has(hostname) || isPrivateOrLocalIp(hostname)) {
    return { safe: false, reason: "Access to private or local network resources is forbidden" };
  }

  // Domain allowlist if specified
  if (options.allowedDomains && options.allowedDomains.length > 0) {
    const isAllowedDomain = options.allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
    if (!isAllowedDomain) {
      return { safe: false, reason: `Domain ${hostname} is not in the allowlist` };
    }
  }

  return { safe: true, parsedUrl: parsed };
}

/**
 * Safe fetch wrapper with timeout, size cap, and SSRF validation.
 */
export async function safeFetch(
  rawUrl: string,
  options: {
    timeoutMs?: number;
    maxBytes?: number;
    allowedDomains?: string[];
  } = {}
): Promise<Response> {
  const { timeoutMs = 5000, maxBytes = 5 * 1024 * 1024, allowedDomains } = options;

  const check = isSafeUrl(rawUrl, { allowedDomains, allowedProtocols: ["https:", "http:"] });
  if (!check.safe || !check.parsedUrl) {
    throw new Error(`SSRF validation failed: ${check.reason}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(check.parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "RaadheAcademy-SecurityClient/1.0",
      },
    });

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      throw new Error(`Response size exceeds maximum allowed limit (${maxBytes} bytes)`);
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

