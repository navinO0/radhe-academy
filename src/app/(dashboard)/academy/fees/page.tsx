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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fees" };

export default async function FeesPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.FEES_VIEW);

  const [feeAgreements, totalAgreedAgg, totalPaidAgg] = await Promise.all([
    prisma.feeAgreement.findMany({
      where: { organizationId: session.organizationId },
      include: {
        student: { select: { fullName: true, studentCode: true, publicId: true, status: true } },
        instalments: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.feeAgreement.aggregate({
      where: { organizationId: session.organizationId },
      _sum: { totalPayable: true, registrationFee: true },
    }),
    prisma.payment.aggregate({
      where: { organizationId: session.organizationId, status: "SUCCESSFUL" },
      _sum: { amount: true },
    }),
  ]);

  const totalAgreed = totalAgreedAgg._sum.totalPayable?.toNumber() ?? 0;
  const totalPaid = totalPaidAgg._sum.amount?.toNumber() ?? 0;
  const totalOutstanding = Math.max(0, totalAgreed - totalPaid);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader title="Fee Agreements" description="Agreed fee structures and collection overview" />

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quoted Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAgreed)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalOutstanding)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">Quoted Fee</TableHead>
                <TableHead className="text-right">Registration</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Total Agreed</TableHead>
                <TableHead className="text-center">Instalments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeAgreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No fee agreements recorded yet
                  </TableCell>
                </TableRow>
              ) : (
                feeAgreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell>
                      <Link
                        href={`/academy/students/${agreement.student.publicId}`}
                        className="hover:underline"
                      >
                        <p className="font-medium">{agreement.student.fullName}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {agreement.student.studentCode}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell>{agreement.courseName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(agreement.quotedFee.toString())}</TableCell>
                    <TableCell className="text-right">{formatCurrency(agreement.registrationFee.toString())}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {agreement.discountAmount.gt(0) ? `-${formatCurrency(agreement.discountAmount.toString())}` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(agreement.totalPayable.toString())}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {agreement.instalments.length} plan{agreement.instalments.length === 1 ? "" : "s"}
                      </Badge>
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

