import { prisma } from "@/lib/db/prisma";
import type { AuditAction } from "@prisma/client";

export interface AuditLogEntry {
  organizationId?: string;
  actorId?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Append-only audit log writer.
 * Never throws — logs errors to console if DB write fails.
 * Does NOT log: passwords, secrets, payment credentials.
 */
export async function writeAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: entry.organizationId,
        actorId: entry.actorId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        requestId: entry.requestId,
        metadata: entry.metadata ? (entry.metadata as any) : undefined,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (err) {
    // Audit log failures must NOT break the main operation
    console.error("[AuditLog] Failed to write audit log:", err);
  }
}

/**
 * Sanitize metadata: remove sensitive fields before logging
 */
export function sanitizeAuditMetadata(
  data: Record<string, unknown>
): Record<string, unknown> {
  const SENSITIVE_KEYS = [
    "password",
    "token",
    "secret",
    "apiKey",
    "idempotencyKey",
    "cardNumber",
    "cvv",
  ];

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

