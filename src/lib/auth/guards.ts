import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import {
  AuthError,
  ForbiddenError,
} from "@/lib/errors";
import type { Permission } from "@/lib/auth/permissions";

export interface AuthenticatedSession {
  userId: string;
  organizationId: string;
  email: string;
  name: string;
}

/**
 * Get the current session server-side.
 * Throws AuthError if not authenticated.
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new AuthError("You must be signed in to access this resource");
  }

  // Get user's organization
  const userOrg = await prisma.userOrganization.findFirst({
    where: { userId: session.user.id },
    select: { organizationId: true },
  });

  if (!userOrg) {
    throw new ForbiddenError("No organization access");
  }

  return {
    userId: session.user.id,
    organizationId: userOrg.organizationId,
    email: session.user.email,
    name: session.user.name,
  };
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
 * Require a specific permission — throws ForbiddenError if not granted.
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
    throw new ForbiddenError(
      `Permission denied: ${permission}`
    );
  }
}

/**
 * Get all permissions for a user in an org (for UI rendering hints)
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

