import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/server/services/dashboard.service";
import { DashboardCards } from "@/components/academy/DashboardCards";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAuth } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");

  const stats = await getDashboardStats(session.organizationId);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session.name}`}
      />
      <DashboardCards stats={stats} />
    </div>
  );
}
