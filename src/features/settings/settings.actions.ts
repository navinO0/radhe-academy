"use server";

import { requireAuth, revokeAllUserSessions } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit.service";
import { actionSuccess, actionError } from "@/lib/errors";
import { rateLimiters } from "@/lib/rate-limit/limiter";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required").max(128),
    newPassword: z.string().min(8, "New password must be at least 8 characters").max(128),
    confirmPassword: z.string().min(1, "Confirm password is required").max(128),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(data: unknown) {
  try {
    const session = await requireAuth();

    // Rate limit password change attempts per user
    const limit = rateLimiters.auth(session.userId);
    if (!limit.success) {
      return actionError("Too many password attempts. Please wait 15 minutes before trying again.");
    }

    const parsed = changePasswordSchema.safeParse(data);
    if (!parsed.success) {
      return actionError(
        "Validation failed",
        parsed.error.flatten().fieldErrors as Record<string, string[]>
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const account = await prisma.account.findFirst({
      where: {
        userId: session.userId,
        providerId: "credential",
      },
    });

    if (!account || !account.password) {
      return actionError("No password credentials found for this account.");
    }

    const isMatch = await verifyPassword({
      password: currentPassword,
      hash: account.password,
    });

    if (!isMatch) {
      return actionError("The current password you entered is incorrect.");
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedNewPassword },
    });

    // Security requirement: Revoke all other active sessions for this user
    await revokeAllUserSessions(session.userId, session.sessionToken);

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "PASSWORD_RESET",
      resourceType: "user",
      resourceId: session.userId,
    });

    return actionSuccess(null, "Password has been updated successfully. Other active sessions have been signed out.");
  } catch (err: any) {
    return actionError(err.message || "Failed to change password");
  }
}
