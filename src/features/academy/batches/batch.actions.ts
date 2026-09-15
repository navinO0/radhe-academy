"use server";

import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit.service";
import { actionSuccess, actionError } from "@/lib/errors";
import { createBatchSchema, updateBatchSchema } from "@/lib/validation/schemas";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

export async function createBatchAction(data: unknown) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.BATCHES_MANAGE);

    const parsed = createBatchSchema.safeParse(data);
    if (!parsed.success) {
      return actionError("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const batch = await prisma.batch.create({
      data: {
        publicId: createId(),
        organizationId: session.organizationId,
        name: parsed.data.name,
        courseId: parsed.data.courseId,
        instructorId: parsed.data.instructorId || null,
        capacity: parsed.data.capacity,
        startDate: parsed.data.startDate || null,
        endDate: parsed.data.endDate || null,
        schedule: parsed.data.schedule || undefined,
        status: parsed.data.status,
      },
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "CREATE",
      resourceType: "batch",
      resourceId: batch.id,
      metadata: { name: batch.name, capacity: batch.capacity, courseId: batch.courseId },
    });

    revalidatePath("/academy/batches");
    return actionSuccess(batch, "Batch created successfully");
  } catch (err: any) {
    return actionError(err.message || "Failed to create batch");
  }
}

export async function updateBatchAction(batchId: string, data: unknown) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.BATCHES_MANAGE);

    if (!batchId || typeof batchId !== "string" || batchId.trim().length === 0) {
      return actionError("Invalid batch ID");
    }

    const parsed = updateBatchSchema.safeParse(data);
    if (!parsed.success) {
      return actionError("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const existing = await prisma.batch.findFirst({
      where: {
        OR: [{ id: batchId }, { publicId: batchId }],
        organizationId: session.organizationId,
      },
    });

    if (!existing) {
      return actionError("Batch not found");
    }

    const updated = await prisma.batch.update({
      where: { id: existing.id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.courseId !== undefined && { courseId: parsed.data.courseId }),
        ...(parsed.data.instructorId !== undefined && {
          instructorId: parsed.data.instructorId && parsed.data.instructorId !== "none" ? parsed.data.instructorId : null,
        }),
        ...(parsed.data.capacity !== undefined && { capacity: parsed.data.capacity }),
        ...(parsed.data.startDate !== undefined && { startDate: parsed.data.startDate || null }),
        ...(parsed.data.endDate !== undefined && { endDate: parsed.data.endDate || null }),
        ...(parsed.data.schedule !== undefined && { schedule: parsed.data.schedule || undefined }),
        ...(parsed.data.status !== undefined && { status: parsed.data.status }),
      },
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "UPDATE",
      resourceType: "batch",
      resourceId: updated.id,
      metadata: { name: updated.name, status: updated.status },
    });

    revalidatePath("/academy/batches");
    revalidatePath(`/academy/courses/${existing.courseId}`);
    return actionSuccess(updated, "Batch updated successfully");
  } catch (err: any) {
    return actionError(err.message || "Failed to update batch");
  }
}

export async function deleteBatchAction(
  batchId: string,
  options?: { forceUnassign?: boolean }
) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.BATCHES_MANAGE);

    if (!batchId) {
      return actionError("Batch ID is required");
    }

    const batch = await prisma.batch.findFirst({
      where: {
        OR: [{ id: batchId }, { publicId: batchId }],
        organizationId: session.organizationId,
      },
      include: {
        _count: { select: { students: true } },
      },
    });

    if (!batch) {
      return actionError("Batch not found");
    }

    if (batch._count.students > 0 && !options?.forceUnassign) {
      return actionError(
        `Batch '${batch.name}' has ${batch._count.students} enrolled student(s). Please unassign students first, or confirm to delete and unassign them.`
      );
    }

    await prisma.$transaction(async (tx) => {
      // 1. Unassign students if forceUnassign
      if (batch._count.students > 0) {
        await tx.student.updateMany({
          where: { batchId: batch.id },
          data: { batchId: null },
        });
        await tx.batchStudent.deleteMany({
          where: { batchId: batch.id },
        });
      }

      // 2. Delete class sessions and attendance records
      const sessions = await tx.classSession.findMany({
        where: { batchId: batch.id },
        select: { id: true },
      });
      if (sessions.length > 0) {
        const sessionIds = sessions.map((s) => s.id);
        await tx.attendanceRecord.deleteMany({
          where: { sessionId: { in: sessionIds } },
        });
        await tx.classSession.deleteMany({
          where: { batchId: batch.id },
        });
      }

      // 3. Delete batch
      await tx.batch.delete({ where: { id: batch.id } });
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "DELETE",
      resourceType: "batch",
      resourceId: batch.id,
      metadata: { name: batch.name, courseId: batch.courseId },
    });

    revalidatePath("/academy/batches");
    revalidatePath(`/academy/courses/${batch.courseId}`);
    return actionSuccess({ deleted: true }, `Batch '${batch.name}' deleted successfully.`);
  } catch (err: any) {
    return actionError(err.message || "Failed to delete batch");
  }
}



