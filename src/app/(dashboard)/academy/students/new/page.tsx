import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { StudentRegistrationForm } from "@/features/academy/students/components/StudentRegistrationForm";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New Student" };

export default async function NewStudentPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.STUDENTS_CREATE);

  const [courses, batches] = await Promise.all([
    prisma.course.findMany({
      where: { organizationId: session.organizationId, status: "ACTIVE" },
      select: { id: true, name: true, defaultFee: true },
      orderBy: { name: "asc" },
    }),
    prisma.batch.findMany({
      where: { organizationId: session.organizationId, status: { in: ["UPCOMING", "ACTIVE"] } },
      select: { id: true, name: true, courseId: true, capacity: true, _count: { select: { students: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 w-full max-w-7xl mx-auto">
      <PageHeader title="New Student" description="Register a new student">
        <Link href="/academy/students">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </PageHeader>

      <StudentRegistrationForm
        courses={courses.map((c) => ({ id: c.id, name: c.name, defaultFee: c.defaultFee.toString() }))}
        batches={batches.map((b) => ({
          id: b.id,
          name: b.name,
          courseId: b.courseId,
          capacity: b.capacity,
          enrolled: b._count.students,
        }))}
      />
    </div>
  );
}
