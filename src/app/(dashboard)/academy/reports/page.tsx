import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.REPORTS_VIEW);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [studentsByStatus, monthlyCollection, paymentMethods, overdue] = await Promise.all([
    prisma.student.groupBy({
      by: ["status"],
      where: { organizationId: session.organizationId },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: {
        organizationId: session.organizationId,
        status: "SUCCESSFUL",
        paymentDate: { gte: monthStart },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.groupBy({
      by: ["paymentMethod"],
      where: { organizationId: session.organizationId, status: "SUCCESSFUL" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.instalment.count({
      where: {
        organizationId: session.organizationId,
        status: { in: ["PENDING", "PARTIALLY_PAID"] },
        dueDate: { lt: now },
      },
    }),
  ]);

  const statusMap = Object.fromEntries(studentsByStatus.map((s) => [s.status, s._count]));

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader title="Reports" description="Academy analytics and summaries" />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Student Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(statusMap).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{status.replace("_", " ")}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t pt-2">
              <span>Total</span>
              <span>{Object.values(statusMap).reduce((a, b) => a + b, 0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* This Month Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">This Month's Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency(monthlyCollection._sum.amount?.toString() ?? "0")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {monthlyCollection._count} payments
            </p>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {paymentMethods.map((pm) => (
              <div key={pm.paymentMethod} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{pm.paymentMethod.replace("_", " ")}</span>
                <div className="text-right">
                  <span className="font-medium block">
                    {formatCurrency(pm._sum.amount?.toString() ?? "0")}
                  </span>
                  <span className="text-xs text-muted-foreground">{pm._count} txns</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overdue Instalments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{overdue}</p>
            <p className="text-sm text-muted-foreground mt-1">
              instalments past due date
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
