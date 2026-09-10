import { requireAuth } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await requireAuth().catch(() => null);
  if (!session) redirect("/login");

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <PageHeader title="Settings" description="System preferences and user configuration" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Profile</CardTitle>
          <CardDescription>Your logged-in session details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm border-b pb-2">
            <span className="text-muted-foreground">Full Name</span>
            <span className="font-medium">{session.name}</span>
          </div>
          <div className="flex justify-between text-sm border-b pb-2">
            <span className="text-muted-foreground">Email Address</span>
            <span className="font-mono">{session.email}</span>
          </div>
          <div className="flex justify-between text-sm border-b pb-2">
            <span className="text-muted-foreground">Organization ID</span>
            <span className="font-mono text-xs">{session.organizationId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Timezone</span>
            <span className="font-medium">Asia/Kolkata (IST)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

