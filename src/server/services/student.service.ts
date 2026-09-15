import { prisma } from "@/lib/db/prisma";
import { createId } from "@paralleldrive/cuid2";
import { NotFoundError, ConflictError, AppError } from "@/lib/errors";
import { Decimal } from "@/lib/money/decimal";
import type { StudentStatus } from "@prisma/client";

// Whitelist of allowed sort columns
const ALLOWED_SORT_FIELDS: Record<string, string> = {
  fullName: "fullName",
  studentCode: "studentCode",
  joiningDate: "joiningDate",
  createdAt: "createdAt",
  status: "status",
};

export interface StudentListQuery {
  organizationId: string;
  search?: string;
  status?: StudentStatus;
  courseId?: string;
  batchId?: string;
  joiningDateFrom?: string;
  joiningDateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function listStudents(query: StudentListQuery) {
  const {
    organizationId,
    search,
    status,
    courseId,
    batchId,
    joiningDateFrom,
    joiningDateTo,
    page = 1,
    pageSize = 25,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  // Whitelist sort field to prevent SQL injection
  const safeSort = ALLOWED_SORT_FIELDS[sortBy] ?? "createdAt";
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  const skip = (safePage - 1) * safePageSize;

  const where = {
    organizationId,
    ...(status && { status }),
    ...(courseId && { courseId }),
    ...(batchId && { batchId }),
    ...(joiningDateFrom || joiningDateTo
      ? {
          joiningDate: {
            ...(joiningDateFrom && { gte: new Date(joiningDateFrom) }),
            ...(joiningDateTo && { lte: new Date(joiningDateTo + "T23:59:59") }),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" as const } },
            { studentCode: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: { [safeSort]: sortOrder },
      skip,
      take: safePageSize,
      // Data minimization — only return list-required fields
      select: {
        id: true,
        publicId: true,
        studentCode: true,
        fullName: true,
        phone: true,
        status: true,
        joiningDate: true,
        createdAt: true,
        profileImageKey: true,
        gender: true,
        course: { select: { id: true, name: true } },
        batch: { select: { id: true, name: true } },
        feeAgreement: {
          select: { totalPayable: true },
        },
      },
    }),
    prisma.student.count({ where }),
  ]);

  // Calculate paid amounts and adjustments for each student
  const studentIds = students.map((s) => s.id);
  const [paidAmounts, adjustments] = await Promise.all([
    prisma.payment.groupBy({
      by: ["studentId"],
      where: { studentId: { in: studentIds }, status: { in: ["SUCCESSFUL", "REFUNDED"] } },
      _sum: { amount: true },
    }),
    prisma.paymentAdjustment.findMany({
      where: {
        payment: { studentId: { in: studentIds } },
        type: { in: ["REFUND", "CANCELLATION"] },
      },
      select: {
        amount: true,
        payment: { select: { studentId: true } },
      },
    }),
  ]);

  const paidMap = new Map(
    paidAmounts.map((p) => [p.studentId, p._sum.amount ?? new Decimal(0)])
  );
  const adjustmentMap = new Map<string, Decimal>();
  for (const adj of adjustments) {
    const sId = adj.payment.studentId;
    const current = adjustmentMap.get(sId) ?? new Decimal(0);
    adjustmentMap.set(sId, current.add(new Decimal(adj.amount.toString())));
  }

  const enriched = students.map((s) => {
    const totalPayable = s.feeAgreement?.totalPayable
      ? new Decimal(s.feeAgreement.totalPayable.toString())
      : new Decimal(0);
    const grossPaid = paidMap.has(s.id)
      ? new Decimal(paidMap.get(s.id)!.toString())
      : new Decimal(0);
    const totalRefunds = adjustmentMap.get(s.id) ?? new Decimal(0);
    const totalPaid = Decimal.max(new Decimal(0), grossPaid.sub(totalRefunds));
    const outstanding = Decimal.max(new Decimal(0), totalPayable.sub(totalPaid));
    const isOverdue = outstanding.gt(0) && true;

    return {
      ...s,
      phone: s.phone, // returned for list (role-based filtering done in API)
      feeAgreement: undefined,
      financials: {
        totalPayable: totalPayable.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        outstanding: outstanding.toFixed(2),
      },
    };
  });

  return {
    students: enriched,
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages: Math.ceil(total / safePageSize),
    },
  };
}

export async function getStudentProfile(
  studentPublicId: string,
  organizationId: string
) {
  const student = await prisma.student.findFirst({
    where: { publicId: studentPublicId, organizationId },
    include: {
      course: true,
      batch: { include: { instructor: { select: { id: true, name: true, email: true } } } },
      feeAgreement: {
        include: {
          instalments: { orderBy: { instalmentNumber: "asc" } },
        },
      },
      createdBy: { select: { id: true, name: true } },
    },
  });

  if (!student) throw new NotFoundError("Student");
  return student;
}

export async function generateStudentCode(
  organizationId: string,
  tx?: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
): Promise<string> {
  const db = tx ?? prisma;
  const count = await db.student.count({ where: { organizationId } });
  const year = new Date().getFullYear().toString().slice(-2);
  return `RA${year}${String(count + 1).padStart(4, "0")}`;
}

export interface CreateStudentInput {
  organizationId: string;
  createdById: string;
  fullName: string;
  phone: string;
  email?: string;
  profileImageKey?: string | null;
  dateOfBirth: Date;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  joiningDate: Date;
  courseId: string;
  batchId?: string;
  notes?: string;
  quotedFee: string;
  registrationFee?: string;
  discountAmount?: string;
  discountReason?: string;
  instalments: Array<{
    label: string;
    amount: string;
    dueDate: Date;
  }>;
}

/**
 * Create a student with fee agreement and instalments in one transaction.
 */
export async function createStudent(input: CreateStudentInput) {
  const {
    organizationId,
    createdById,
    instalments,
    quotedFee,
    registrationFee = "0",
    discountAmount = "0",
    discountReason,
    courseId,
    batchId,
    ...studentData
  } = input;

  return await prisma.$transaction(async (tx) => {
    // 1. Verify course exists and belongs to org
    const course = await tx.course.findFirst({
      where: { id: courseId, organizationId, status: "ACTIVE" },
      select: { id: true, name: true },
    });
    if (!course) throw new NotFoundError("Course");

    // 2. Verify batch if provided (IDOR + capacity)
    let batch = null;
    if (batchId) {
      batch = await tx.batch.findFirst({
        where: { id: batchId, organizationId, courseId },
        include: { _count: { select: { students: true } } },
      });
      if (!batch) throw new NotFoundError("Batch");
      if (batch._count.students >= batch.capacity) {
        throw new AppError(
          "Batch is at full capacity. Contact an admin to override.",
          409
        );
      }
    }

    // 3. Generate student code
    const studentCode = await generateStudentCode(organizationId, tx);

    // 4. Calculate totals
    const quoted = new Decimal(quotedFee);
    const regFee = new Decimal(registrationFee);
    const discount = new Decimal(discountAmount);
    const totalPayable = quoted.add(regFee).sub(discount);

    // 5. Create student
    const student = await tx.student.create({
      data: {
        publicId: createId(),
        organizationId,
        studentCode,
        courseId,
        batchId: batchId ?? null,
        createdById,
        updatedById: createdById,
        registrationDate: new Date(),
        status: "ACTIVE",
        ...studentData,
        profileImageKey: studentData.profileImageKey || null,
        email: studentData.email || null,
        emergencyContactPhone: studentData.emergencyContactPhone || null,
      },
    });

    // 6. Create fee agreement (immutable snapshot)
    const feeAgreement = await tx.feeAgreement.create({
      data: {
        publicId: createId(),
        organizationId,
        studentId: student.id,
        courseId,
        courseName: course.name,
        batchName: batch?.name ?? null,
        quotedFee: quoted.toDecimalPlaces(2),
        registrationFee: regFee.toDecimalPlaces(2),
        discountAmount: discount.toDecimalPlaces(2),
        discountReason: discountReason ?? null,
        totalPayable: totalPayable.toDecimalPlaces(2),
        createdById,
      },
    });

    // 7. Create instalment schedule
    await tx.instalment.createMany({
      data: instalments.map((inst, index) => ({
        publicId: createId(),
        organizationId,
        studentId: student.id,
        feeAgreementId: feeAgreement.id,
        instalmentNumber: index + 1,
        label: inst.label,
        amount: new Decimal(inst.amount).toDecimalPlaces(2),
        dueDate: inst.dueDate,
        status: "PENDING",
        paidAmount: new Decimal(0),
      })),
    });

    // 8. Create batch_student record if batch assigned
    if (batchId) {
      await tx.batchStudent.create({
        data: {
          batchId,
          studentId: student.id,
          status: "ENROLLED",
        },
      });
    }

    return { studentId: student.id, studentPublicId: student.publicId, studentCode };
  });
}

export async function updateStudentStatus(
  studentPublicId: string,
  organizationId: string,
  status: StudentStatus,
  updatedById: string
) {
  const student = await prisma.student.findFirst({
    where: { publicId: studentPublicId, organizationId },
    select: { id: true },
  });
  if (!student) throw new NotFoundError("Student");

  return prisma.student.update({
    where: { id: student.id },
    data: { status, updatedById },
  });
}

export interface UpdateStudentInput {
  fullName?: string;
  phone?: string;
  email?: string | null;
  profileImageKey?: string | null;
  dateOfBirth?: Date | null;
  gender?: any;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;
  batchId?: string | null;
  status?: StudentStatus;
  notes?: string | null;
}

export async function updateStudent(
  studentPublicId: string,
  organizationId: string,
  data: UpdateStudentInput,
  updatedById: string
) {
  const existing = await prisma.student.findFirst({
    where: { publicId: studentPublicId, organizationId },
    select: { id: true, batchId: true, studentCode: true },
  });
  if (!existing) throw new NotFoundError("Student");

  return prisma.$transaction(async (tx) => {
    if (data.batchId !== undefined && data.batchId !== existing.batchId) {
      if (existing.batchId) {
        await tx.batchStudent.deleteMany({
          where: { studentId: existing.id, batchId: existing.batchId },
        });
      }
      if (data.batchId) {
        await tx.batchStudent.upsert({
          where: {
            batchId_studentId: {
              batchId: data.batchId,
              studentId: existing.id,
            },
          },
          update: { status: "ENROLLED" },
          create: {
            batchId: data.batchId,
            studentId: existing.id,
            status: "ENROLLED",
          },
        });
      }
    }

    const updated = await tx.student.update({
      where: { id: existing.id },
      data: {
        ...data,
        updatedById,
        email: data.email === "" ? null : data.email,
        profileImageKey: data.profileImageKey === "" ? null : data.profileImageKey,
        emergencyContactPhone: data.emergencyContactPhone === "" ? null : data.emergencyContactPhone,
      },
    });

    return updated;
  });
}

export interface CancelOrDeleteStudentInput {
  studentPublicId: string;
  organizationId: string;
  reason: string;
  action: "DELETE" | "CANCEL";
  waiveRemainingBalance?: boolean;
  refundAmount?: string;
  refundMethod?: "CASH" | "UPI" | "BANK_TRANSFER" | "CARD" | "OTHER";
  transactionReference?: string;
  userId: string;
}

/**
 * Delete a student (if ₹0 paid) or Cancel admission & settle accounts (preserving audit/accounting records).
 */
export async function cancelOrDeleteStudent(input: CancelOrDeleteStudentInput) {
  return await prisma.$transaction(async (tx) => {
    const student = await tx.student.findFirst({
      where: { publicId: input.studentPublicId, organizationId: input.organizationId },
      include: {
        payments: {
          where: { status: { in: ["SUCCESSFUL", "REFUNDED"] } },
          orderBy: { paymentDate: "desc" },
        },
        feeAgreement: {
          include: { instalments: true },
        },
      },
    });

    if (!student) throw new NotFoundError("Student");

    const successfulPayments = student.payments.filter((p) => p.status === "SUCCESSFUL");

    // Case 1: Hard Delete requested
    if (input.action === "DELETE") {
      if (successfulPayments.length > 0) {
        throw new ConflictError(
          "Cannot permanently delete a student with recorded payments. Please use 'Cancel Admission' to preserve financial and audit records."
        );
      }

      // Safe to delete clean test/unpaid records
      await tx.attendanceRecord.deleteMany({ where: { studentId: student.id } });
      await tx.batchStudent.deleteMany({ where: { studentId: student.id } });
      await tx.instalment.deleteMany({ where: { studentId: student.id } });
      await tx.feeAgreement.deleteMany({ where: { studentId: student.id } });
      await tx.student.delete({ where: { id: student.id } });

      return {
        action: "DELETED",
        studentCode: student.studentCode,
        fullName: student.fullName,
        message: `Student ${student.studentCode} (${student.fullName}) permanently deleted.`,
      };
    }

    // Case 2: Cancel Admission & Settlement (All records maintained)
    // 1. Mark student status as CANCELLED and unassign batch
    await tx.student.update({
      where: { id: student.id },
      data: {
        status: "CANCELLED",
        batchId: null,
        notes: student.notes
          ? `${student.notes}\n[Admission Cancelled: ${input.reason}]`
          : `[Admission Cancelled: ${input.reason}]`,
        updatedById: input.userId,
      },
    });

    // 2. Free up batch seat by setting BatchStudent status to DROPPED
    await tx.batchStudent.updateMany({
      where: { studentId: student.id },
      data: { status: "DROPPED" },
    });

    // 3. Cancel unpaid future instalments
    await tx.instalment.updateMany({
      where: {
        studentId: student.id,
        status: { in: ["PENDING", "OVERDUE"] },
      },
      data: { status: "CANCELLED" },
    });

    // 4. Waive remaining balance if requested
    if (input.waiveRemainingBalance && student.feeAgreement) {
      const grossPaid = successfulPayments.reduce(
        (acc, p) => acc.add(new Decimal(p.amount.toString())),
        new Decimal(0)
      );

      await tx.feeAgreement.update({
        where: { id: student.feeAgreement.id },
        data: {
          totalPayable: grossPaid.toDecimalPlaces(2),
          discountReason: student.feeAgreement.discountReason
            ? `${student.feeAgreement.discountReason} (Balance waived upon cancellation)`
            : "Balance waived upon cancellation",
        },
      });
    }

    return {
      action: "CANCELLED",
      studentCode: student.studentCode,
      fullName: student.fullName,
      message: `Admission for ${student.studentCode} (${student.fullName}) has been cancelled. Batch seat freed and unpaid dues settled.`,
    };
  });
}


