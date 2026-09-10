import { Suspense } from "react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/guards";
import { requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { listStudents } from "@/server/services/student.service";
import { StudentTable } from "@/features/academy/students/components/StudentTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { studentListQuerySchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";
export const metadata = { title: "Students" };

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");

  await requirePermission(session, PERMISSIONS.STUDENTS_VIEW);

  const params = await searchParams;
  const query = studentListQuerySchema.safeParse({
    search: params.search,
    status: params.status,
    courseId: params.courseId,
    batchId: params.batchId,
    joiningDateFrom: params.joiningDateFrom,
    joiningDateTo: params.joiningDateTo,
    page: params.page,
    pageSize: params.pageSize,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const validQuery = query.success ? query.data : { page: 1, pageSize: 25, sortOrder: "desc" as const };

  const result = await listStudents({
    organizationId: session.organizationId,
    ...validQuery,
  });

  const canCreate = true; // simplification; proper check done server-side on submit

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader title="Students" description={`${result.pagination.total} students enrolled`}>
        {canCreate && (
          <Link href="/academy/students/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
        )}
      </PageHeader>

      <StudentTable
        students={result.students}
        pagination={result.pagination}
      />
    </div>
  );
}
