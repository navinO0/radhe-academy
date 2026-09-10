import { prisma } from "@/lib/db/prisma";
import { NotFoundError, AppError } from "@/lib/errors";
import { createId } from "@paralleldrive/cuid2";

/**
 * Bulk submit attendance for a class session.
 * Single transaction — all-or-nothing.
 */
export async function bulkSubmitAttendance(input: {
  organizationId: string;
  sessionId: string;
  records: Array<{ studentId: string; status: "PRESENT" | "ABSENT" | "LEAVE" }>;
  markedById: string;
}) {
  const { organizationId, sessionId, records, markedById } = input;

  if (records.length > 200) {
    throw new AppError("Maximum 200 attendance records per submission", 422);
  }

  return await prisma.$transaction(async (tx) => {
    // Verify session belongs to organization
    const session = await tx.classSession.findFirst({
      where: { id: sessionId, organizationId },
      include: {
        batch: {
          include: {
            students: {
              where: { status: "ENROLLED" },
              select: { studentId: true },
            },
          },
        },
      },
    });
    if (!session) throw new NotFoundError("Class session");

    const enrolledIds = new Set(
      session.batch.students.map((bs) => bs.studentId)
    );

    // Verify all submitted students are enrolled
    for (const record of records) {
      if (!enrolledIds.has(record.studentId)) {
        throw new AppError(
          `Student ${record.studentId} is not enrolled in this batch`,
          422
        );
      }
    }

    const now = new Date();

    // Upsert attendance records (handle re-submission gracefully)
    await Promise.all(
      records.map((record) =>
        tx.attendanceRecord.upsert({
          where: {
            sessionId_studentId: {
              sessionId,
              studentId: record.studentId,
            },
          },
          create: {
            publicId: createId(),
            organizationId,
            sessionId,
            studentId: record.studentId,
            status: record.status,
            markedAt: now,
            markedById,
          },
          update: {
            status: record.status,
            editedAt: now,
            editedById: markedById,
          },
        })
      )
    );

    // Update session status to COMPLETED if it was SCHEDULED
    if (session.status === "SCHEDULED") {
      await tx.classSession.update({
        where: { id: sessionId },
        data: { status: "COMPLETED" },
      });
    }

    return { success: true, count: records.length };
  });
}

/**
 * Edit a single attendance record (requires audit trail).
 */
export async function editAttendanceRecord(input: {
  organizationId: string;
  recordId: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
  reason: string;
  editedById: string;
}) {
  const { organizationId, recordId, status, reason, editedById } = input;

  const record = await prisma.attendanceRecord.findFirst({
    where: { id: recordId, organizationId },
  });
  if (!record) throw new NotFoundError("Attendance record");

  return prisma.attendanceRecord.update({
    where: { id: recordId },
    data: {
      status,
      editedAt: new Date(),
      editedById,
      editReason: reason,
    },
  });
}

/**
 * Get attendance report for a student.
 */
export async function getStudentAttendanceReport(input: {
  organizationId: string;
  studentId: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  const { organizationId, studentId, dateFrom, dateTo } = input;

  const records = await prisma.attendanceRecord.findMany({
    where: {
      organizationId,
      studentId,
      ...(dateFrom || dateTo
        ? {
            session: {
              date: {
                ...(dateFrom && { gte: dateFrom }),
                ...(dateTo && { lte: dateTo }),
              },
            },
          }
        : {}),
    },
    include: {
      session: {
        select: { date: true, topic: true, batch: { select: { name: true } } },
      },
    },
    orderBy: { session: { date: "desc" } },
  });

  const total = records.length;
  const present = records.filter((r) => r.status === "PRESENT").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  const leave = records.filter((r) => r.status === "LEAVE").length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    records,
    summary: { total, present, absent, leave, percentage },
  };
}

/**
 * Get attendance for a batch session (for marking UI).
 */
export async function getSessionForAttendance(
  sessionId: string,
  organizationId: string
) {
  const session = await prisma.classSession.findFirst({
    where: { id: sessionId, organizationId },
    include: {
      batch: {
        include: {
          students: {
            where: { status: "ENROLLED" },
            include: {
              student: {
                select: {
                  id: true,
                  studentCode: true,
                  fullName: true,
                  profileImageKey: true,
                },
              },
            },
          },
        },
      },
      attendanceRecords: true,
    },
  });

  if (!session) throw new NotFoundError("Class session");

  const attendanceMap = new Map(
    session.attendanceRecords.map((r) => [r.studentId, r.status])
  );

  const students = session.batch.students.map((bs) => ({
    ...bs.student,
    currentStatus: attendanceMap.get(bs.student.id) ?? null,
  }));

  return {
    session: {
      id: session.id,
      publicId: session.publicId,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      topic: session.topic,
      status: session.status,
      batch: {
        id: session.batch.id,
        name: session.batch.name,
      },
    },
    students,
    isSubmitted: session.status === "COMPLETED",
  };
}

