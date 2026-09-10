"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  IndianRupee,
  CreditCard,
  Receipt,
  CalendarCheck,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  UserCog,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

interface AppSidebarProps {
  user: { id: string; name: string; email: string };
  permissions: string[];
  organizationName: string;
}

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        permission: null,
      },
    ],
  },
  {
    label: "Academy",
    items: [
      {
        href: "/academy/students",
        label: "Students",
        icon: Users,
        permission: "academy.students.view",
      },
      {
        href: "/academy/courses",
        label: "Courses",
        icon: BookOpen,
        permission: "academy.courses.view",
      },
      {
        href: "/academy/batches",
        label: "Batches",
        icon: Layers,
        permission: "academy.batches.view",
      },
      {
        href: "/academy/fees",
        label: "Fees",
        icon: IndianRupee,
        permission: "academy.fees.view",
      },
      {
        href: "/academy/payments",
        label: "Payments",
        icon: CreditCard,
        permission: "academy.payments.view",
      },
      {
        href: "/academy/receipts",
        label: "Receipts",
        icon: Receipt,
        permission: "academy.receipts.view",
      },
      {
        href: "/academy/attendance",
        label: "Attendance",
        icon: CalendarCheck,
        permission: "academy.attendance.view",
      },
      {
        href: "/academy/reports",
        label: "Reports",
        icon: BarChart3,
        permission: "academy.reports.view",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        icon: UserCog,
        permission: "admin.users.manage",
      },
      {
        href: "/admin/roles",
        label: "Roles & Permissions",
        icon: Shield,
        permission: "admin.roles.manage",
      },
      {
        href: "/admin/audit-logs",
        label: "Audit Logs",
        icon: ClipboardList,
        permission: "admin.audit.view",
      },
    ],
  },
];

export function AppSidebar({ user, permissions, organizationName }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const permSet = new Set(permissions);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary">
          <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-sidebar-foreground truncate">
            {organizationName}
          </p>
          <p className="text-xs text-sidebar-foreground/60">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.permission || permSet.has(item.permission)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <p className="px-3 mb-1 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                {group.label}
              </p>
              <ul className="space-y-1">
                {visibleItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Settings + User */}
      <div className="border-t border-sidebar-border p-2 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/settings")
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>

        {/* User block */}
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">
              {user.email}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Sign out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}
