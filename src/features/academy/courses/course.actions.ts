"use server";

import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit.service";
import { actionSuccess, actionError } from "@/lib/errors";
import { createCourseSchema, updateCourseSchema } from "@/lib/validation/schemas";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

export async function createCourseAction(data: unknown) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.COURSES_MANAGE);

    const parsed = createCourseSchema.safeParse(data);
    if (!parsed.success) {
      return actionError("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const course = await prisma.course.create({
      data: {
        publicId: createId(),
        organizationId: session.organizationId,
        name: parsed.data.name,
        description: parsed.data.description || null,
        duration: parsed.data.duration || null,
        defaultFee: parsed.data.defaultFee,
        status: parsed.data.status,
      },
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "CREATE",
      resourceType: "course",
      resourceId: course.id,
      metadata: { name: course.name, defaultFee: parsed.data.defaultFee },
    });

    revalidatePath("/academy/courses");
    return actionSuccess(course, "Course created successfully");
  } catch (err: any) {
    return actionError(err.message || "Failed to create course");
  }
}

export async function updateCourseAction(courseId: string, data: unknown) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.COURSES_MANAGE);

    if (!courseId || typeof courseId !== "string" || courseId.trim().length === 0) {
      return actionError("Invalid course ID");
    }

    const parsed = updateCourseSchema.safeParse(data);
    if (!parsed.success) {
      return actionError("Validation failed", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const existing = await prisma.course.findFirst({
      where: {
        OR: [{ id: courseId }, { publicId: courseId }],
        organizationId: session.organizationId,
      },
    });

    if (!existing) {
      return actionError("Course not found");
    }

    const updated = await prisma.course.update({
      where: { id: existing.id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description || null }),
        ...(parsed.data.duration !== undefined && { duration: parsed.data.duration || null }),
        ...(parsed.data.defaultFee !== undefined && { defaultFee: parsed.data.defaultFee }),
        ...(parsed.data.status !== undefined && { status: parsed.data.status }),
      },
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "UPDATE",
      resourceType: "course",
      resourceId: updated.id,
      metadata: { name: updated.name, status: updated.status },
    });

    revalidatePath("/academy/courses");
    revalidatePath(`/academy/courses/${existing.id}`);
    revalidatePath(`/academy/courses/${existing.publicId}`);
    return actionSuccess(updated, "Course updated successfully");
  } catch (err: any) {
    return actionError(err.message || "Failed to update course");
  }
}

export async function deleteCourseAction(
  courseId: string,
  options?: { forceArchive?: boolean }
) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.COURSES_MANAGE);

    if (!courseId) {
      return actionError("Course ID is required");
    }

    const course = await prisma.course.findFirst({
      where: {
        OR: [{ id: courseId }, { publicId: courseId }],
        organizationId: session.organizationId,
      },
      include: {
        _count: { select: { students: true, batches: true } },
      },
    });

    if (!course) {
      return actionError("Course not found");
    }

    // Check if course has students
    if (course._count.students > 0) {
      if (options?.forceArchive) {
        await prisma.course.update({
          where: { id: course.id },
          data: { status: "ARCHIVED" },
        });

        await writeAuditLog({
          organizationId: session.organizationId,
          actorId: session.userId,
          action: "ARCHIVE",
          resourceType: "course",
          resourceId: course.id,
          metadata: { name: course.name, studentCount: course._count.students },
        });

        revalidatePath("/academy/courses");
        return actionSuccess(
          { archived: true },
          `Course '${course.name}' has been archived (preserved for ${course._count.students} student records).`
        );
      }

      return actionError(
        `Cannot delete '${course.name}' because it has ${course._count.students} enrolled student(s). You can archive this course instead.`
      );
    }

    // Course has 0 students — safe to delete empty batches and course
    await prisma.$transaction(async (tx) => {
      if (course._count.batches > 0) {
        await tx.batch.deleteMany({ where: { courseId: course.id } });
      }
      await tx.course.delete({ where: { id: course.id } });
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "DELETE",
      resourceType: "course",
      resourceId: course.id,
      metadata: { name: course.name },
    });

    revalidatePath("/academy/courses");
    return actionSuccess({ deleted: true }, `Course '${course.name}' deleted successfully.`);
  } catch (err: any) {
    return actionError(err.message || "Failed to delete course");
  }
}



