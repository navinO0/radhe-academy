import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const metadata = { title: "Roles & Permissions" };

export default async function RolesPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.ROLES_MANAGE);

  const roles = await prisma.role.findMany({
    include: {
      rolePermissions: {
        include: { permission: true },
      },
      _count: {
        select: { userRoles: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader title="Roles & Permissions" description="System RBAC configuration" />

      <div className="grid gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{role.name}</CardTitle>
                <Badge variant="outline">{role._count.userRoles} user(s)</Badge>
              </div>
              <CardDescription>{role.description || "System configured role"}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Permissions ({role.rolePermissions.length})
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {role.rolePermissions.map((rp) => (
                  <Badge key={rp.permission.id} variant="secondary" className="text-xs font-mono">
                    {rp.permission.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

