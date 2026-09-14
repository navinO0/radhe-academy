import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import {
  AuthError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors";
import type { Permission } from "@/lib/auth/permissions";
import { logSecurityEvent } from "@/lib/security/security-events";

export interface AuthenticatedSession {
  userId: string;
  organizationId: string;
  email: string;
  name: string;
  roleNames: string[];
  sessionToken?: string;
}

/**
 * Optional authentication helper. Returns null if not signed in, never throws.
 */
export async function authenticate(): Promise<AuthenticatedSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return null;

    const userOrg = await prisma.userOrganization.findFirst({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    if (!userOrg) return null;

    const userRoles = await prisma.userRole.findMany({
      where: { userId: session.user.id, organizationId: userOrg.organizationId },
      include: { role: true },
    });

    return {
      userId: session.user.id,
      organizationId: userOrg.organizationId,
      email: session.user.email,
      name: session.user.name,
      roleNames: userRoles.map((ur) => ur.role.name),
      sessionToken: session.session.token,
    };
  } catch {
    return null;
  }
}

/**
 * Require active authentication server-side.
 * Throws AuthError if not authenticated or user has no organization.
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await authenticate();

  if (!session) {
    throw new AuthError("You must be signed in to access this resource");
  }

  return session;
}

/**
 * Check if a user has a given permission.
 * Server-side only — never trust client permission checks.
 */
export async function hasPermission(
  userId: string,
  organizationId: string,
  permission: Permission
): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId, organizationId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  for (const userRole of userRoles) {
    for (const rp of userRole.role.rolePermissions) {
      if (rp.permission.name === permission) return true;
    }
  }
  return false;
}

/**
 * Require a specific permission — throws ForbiddenError and logs security event if not granted.
 */
export async function requirePermission(
  session: AuthenticatedSession,
  permission: Permission
): Promise<void> {
  const allowed = await hasPermission(
    session.userId,
    session.organizationId,
    permission
  );

  if (!allowed) {
    await logSecurityEvent({
      eventType: "FORBIDDEN_ACCESS",
      organizationId: session.organizationId,
      actorId: session.userId,
      metadata: { missingPermission: permission },
    });

    throw new ForbiddenError(`Permission denied: ${permission}`);
  }
}

/**
 * Require a specific role (e.g. "SUPER_ADMIN", "ADMIN").
 */
export async function requireRole(
  session: AuthenticatedSession,
  roleName: string
): Promise<void> {
  if (!session.roleNames.includes(roleName)) {
    await logSecurityEvent({
      eventType: "FORBIDDEN_ACCESS",
      organizationId: session.organizationId,
      actorId: session.userId,
      metadata: { requiredRole: roleName, userRoles: session.roleNames },
    });

    throw new ForbiddenError(`Role required: ${roleName}`);
  }
}

/**
 * Anti-IDOR Ownership check:
 * Enforces that a target resource belongs to the user's active organization.
 */
export function requireOwnership(
  session: AuthenticatedSession,
  resourceOrgId: string | null | undefined,
  resourceName = "Resource"
): void {
  if (!resourceOrgId || resourceOrgId !== session.organizationId) {
    throw new NotFoundError(`${resourceName} not found`);
  }
}

/**
 * Get all permissions for a user in an organization (for UI hints).
 */
export async function getUserPermissions(
  userId: string,
  organizationId: string
): Promise<string[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId, organizationId },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  const permissions = new Set<string>();
  for (const userRole of userRoles) {
    for (const rp of userRole.role.rolePermissions) {
      permissions.add(rp.permission.name);
    }
  }
  return Array.from(permissions);
}

/**
 * Revoke a single session by its token.
 */
export async function revokeSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  });
}

/**
 * Revoke all active sessions for a user (e.g. upon password change or account compromise).
 * Optionally preserves the current session.
 */
export async function revokeAllUserSessions(
  userId: string,
  preserveToken?: string
): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      userId,
      ...(preserveToken ? { token: { not: preserveToken } } : {}),
    },
  });

  await logSecurityEvent({
    eventType: "ALL_SESSIONS_REVOKED",
    actorId: userId,
    metadata: { revokedCount: result.count, preservedCurrent: !!preserveToken },
  });

  return result.count;
}
