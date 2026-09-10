import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { AttendanceMarker } from "@/features/academy/attendance/components/AttendanceMarker";
import { formatDate } from "@/lib/utils";
import { AttendanceHistoryView } from "@/features/academy/attendance/components/AttendanceHistoryView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createId } from "@paralleldrive/cuid2";

export const dynamic = "force-dynamic";
export const metadata = { title: "Attendance" };

export default async function AttendancePage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.ATTENDANCE_VIEW);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  // Get today's sessions or any recent scheduled sessions
  let sessions = await prisma.classSession.findMany({
    where: {
      organizationId: session.organizationId,
      date: { gte: today, lte: todayEnd },
    },
    include: {
      batch: { select: { id: true, name: true } },
      _count: { select: { attendanceRecords: true } },
    },
    orderBy: { date: "asc" },
  });

  const batches = await prisma.batch.findMany({
    where: {
      organizationId: session.organizationId,
      status: "ACTIVE",
    },
    select: { id: true, name: true, courseId: true },
    orderBy: { name: "asc" },
  });

  if (sessions.length === 0 && batches.length > 0) {
    for (const batch of batches) {
      await prisma.classSession.create({
        data: {
          id: createId(),
          organizationId: session.organizationId,
          batchId: batch.id,
          date: new Date(),
          status: "SCHEDULED",
          topic: "Class Session",
        },
      });
    }

    sessions = await prisma.classSession.findMany({
      where: {
        organizationId: session.organizationId,
        date: { gte: today, lte: todayEnd },
      },
      include: {
        batch: { select: { id: true, name: true } },
        _count: { select: { attendanceRecords: true } },
      },
      orderBy: { date: "asc" },
    });
  }

  // Get historical sessions with student attendance records
  const historySessionsRaw = await prisma.classSession.findMany({
    where: {
      organizationId: session.organizationId,
    },
    include: {
      batch: { select: { id: true, name: true } },
      attendanceRecords: {
        include: {
          student: {
            select: {
              id: true,
              publicId: true,
              studentCode: true,
              fullName: true,
            },
          },
        },
      },
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  const historySessions = historySessionsRaw.map((s) => ({
    id: s.id,
    publicId: s.publicId,
    date: s.date.toISOString(),
    startTime: s.startTime,
    endTime: s.endTime,
    topic: s.topic,
    status: s.status,
    batch: s.batch,
    records: s.attendanceRecords.map((r) => ({
      id: r.id,
      status: r.status,
      markedAt: r.markedAt.toISOString(),
      student: r.student,
    })),
  }));

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Attendance"
        description="Daily attendance marking and session history"
      />

      <Tabs defaultValue="mark" className="space-y-6">
        <TabsList className="grid w-full sm:w-80 grid-cols-2">
          <TabsTrigger value="mark">Mark Today</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="space-y-4">
          <AttendanceMarker
            sessions={sessions.map((s) => ({
              id: s.id,
              batchName: s.batch.name,
              topic: s.topic,
              status: s.status,
              attendanceCount: s._count.attendanceRecords,
            }))}
            batches={batches}
            organizationId={session.organizationId}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <AttendanceHistoryView
            sessions={historySessions}
            batches={batches}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

