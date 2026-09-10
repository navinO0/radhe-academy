import { prisma } from "@/lib/db/prisma";
import { NotFoundError, AppError } from "@/lib/errors";
import { createId } from "@paralleldrive/cuid2";

export interface DashboardStats {
  students: {
    total: number;
    active: number;
    newThisMonth: number;
    completed: number;
    onHold: number;
    dropped: number;
  };
  financial: {
    totalQuotedFees: string;
    totalRegistrationFees: string;
    totalCollected: string;
    outstandingBalance: string;
    collectedToday: string;
    collectedThisMonth: string;
  };
  attendance: {
    todaysSessions: number;
    totalPresent: number;
    totalAbsent: number;
    totalLeave: number;
  };
  upcoming: {
    overdueInstalments: number;
    upcomingInstalments: number; // due in next 7 days
  };
}

/**
 * Optimized dashboard stats — uses aggregate queries, not individual queries per card.
 */
export async function getDashboardStats(
  organizationId: string
): Promise<DashboardStats> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Run all queries in parallel
  const [
    studentsByStatus,
    newStudentsThisMonth,
    feeAgreementAggs,
    totalCollectedAgg,
    collectedTodayAgg,
    collectedThisMonthAgg,
    todaysSessions,
    todayAttendance,
    overdueInstalments,
    upcomingInstalments,
  ] = await Promise.all([
    // Student counts by status
    prisma.student.groupBy({
      by: ["status"],
      where: { organizationId },
      _count: true,
    }),

    // New students this month
    prisma.student.count({
      where: {
        organizationId,
        createdAt: { gte: monthStart, lte: monthEnd },
      },
    }),

    // Fee totals
    prisma.feeAgreement.aggregate({
      where: { organizationId },
      _sum: {
        totalPayable: true,
        registrationFee: true,
      },
    }),

    // Total collected (all time successful payments)
    prisma.payment.aggregate({
      where: { organizationId, status: "SUCCESSFUL" },
      _sum: { amount: true },
    }),

    // Collected today
    prisma.payment.aggregate({
      where: {
        organizationId,
        status: "SUCCESSFUL",
        paymentDate: { gte: todayStart, lte: todayEnd },
      },
      _sum: { amount: true },
    }),

    // Collected this month
    prisma.payment.aggregate({
      where: {
        organizationId,
        status: "SUCCESSFUL",
        paymentDate: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    }),

    // Today's sessions count
    prisma.classSession.count({
      where: {
        organizationId,
        date: { gte: todayStart, lte: todayEnd },
        status: { not: "CANCELLED" },
      },
    }),

    // Today's attendance
    prisma.attendanceRecord.groupBy({
      by: ["status"],
      where: {
        organizationId,
        session: {
          date: { gte: todayStart, lte: todayEnd },
        },
      },
      _count: true,
    }),

    // Overdue instalments
    prisma.instalment.count({
      where: {
        organizationId,
        status: { in: ["PENDING", "PARTIALLY_PAID"] },
        dueDate: { lt: now },
      },
    }),

    // Upcoming instalments (next 7 days)
    prisma.instalment.count({
      where: {
        organizationId,
        status: { in: ["PENDING", "PARTIALLY_PAID"] },
        dueDate: { gte: now, lte: nextWeek },
      },
    }),
  ]);

  // Process student counts
  const studentMap = Object.fromEntries(
    studentsByStatus.map((s) => [s.status, s._count])
  );

  const totalStudents = Object.values(studentMap).reduce((a, b) => a + b, 0);
  const totalCollected = totalCollectedAgg._sum.amount?.toString() ?? "0";
  const totalPayable = feeAgreementAggs._sum.totalPayable?.toString() ?? "0";
  const outstanding = (
    parseFloat(totalPayable) - parseFloat(totalCollected)
  ).toFixed(2);

  // Process attendance
  const attendanceMap = Object.fromEntries(
    todayAttendance.map((a) => [a.status, a._count])
  );

  return {
    students: {
      total: totalStudents,
      active: studentMap["ACTIVE"] ?? 0,
      newThisMonth: newStudentsThisMonth,
      completed: studentMap["COMPLETED"] ?? 0,
      onHold: studentMap["ON_HOLD"] ?? 0,
      dropped: studentMap["DROPPED"] ?? 0,
    },
    financial: {
      totalQuotedFees: totalPayable,
      totalRegistrationFees:
        feeAgreementAggs._sum.registrationFee?.toString() ?? "0",
      totalCollected,
      outstandingBalance: outstanding,
      collectedToday: collectedTodayAgg._sum.amount?.toString() ?? "0",
      collectedThisMonth: collectedThisMonthAgg._sum.amount?.toString() ?? "0",
    },
    attendance: {
      todaysSessions,
      totalPresent: attendanceMap["PRESENT"] ?? 0,
      totalAbsent: attendanceMap["ABSENT"] ?? 0,
      totalLeave: attendanceMap["LEAVE"] ?? 0,
    },
    upcoming: {
      overdueInstalments,
      upcomingInstalments,
    },
  };
}

