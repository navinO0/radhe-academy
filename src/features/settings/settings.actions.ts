"use server";

import { requireAuth } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit.service";
import { actionSuccess, actionError } from "@/lib/errors";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(data: unknown) {
  try {
    const session = await requireAuth();

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

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "PASSWORD_RESET",
      resourceType: "user",
      resourceId: session.userId,
    });

    return actionSuccess(null, "Password has been updated successfully.");
  } catch (err: any) {
    return actionError(err.message || "Failed to change password");
  }
}
