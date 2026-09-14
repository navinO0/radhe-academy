import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { sanitizeAuditMetadata } from "@/lib/audit/audit.service";
import type { AuditAction } from "@prisma/client";

export type SecurityEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "SESSION_REVOKED"
  | "ALL_SESSIONS_REVOKED"
  | "ROLE_CHANGED"
  | "PERMISSION_CHANGED"
  | "ADMIN_ACTION"
  | "UNAUTHORIZED_ACCESS"
  | "FORBIDDEN_ACCESS"
  | "RATE_LIMITED"
  | "SUSPICIOUS_REQUEST"
  | "FILE_UPLOAD_REJECTED"
  | "ACCOUNT_LOCKED";

export interface SecurityEventPayload {
  eventType: SecurityEventType;
  organizationId?: string;
  actorId?: string;
  resourceId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Maps high-level security event types to existing AuditAction enum values.
 */
function mapToAuditAction(eventType: SecurityEventType): AuditAction {
  switch (eventType) {
    case "LOGIN_SUCCESS":
      return "LOGIN";
    case "LOGIN_FAILED":
      return "LOGIN_FAILED";
    case "LOGOUT":
      return "LOGOUT";
    case "PASSWORD_CHANGED":
    case "PASSWORD_RESET_REQUESTED":
    case "PASSWORD_RESET_COMPLETED":
      return "PASSWORD_RESET";
    case "ROLE_CHANGED":
    case "PERMISSION_CHANGED":
      return "PERMISSION_CHANGE";
    default:
      return "UPDATE";
  }
}

/**
 * Central security event logger.
 * Writes to PostgreSQL audit log asynchronously and outputs structured Pino security log.
 * Never throws exceptions or interrupts business logic.
 */
export async function logSecurityEvent(event: SecurityEventPayload): Promise<void> {
  const sanitizedMetadata = sanitizeAuditMetadata({
    eventType: event.eventType,
    ...(event.metadata ?? {}),
  });

  // 1. Structured log for Docker / Coolify log aggregator
  const logData = {
    securityEvent: event.eventType,
    actorId: event.actorId,
    organizationId: event.organizationId,
    resourceId: event.resourceId,
    requestId: event.requestId,
    ip: event.ipAddress,
    metadata: sanitizedMetadata,
  };

  if (
    event.eventType === "LOGIN_FAILED" ||
    event.eventType === "UNAUTHORIZED_ACCESS" ||
    event.eventType === "FORBIDDEN_ACCESS" ||
    event.eventType === "RATE_LIMITED" ||
    event.eventType === "SUSPICIOUS_REQUEST" ||
    event.eventType === "FILE_UPLOAD_REJECTED"
  ) {
    logger.warn(logData, `[SECURITY ALERT] ${event.eventType}`);
  } else {
    logger.info(logData, `[SECURITY EVENT] ${event.eventType}`);
  }

  // 2. Persistent storage in PostgreSQL
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: event.organizationId,
        actorId: event.actorId,
        action: mapToAuditAction(event.eventType),
        resourceType: "security_event",
        resourceId: event.resourceId ?? event.actorId,
        requestId: event.requestId,
        metadata: sanitizedMetadata as any,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent ? event.userAgent.slice(0, 500) : undefined,
      },
    });
  } catch (err) {
    // Non-blocking failure: persistent audit log failures must not break request execution
    logger.error({ err, eventType: event.eventType }, "Failed to persist security event to database");
  }
}

