import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BatchForm } from "@/features/academy/batches/components/BatchForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "New Batch" };

export default async function NewBatchPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.BATCHES_MANAGE);

  const [courses, instructors] = await Promise.all([
    prisma.course.findMany({
      where: { organizationId: session.organizationId, status: "ACTIVE" },
      select: { id: true, name: true, duration: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: {
        organizations: { some: { organizationId: session.organizationId } },
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-3xl">
      <PageHeader title="New Batch" description="Create a new training batch group">
        <Link href="/academy/batches">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
      </PageHeader>

      <BatchForm courses={courses} instructors={instructors} />
    </div>
  );
}

