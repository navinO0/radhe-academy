import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Users } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { EditBatchDialog } from "@/features/academy/batches/components/EditBatchDialog";
import { DeleteBatchDialog } from "@/features/academy/batches/components/DeleteBatchDialog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Batches" };

const BATCH_STATUS_VARIANTS: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  UPCOMING: "secondary",
  ACTIVE: "success",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export default async function BatchesPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.BATCHES_VIEW);

  const [batches, courses, instructors] = await Promise.all([
    prisma.batch.findMany({
      where: { organizationId: session.organizationId },
      include: {
        course: { select: { id: true, name: true } },
        instructor: { select: { id: true, name: true } },
        _count: { select: { students: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      where: { organizationId: session.organizationId, status: "ACTIVE" },
      select: { id: true, name: true, duration: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { organizations: { some: { organizationId: session.organizationId } } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader title="Batches" description={`${batches.length} batches`}>
        <Link href="/academy/batches/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Batch
          </Button>
        </Link>
      </PageHeader>

      {batches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border rounded-md">
          <Layers className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No batches yet. Create your first batch.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="hidden md:table-cell">Instructor</TableHead>
                  <TableHead>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Enrolled</span>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                  <TableHead className="hidden lg:table-cell">End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{batch.course.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{batch.instructor?.name ?? "—"}</TableCell>
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
                            courseId: batch.course.id,
                            instructorId: batch.instructor?.id,
                            capacity: batch.capacity,
                            startDate: batch.startDate ? new Date(batch.startDate).toISOString().split("T")[0] : null,
                            endDate: batch.endDate ? new Date(batch.endDate).toISOString().split("T")[0] : null,
                            status: batch.status as any,
                          }}
                          courses={courses}
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
        </div>
      )}
    </div>
  );
}
