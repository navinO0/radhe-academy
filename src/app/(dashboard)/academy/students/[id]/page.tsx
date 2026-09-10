import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudentProfileView } from "@/features/academy/students/components/StudentProfileView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.STUDENTS_VIEW);

  const { id: publicId } = await params;

  const student = await prisma.student.findFirst({
    where: { publicId, organizationId: session.organizationId },
    include: {
      course: true,
      batch: { include: { instructor: { select: { id: true, name: true, email: true } } } },
      feeAgreement: {
        include: {
          instalments: { orderBy: { instalmentNumber: "asc" } },
        },
      },
      payments: {
        where: { status: "SUCCESSFUL" },
        include: { receipt: true, instalment: true },
        orderBy: { paymentDate: "desc" },
      },
      receipts: {
        orderBy: { createdAt: "desc" },
      },
      attendanceRecords: {
        include: { session: true },
        orderBy: { markedAt: "desc" },
        take: 30,
      },
      createdBy: { select: { name: true } },
    },
  });

  if (!student) notFound();

  const availableBatches = await prisma.batch.findMany({
    where: {
      organizationId: session.organizationId,
      courseId: student.courseId,
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Calculate totals
  const totalPayable = student.feeAgreement?.totalPayable.toNumber() ?? 0;
  const totalPaid = student.payments.reduce((sum, p) => sum + p.amount.toNumber(), 0);
  const outstanding = Math.max(0, totalPayable - totalPaid);

  // Calculate attendance %
  const totalClasses = student.attendanceRecords.length;
  const presentClasses = student.attendanceRecords.filter((a) => a.status === "PRESENT").length;
  const attendancePct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-6xl">
      <PageHeader
        title={student.fullName}
        description={`Student ID: ${student.studentCode} • Enrolled in ${student.course.name}`}
      >
        <Link href="/academy/students">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Students
          </Button>
        </Link>
      </PageHeader>

      <StudentProfileView
        student={{
          ...student,
          quotedFee: student.feeAgreement?.quotedFee.toString() ?? "0",
          totalPayable: totalPayable.toFixed(2),
          totalPaid: totalPaid.toFixed(2),
          outstanding: outstanding.toFixed(2),
          attendancePct,
          instalments: (student.feeAgreement?.instalments ?? []).map((inst) => ({
            id: inst.id,
            publicId: inst.publicId,
            label: inst.label,
            amount: inst.amount.toString(),
            paidAmount: inst.paidAmount.toString(),
            dueDate: inst.dueDate.toISOString(),
            status: inst.status,
          })),
          payments: student.payments.map((p) => ({
            id: p.id,
            publicId: p.publicId,
            amount: p.amount.toString(),
            paymentDate: p.paymentDate.toISOString(),
            paymentMethod: p.paymentMethod,
            transactionReference: p.transactionReference,
            status: p.status,
            receiptNumber: p.receipt?.receiptNumber,
            receiptPublicId: p.receipt?.publicId,
            instalmentLabel: p.instalment?.label,
          })),
          attendance: student.attendanceRecords.map((a) => ({
            id: a.id,
            status: a.status,
            markedAt: a.markedAt.toISOString(),
            topic: a.session.topic,
            date: a.session.date.toISOString(),
          })),
        }}
        availableBatches={availableBatches}
      />
    </div>
  );
}

