"use server";

import { requireAuth, requirePermission, revokeAllUserSessions } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit.service";
import { actionSuccess, actionError } from "@/lib/errors";
import { rateLimiters } from "@/lib/rate-limit/limiter";
import { hashPassword } from "better-auth/crypto";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  phone: z.string().trim().max(20).optional(),
  roleId: z.string().min(1, "Please select a role"),
});

export async function createUserAction(data: unknown) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.USERS_MANAGE);

    // Rate limit user creation by admin to prevent spamming
    const limit = rateLimiters.userManagement(session.userId);
    if (!limit.success) {
      return actionError("Too many user operations. Please wait before creating another user.");
    }

    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
      return actionError("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { name, email, password, phone, roleId } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return actionError("A user with this email address already exists.");
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return actionError("Selected role does not exist.");
    }

    // Privilege escalation protection: Only SUPER_ADMIN can assign SUPER_ADMIN role
    if (role.name === "SUPER_ADMIN" && !session.roleNames.includes("SUPER_ADMIN")) {
      return actionError("Only Super Administrators can create a user with the SUPER_ADMIN role.");
    }

    const hashedPassword = await hashPassword(password);
    const userId = createId();

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: userId,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone?.trim() || null,
          status: "ACTIVE",
          emailVerified: true,
          accounts: {
            create: {
              id: createId(),
              accountId: userId,
              providerId: "credential",
              password: hashedPassword,
            },
          },
          organizations: {
            create: {
              id: createId(),
              organizationId: session.organizationId,
            },
          },
          userRoles: {
            create: {
              id: createId(),
              roleId: role.id,
              organizationId: session.organizationId,
            },
          },
        },
      });

      return user;
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "CREATE",
      resourceType: "user",
      resourceId: newUser.id,
      metadata: { name: newUser.name, email: newUser.email, role: role.name },
    });

    revalidatePath("/admin/users");
    return actionSuccess(newUser, `User ${newUser.name} created successfully with role ${role.name}`);
  } catch (err: any) {
    return actionError(err.message || "Failed to create user");
  }
}

export async function updateUserRoleAction(userId: string, roleId: string) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.USERS_MANAGE);

    if (!userId || typeof userId !== "string" || !roleId || typeof roleId !== "string") {
      return actionError("Invalid parameters");
    }

    if (userId === session.userId) {
      return actionError("You cannot change your own role.");
    }

    // IDOR protection: ensure target user belongs to the same organization
    const targetUserOrg = await prisma.userOrganization.findFirst({
      where: { userId, organizationId: session.organizationId },
    });

    if (!targetUserOrg) {
      return actionError("User not found in this organization.");
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) return actionError("Role not found");

    // Privilege escalation protection
    if (role.name === "SUPER_ADMIN" && !session.roleNames.includes("SUPER_ADMIN")) {
      return actionError("Only Super Administrators can assign the SUPER_ADMIN role.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({
        where: {
          userId,
          organizationId: session.organizationId,
        },
      });

      await tx.userRole.create({
        data: {
          id: createId(),
          userId,
          roleId,
          organizationId: session.organizationId,
        },
      });
    });

    // Revoke target user's active sessions so permission changes apply immediately
    await revokeAllUserSessions(userId);

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "PERMISSION_CHANGE",
      resourceType: "user",
      resourceId: userId,
      metadata: { newRole: role.name },
    });

    revalidatePath("/admin/users");
    return actionSuccess(null, "User role updated successfully");
  } catch (err: any) {
    return actionError(err.message || "Failed to update user role");
  }
}

export async function toggleUserStatusAction(userId: string, currentStatus: string) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.USERS_MANAGE);

    if (!userId || typeof userId !== "string") {
      return actionError("Invalid user ID");
    }

    if (userId === session.userId) {
      return actionError("You cannot deactivate your own account.");
    }

    // IDOR protection: ensure target user belongs to the same organization
    const targetUserOrg = await prisma.userOrganization.findFirst({
      where: { userId, organizationId: session.organizationId },
    });

    if (!targetUserOrg) {
      return actionError("User not found in this organization.");
    }

    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status: nextStatus },
    });

    // Revoke all sessions if user was deactivated
    if (nextStatus === "INACTIVE") {
      await revokeAllUserSessions(userId);
    }

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "UPDATE",
      resourceType: "user",
      resourceId: userId,
      metadata: { statusChange: `${currentStatus} -> ${nextStatus}` },
    });

    revalidatePath("/admin/users");
    return actionSuccess(updated, `User marked as ${nextStatus.toLowerCase()}`);
  } catch (err: any) {
    return actionError(err.message || "Failed to change user status");
  }
}

export async function resetUserPasswordAction(userId: string, newPassword: unknown) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.USERS_MANAGE);

    if (!userId || typeof userId !== "string") {
      return actionError("Invalid user ID");
    }

    // Rate limit password resets per admin
    const limit = rateLimiters.userManagement(session.userId);
    if (!limit.success) {
      return actionError("Too many password reset requests. Please wait.");
    }

    // IDOR protection: verify user belongs to same organization
    const targetUserOrg = await prisma.userOrganization.findFirst({
      where: { userId, organizationId: session.organizationId },
    });

    if (!targetUserOrg) {
      return actionError("User not found in this organization.");
    }

    if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 128) {
      return actionError("New password must be between 8 and 128 characters long.");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.account.updateMany({
      where: {
        userId,
        providerId: "credential",
      },
      data: {
        password: hashedPassword,
      },
    });

    // Revoke all active sessions for the target user after password reset
    await revokeAllUserSessions(userId);

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "PASSWORD_RESET",
      resourceType: "user",
      resourceId: userId,
    });

    return actionSuccess(null, "Password reset successfully");
  } catch (err: any) {
    return actionError(err.message || "Failed to reset password");
  }
}
