import { requireAuth, requirePermission, hasPermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Layers, Plus, UserPlus, Users } from "lucide-react";
import { EditCourseDialog } from "@/features/academy/courses/components/EditCourseDialog";
import { DeleteCourseDialog } from "@/features/academy/courses/components/DeleteCourseDialog";
import { EditBatchDialog } from "@/features/academy/batches/components/EditBatchDialog";
import { DeleteBatchDialog } from "@/features/academy/batches/components/DeleteBatchDialog";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.COURSES_VIEW);

  const canViewFees = await hasPermission(session.userId, session.organizationId, PERMISSIONS.FEES_VIEW);

  const { id } = await params;

  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id }, { publicId: id }],
      organizationId: session.organizationId,
    },
    include: {
      batches: {
        include: {
          instructor: { select: { id: true, name: true } },
          _count: { select: { students: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      students: {
        select: {
          id: true,
          publicId: true,
          fullName: true,
          studentCode: true,
          status: true,
          joiningDate: true,
          batch: { select: { name: true } },
        },
        orderBy: { joiningDate: "desc" },
        take: 50,
      },
      _count: {
        select: { students: true, batches: true },
      },
    },
  });

  if (!course) notFound();

  const instructors = await prisma.user.findMany({
    where: {
      organizations: { some: { organizationId: session.organizationId } },
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const BATCH_STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
    ACTIVE: "success",
    UPCOMING: "secondary",
    COMPLETED: "outline",
    CANCELLED: "destructive",
  };

  const STUDENT_STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
    ACTIVE: "success",
    INACTIVE: "secondary",
    COMPLETED: "outline",
    DROPPED: "destructive",
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 w-full max-w-7xl mx-auto">
      <PageHeader
        title={course.name}
        description={course.description || "Course details and curriculum management"}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/academy/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <EditCourseDialog
            course={{
              id: course.id,
              name: course.name,
              description: course.description,
              duration: course.duration,
              defaultFee: course.defaultFee.toString(),
              status: course.status as any,
            }}
          />
          <DeleteCourseDialog
            course={{
              id: course.id,
              name: course.name,
              studentCount: course._count.students,
              batchCount: course._count.batches,
              status: course.status,
            }}
          />
          <Link href="/academy/batches/new">
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-1" /> New Batch
            </Button>
          </Link>
          <Link href="/academy/students/new">
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-1" /> Register Student
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className={`grid gap-4 ${canViewFees ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Course Status</CardDescription>
            <CardTitle className="text-lg">
              <Badge variant={course.status === "ACTIVE" ? "success" : "secondary"}>
                {course.status}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {canViewFees && (
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Standard Fee</CardDescription>
              <CardTitle className="text-xl font-bold">
                {formatCurrency(course.defaultFee.toString())}
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Duration</CardDescription>
            <CardTitle className="text-xl font-bold">
              {course.duration || "Self-Paced"}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Enrolled</CardDescription>
            <CardTitle className="text-xl font-bold">
              {course._count.students} Students
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Batches ({course.batches.length})
            </CardTitle>
            <CardDescription>Scheduled batches offering this course</CardDescription>
          </div>
          <Link href="/academy/batches/new">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Batch
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {course.batches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-36 text-center text-muted-foreground border rounded-md">
              <Layers className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No batches created for this course yet.</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead className="hidden md:table-cell">Instructor</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                    <TableHead className="hidden lg:table-cell">End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {batch.instructor?.name ?? "—"}
                      </TableCell>
                      <TableCell>
                        <span className={batch._count.students >= batch.capacity ? "text-red-600 font-medium" : ""}>
                          {batch._count.students} / {batch.capacity}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {batch.startDate ? formatDate(batch.startDate) : "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {batch.endDate ? formatDate(batch.endDate) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={BATCH_STATUS_VARIANTS[batch.status] ?? "secondary"}>
                          {batch.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditBatchDialog
                            batch={{
                              id: batch.id,
                              name: batch.name,
                              courseId: course.id,
                              instructorId: batch.instructorId,
                              capacity: batch.capacity,
                              startDate: batch.startDate ? new Date(batch.startDate).toISOString().split("T")[0] : null,
                              endDate: batch.endDate ? new Date(batch.endDate).toISOString().split("T")[0] : null,
                              timing: (batch.schedule as any)?.time || null,
                              status: batch.status as any,
                            }}
                            courses={[{ id: course.id, name: course.name }]}
                            instructors={instructors}
                          />
                          <DeleteBatchDialog
                            batch={{
                              id: batch.id,
                              name: batch.name,
                              studentCount: batch._count.students,
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrolled Students Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Enrolled Students ({course.students.length})
            </CardTitle>
            <CardDescription>Recently enrolled students in this course</CardDescription>
          </div>
          <Link href="/academy/students/new">
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-1" /> New Student
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {course.students.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-36 text-center text-muted-foreground border rounded-md">
              <Users className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No students currently enrolled in this course.</p>
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden md:table-cell">Batch</TableHead>
                    <TableHead className="hidden md:table-cell">Joining Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Link
                          href={`/academy/students/${student.publicId}`}
                          className="hover:underline font-medium block"
                        >
                          {student.fullName}
                          <span className="block text-xs text-muted-foreground font-mono">
                            {student.studentCode}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.batch?.name ?? "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(student.joiningDate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STUDENT_STATUS_VARIANTS[student.status] ?? "secondary"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/academy/students/${student.publicId}`}>
                          <Button variant="ghost" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
