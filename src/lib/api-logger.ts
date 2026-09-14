import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const isProduction = process.env.NODE_ENV === "production";

export interface RequestLogMeta {
  requestId: string;
  method: string;
  path: string;
  query?: Record<string, string>;
  userAgent?: string;
}

/**
 * Extract or generate correlation ID from request headers.
 */
export function getRequestId(request: NextRequest): string {
  const existing = request.headers.get("x-request-id");
  if (existing && existing.trim().length > 0) {
    return existing;
  }
  return crypto.randomUUID();
}

/**
 * Log incoming API request.
 */
export function logApiRequest(request: NextRequest, requestId: string) {
  const { pathname, searchParams } = request.nextUrl;
  const method = request.method;

  if (isProduction) {
    logger.info({
      requestId,
      method,
      path: pathname,
      msg: "incoming request",
    });
  } else {
    const query: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      // Do not log sensitive query params in dev
      if (/password|token|secret|key/i.test(k)) {
        query[k] = "[REDACTED]";
      } else {
        query[k] = v;
      }
    });

    logger.debug({
      requestId,
      method,
      path: pathname,
      query: Object.keys(query).length > 0 ? query : undefined,
      msg: `--> ${method} ${pathname}`,
    });
  }
}

/**
 * Log completed API response.
 */
export function logApiResponse(
  request: NextRequest,
  requestId: string,
  statusCode: number,
  durationMs: number
) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const logData = {
    requestId,
    method,
    path: pathname,
    statusCode,
    durationMs: Math.round(durationMs),
  };

  if (statusCode >= 500) {
    logger.error({ ...logData, msg: "request failed with server error" });
  } else if (statusCode >= 400) {
    logger.warn({ ...logData, msg: "request completed with client error" });
  } else {
    logger.info({ ...logData, msg: "request completed" });
  }
}

/**
 * Higher-order API route wrapper for timing, correlation ID injection, and structured logging.
 */
export function withApiLogging<T extends (...args: any[]) => Promise<NextResponse | Response>>(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse | Response>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse | Response> => {
    const start = performance.now();
    const requestId = getRequestId(request);

    logApiRequest(request, requestId);

    try {
      const response = await handler(request, ...args);
      const durationMs = performance.now() - start;

      // Ensure X-Request-ID is set on response header
      if (response instanceof NextResponse || "headers" in response) {
        response.headers.set("x-request-id", requestId);
      }

      logApiResponse(request, requestId, response.status, durationMs);
      return response;
    } catch (err: unknown) {
      const durationMs = performance.now() - start;
      const statusCode = (err as any)?.statusCode || 500;

      logger.error({
        requestId,
        method: request.method,
        path: request.nextUrl.pathname,
        statusCode,
        durationMs: Math.round(durationMs),
        err,
        msg: "unhandled exception in API route",
      });

      throw err;
    }
  };
}

