import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/server/services/dashboard.service";

interface DashboardCardsProps {
  stats: DashboardStats;
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  return (
    <div className="space-y-6">
      {/* Students Row */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Students</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <StatCard
            title="Total"
            value={stats.students.total}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Active"
            value={stats.students.active}
            icon={<UserCheck className="h-4 w-4" />}
            variant="success"
          />
          <StatCard
            title="New This Month"
            value={stats.students.newThisMonth}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Completed"
            value={stats.students.completed}
            icon={<CalendarCheck className="h-4 w-4" />}
          />
          <StatCard
            title="On Hold"
            value={stats.students.onHold}
            icon={<Clock className="h-4 w-4" />}
            variant="warning"
          />
          <StatCard
            title="Dropped"
            value={stats.students.dropped}
            icon={<UserX className="h-4 w-4" />}
            variant="destructive"
          />
        </div>
      </div>

      {/* Financial Row */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Financial</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <StatCard
            title="Total Fees"
            value={formatCurrency(stats.financial.totalQuotedFees)}
            icon={<IndianRupee className="h-4 w-4" />}
          />
          <StatCard
            title="Collected"
            value={formatCurrency(stats.financial.totalCollected)}
            icon={<IndianRupee className="h-4 w-4" />}
            variant="success"
          />
          <StatCard
            title="Outstanding"
            value={formatCurrency(stats.financial.outstandingBalance)}
            icon={<AlertTriangle className="h-4 w-4" />}
            variant="warning"
          />
          <StatCard
            title="Today"
            value={formatCurrency(stats.financial.collectedToday)}
            icon={<IndianRupee className="h-4 w-4" />}
          />
          <StatCard
            title="This Month"
            value={formatCurrency(stats.financial.collectedThisMonth)}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Reg. Fees"
            value={formatCurrency(stats.financial.totalRegistrationFees)}
            icon={<IndianRupee className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Attendance Row */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Today's Attendance</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatCard
            title="Sessions Today"
            value={stats.attendance.todaysSessions}
            icon={<CalendarCheck className="h-4 w-4" />}
          />
          <StatCard
            title="Present"
            value={stats.attendance.totalPresent}
            icon={<UserCheck className="h-4 w-4" />}
            variant="success"
          />
          <StatCard
            title="Absent"
            value={stats.attendance.totalAbsent}
            icon={<UserX className="h-4 w-4" />}
            variant="destructive"
          />
          <StatCard
            title="On Leave"
            value={stats.attendance.totalLeave}
            icon={<Clock className="h-4 w-4" />}
            variant="warning"
          />
        </div>
      </div>

      {/* Upcoming Row */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Instalments</h2>
        <div className="grid gap-4 grid-cols-2">
          <StatCard
            title="Overdue Instalments"
            value={stats.upcoming.overdueInstalments}
            icon={<AlertTriangle className="h-4 w-4" />}
            variant="destructive"
          />
          <StatCard
            title="Due This Week"
            value={stats.upcoming.upcomingInstalments}
            icon={<Clock className="h-4 w-4" />}
            variant="warning"
          />
        </div>
      </div>
    </div>
  );
}

type StatVariant = "default" | "success" | "warning" | "destructive";

function StatCard({
  title,
  value,
  icon,
  variant = "default",
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  variant?: StatVariant;
}) {
  const iconColors: Record<StatVariant, string> = {
    default: "text-muted-foreground",
    success: "text-green-600",
    warning: "text-amber-600",
    destructive: "text-destructive",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className={iconColors[variant]}>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold truncate">{value}</div>
      </CardContent>
    </Card>
  );
}
