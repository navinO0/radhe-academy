"use server";

import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { createStudentSchema, updateStudentSchema } from "@/lib/validation/schemas";
import { createStudent, updateStudentStatus, updateStudent } from "@/server/services/student.service";
import { writeAuditLog } from "@/lib/audit/audit.service";
import { actionSuccess, actionError } from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStudentAction(formData: unknown) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.STUDENTS_CREATE);

    const parsed = createStudentSchema.safeParse(formData);
    if (!parsed.success) {
      return actionError("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { instalments, quotedFee, registrationFee, discountAmount, discountReason, courseId, batchId, ...studentData } = parsed.data;

    const result = await createStudent({
      organizationId: session.organizationId,
      createdById: session.userId,
      courseId,
      batchId,
      quotedFee,
      registrationFee,
      discountAmount,
      discountReason,
      instalments,
      ...studentData,
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "CREATE",
      resourceType: "student",
      resourceId: result.studentId,
      metadata: { studentCode: result.studentCode, courseId },
    });

    revalidatePath("/academy/students");
    return actionSuccess(result, `Student ${result.studentCode} registered successfully`);
  } catch (err) {
    const error = err as Error;
    return actionError(error.message ?? "Failed to create student");
  }
}

export async function updateStudentStatusAction(publicId: string, status: string) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.STUDENTS_UPDATE);

    const validStatus = ["ACTIVE", "COMPLETED", "ON_HOLD", "DROPPED", "CANCELLED"] as const;
    if (!validStatus.includes(status as (typeof validStatus)[number])) {
      return actionError("Invalid status");
    }

    await updateStudentStatus(
      publicId,
      session.organizationId,
      status as (typeof validStatus)[number],
      session.userId
    );

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "UPDATE",
      resourceType: "student",
      metadata: { publicId, newStatus: status },
    });

    revalidatePath("/academy/students");
    revalidatePath(`/academy/students/${publicId}`);
    return actionSuccess({ updated: true });
  } catch (err) {
    const error = err as Error;
    return actionError(error.message ?? "Failed to update status");
  }
}

export async function updateStudentAction(publicId: string, formData: unknown) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.STUDENTS_UPDATE);

    const parsed = updateStudentSchema.safeParse(formData);
    if (!parsed.success) {
      return actionError("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const updated = await updateStudent(
      publicId,
      session.organizationId,
      {
        ...parsed.data,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : undefined,
      },
      session.userId
    );

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "UPDATE",
      resourceType: "student",
      resourceId: updated.id,
      metadata: { publicId, studentCode: updated.studentCode },
    });

    revalidatePath("/academy/students");
    revalidatePath(`/academy/students/${publicId}`);
    return actionSuccess(updated, "Student details updated successfully");
  } catch (err: any) {
    return actionError(err.message || "Failed to update student details");
  }
}
