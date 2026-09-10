import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Receipt } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Receipts" };

export default async function ReceiptsPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.RECEIPTS_VIEW);

  const receipts = await prisma.receipt.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      student: { select: { fullName: true, studentCode: true, publicId: true } },
      instalment: { select: { label: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader title="Receipts" description="Payment receipts" />

      {receipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border rounded-md">
          <Receipt className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No receipts yet</p>
        </div>
      ) : (
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
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead>PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {receipt.receiptNumber}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/academy/students/${receipt.student.publicId}`}
                        className="hover:underline"
                      >
                        <div>
                          <p className="font-medium">{receipt.student.fullName}</p>
                          <p className="text-xs text-muted-foreground">{receipt.student.studentCode}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {receipt.instalment?.label ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(receipt.paymentDate)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {receipt.paymentMethod.replace("_", " ")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(receipt.amount.toString())}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={parseFloat(receipt.remainingBalance.toString()) > 0 ? "text-amber-600" : "text-green-600"}>
                        {formatCurrency(receipt.remainingBalance.toString())}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`/api/academy/receipts/${receipt.publicId}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
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
