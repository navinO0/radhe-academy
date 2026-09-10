import { requireAuth, requirePermission, hasPermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Courses" };

export default async function CoursesPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.COURSES_VIEW);

  const canViewFees = await hasPermission(session.userId, session.organizationId, PERMISSIONS.FEES_VIEW);

  const courses = await prisma.course.findMany({
    where: { organizationId: session.organizationId },
    include: {
      _count: {
        select: { students: true, batches: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const canManage = true;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader title="Courses" description={`${courses.length} courses`}>
        {canManage && (
          <Link href="/academy/courses/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Course
            </Button>
          </Link>
        )}
      </PageHeader>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border rounded-md">
          <BookOpen className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No courses yet. Create your first course.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/academy/courses/${course.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{course.name}</CardTitle>
                    <Badge
                      variant={course.status === "ACTIVE" ? "success" : course.status === "INACTIVE" ? "warning" : "secondary"}
                      className="text-xs shrink-0 ml-2"
                    >
                      {course.status}
                    </Badge>
                  </div>
                  {course.description && (
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">{course.duration ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="text-sm font-medium">{course._count.students}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Batches</p>
                      <p className="text-sm font-medium">{course._count.batches}</p>
                    </div>
                  </div>
                  {canViewFees && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">Default Fee</p>
                      <p className="text-lg font-semibold">{formatCurrency(course.defaultFee.toString())}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
