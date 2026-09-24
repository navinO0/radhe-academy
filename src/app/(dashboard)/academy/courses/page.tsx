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
import { CourseSearch } from "@/features/academy/courses/components/CourseSearch";

export const dynamic = "force-dynamic";
export const metadata = { title: "Courses" };

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.COURSES_VIEW);

  const canViewFees = await hasPermission(session.userId, session.organizationId, PERMISSIONS.FEES_VIEW);

  const params = await searchParams;
  const search = params.search?.trim();
  const status = params.status;

  const whereClause: any = {
    organizationId: session.organizationId,
  };

  if (status && status !== "all") {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { duration: { contains: search, mode: "insensitive" } },
    ];
  }

  const [courses, totalCourseCount] = await Promise.all([
    prisma.course.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { students: true, batches: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({
      where: { organizationId: session.organizationId },
    }),
  ]);

  const canManage = true;
  const isFiltered = Boolean(search || (status && status !== "all"));

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Courses"
        description={
          isFiltered
            ? `Showing ${courses.length} of ${totalCourseCount} courses`
            : `${totalCourseCount} courses available`
        }
      >
        {canManage && (
          <Link href="/academy/courses/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Course
            </Button>
          </Link>
        )}
      </PageHeader>

      {/* Search and Filters with Search Button */}
      <CourseSearch />

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border rounded-md p-6">
          <BookOpen className="h-10 w-10 mb-3 opacity-30" />
          {isFiltered ? (
            <>
              <p className="text-base font-medium text-foreground">No courses match your search</p>
              <p className="text-xs mt-1 text-muted-foreground max-w-sm">
                We couldn&apos;t find any course matching &ldquo;{search || status}&rdquo;. Try another term or reset your search.
              </p>
              <Link href="/academy/courses" className="mt-4">
                <Button variant="outline" size="sm">
                  Clear Filters
                </Button>
              </Link>
            </>
          ) : (
            <p className="text-sm">No courses yet. Create your first course.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/academy/courses/${course.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{course.name}</CardTitle>
                    <Badge
                      variant={
                        course.status === "ACTIVE"
                          ? "success"
                          : course.status === "INACTIVE"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-xs shrink-0 ml-2"
                    >
                      {course.status}
                    </Badge>
                  </div>
                  {course.description && (
                    <CardDescription className="line-clamp-2 mt-1">
                      {course.description}
                    </CardDescription>
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
