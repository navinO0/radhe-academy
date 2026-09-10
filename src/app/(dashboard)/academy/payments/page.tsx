import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payments" };

export default async function PaymentsPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.PAYMENTS_VIEW);

  const payments = await prisma.payment.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      student: { select: { fullName: true, studentCode: true, publicId: true } },
      instalment: { select: { label: true } },
      receipt: { select: { receiptNumber: true, publicId: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader title="Payments" description="Recent financial transactions & receipts" />

      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="hidden md:table-cell">Instalment</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No payments recorded yet
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      {payment.receipt?.receiptNumber ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/academy/students/${payment.student.publicId}`}
                        className="hover:underline"
                      >
                        <p className="font-medium">{payment.student.fullName}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {payment.student.studentCode}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {payment.instalment?.label ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(payment.paymentDate)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {payment.paymentMethod.replace("_", " ")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(payment.amount.toString())}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "SUCCESSFUL"
                            ? "success"
                            : payment.status === "CANCELLED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.receipt?.publicId && (
                        <a
                          href={`/api/academy/receipts/${payment.receipt.publicId}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

