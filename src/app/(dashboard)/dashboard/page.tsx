import { redirect } from "next/navigation";
import { getDashboardStats } from "@/server/services/dashboard.service";
import { DashboardCards } from "@/components/academy/DashboardCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { requireAuth, hasPermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");

  const [stats, canViewFinancials] = await Promise.all([
    getDashboardStats(session.organizationId),
    hasPermission(session.userId, session.organizationId, PERMISSIONS.FEES_VIEW),
  ]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session.name}`}
      />
      <DashboardCards stats={stats} canViewFinancials={canViewFinancials} />
    </div>
  );
}
