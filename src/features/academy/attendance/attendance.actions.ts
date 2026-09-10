"use server";

import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { bulkSubmitAttendance, editAttendanceRecord } from "@/server/services/attendance.service";
import { writeAuditLog } from "@/lib/audit/audit.service";
import { actionSuccess, actionError } from "@/lib/errors";
import { rateLimiters } from "@/lib/rate-limit/limiter";
import { revalidatePath } from "next/cache";

export async function markBulkAttendanceAction(
  sessionId: string,
  records: Array<{ studentId: string; status: "PRESENT" | "ABSENT" | "LEAVE" }>
) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.ATTENDANCE_MARK);

    const limit = rateLimiters.attendance(session.userId);
    if (!limit.success) {
      return actionError("Too many requests. Please wait and try again.");
    }

    if (!records.length || records.length > 200) {
      return actionError("Invalid number of records");
    }

    const result = await bulkSubmitAttendance({
      organizationId: session.organizationId,
      sessionId,
      records,
      markedById: session.userId,
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "ATTENDANCE_MARK",
      resourceType: "classSession",
      resourceId: sessionId,
      metadata: { count: records.length },
    });

    revalidatePath("/academy/attendance");
    return actionSuccess(result, "Attendance saved");
  } catch (err) {
    const error = err as Error;
    return actionError(error.message ?? "Failed to save attendance");
  }
}

export async function editAttendanceAction(
  recordId: string,
  status: "PRESENT" | "ABSENT" | "LEAVE",
  reason: string
) {
  try {
    const session = await requireAuth();
    await requirePermission(session, PERMISSIONS.ATTENDANCE_EDIT);

    if (!reason || reason.length < 5) {
      return actionError("Reason must be at least 5 characters");
    }

    await editAttendanceRecord({
      organizationId: session.organizationId,
      recordId,
      status,
      reason,
      editedById: session.userId,
    });

    await writeAuditLog({
      organizationId: session.organizationId,
      actorId: session.userId,
      action: "ATTENDANCE_EDIT",
      resourceType: "attendanceRecord",
      resourceId: recordId,
      metadata: { newStatus: status, reason },
    });

    revalidatePath("/academy/attendance");
    return actionSuccess({ updated: true });
  } catch (err) {
    const error = err as Error;
    return actionError(error.message ?? "Failed to edit attendance");
  }
}

