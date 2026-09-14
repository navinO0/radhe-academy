import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint for Coolify / Docker / Reverse Proxy monitoring.
 *
 * Checks:
 * 1. Process liveness and uptime
 * 2. Memory usage (useful for low-resource server monitoring)
 * 3. Database connectivity with a short timeout
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const checkDb = url.searchParams.get("checkDb") !== "false";

  const uptime = Math.floor(process.uptime());
  const mem = process.memoryUsage();
  const memoryRssMb = Math.round(mem.rss / (1024 * 1024));
  const memoryHeapUsedMb = Math.round(mem.heapUsed / (1024 * 1024));

  let dbStatus: "connected" | "disconnected" | "skipped" = "skipped";
  let dbLatencyMs: number | undefined;

  if (checkDb) {
    const dbStart = performance.now();
    try {
      // 2-second timeout to prevent blocking on slow HDD / busy DB
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Database query timeout (2s)")), 2000)
        ),
      ]);
      dbStatus = "connected";
      dbLatencyMs = Math.round(performance.now() - dbStart);
    } catch {
      dbStatus = "disconnected";
    }
  }

  const isHealthy = dbStatus !== "disconnected";
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds: uptime,
      memory: {
        rssMb: memoryRssMb,
        heapUsedMb: memoryHeapUsedMb,
      },
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      service: "raadhe-academy",
      version: process.env.npm_package_version ?? "0.1.0",
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

