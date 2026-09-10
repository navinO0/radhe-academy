import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CreateUserDialog } from "@/features/admin/users/components/CreateUserDialog";
import { UserRowActions } from "@/features/admin/users/components/UserRowActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users" };

export default async function UsersPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");
  await requirePermission(session, PERMISSIONS.USERS_MANAGE);

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      where: {
        organizations: {
          some: { organizationId: session.organizationId },
        },
      },
      include: {
        userRoles: {
          where: { organizationId: session.organizationId },
          include: { role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.role.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Users & Access Management"
        description="Create staff accounts, assign roles and manage system access permissions"
      >
        <CreateUserDialog roles={roles} />
      </PageHeader>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Assigned Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found. Click &quot;Create User&quot; to add an account.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const primaryRole = u.userRoles[0]?.role;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{u.email}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {u.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {u.userRoles.length > 0 ? (
                          u.userRoles.map((ur) => (
                            <Badge key={ur.id} variant="secondary" className="text-xs">
                              {ur.role.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No role</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.status === "ACTIVE"
                            ? "default"
                            : u.status === "INACTIVE"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserRowActions
                        user={{
                          id: u.id,
                          name: u.name,
                          email: u.email,
                          status: u.status,
                          currentRoleId: primaryRole?.id,
                        }}
                        roles={roles}
                        currentUserId={session.userId}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
