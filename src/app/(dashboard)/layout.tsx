import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getUserPermissions } from "@/lib/auth/guards";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const userOrg = await prisma.userOrganization.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (!userOrg) redirect("/login");

  const permissions = await getUserPermissions(
    session.user.id,
    userOrg.organizationId
  );

  return (
    <DashboardShell
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }}
      permissions={permissions}
      organizationName={userOrg.organization.name}
    >
      {children}
    </DashboardShell>
  );
}
