"use client";

import { useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

interface DashboardShellProps {
  children: React.ReactNode;
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

export function DashboardShell({
  children,
  user,
  permissions,
  organizationName,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const permSet = new Set(permissions);

  // Close mobile sidebar automatically when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const sidebarNav = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-sidebar-foreground truncate tracking-tight">
              {organizationName}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Academy System</p>
          </div>
        </div>

        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.permission || permSet.has(item.permission)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[11px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                {group.label}
              </p>
              <ul className="space-y-1">
                {visibleItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        isActive(item.href)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Bottom User & Settings Card */}
      <div className="border-t border-sidebar-border p-3 space-y-2 bg-sidebar-accent/20">
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

        <div className="flex items-center gap-3 rounded-md px-2 py-1.5 border border-sidebar-border/50 bg-sidebar/50">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-sidebar-foreground/60 truncate">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 shrink-0"
            onClick={handleSignOut}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* 1. Desktop Persistent Sticky Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-sidebar-border bg-sidebar">
        {sidebarNav}
      </aside>

      {/* 2. Mobile Responsive Topbar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-background/95 backdrop-blur-md border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 font-bold text-sm">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="truncate max-w-[180px]">{organizationName}</span>
          </div>
        </div>

        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </header>

      {/* 3. Mobile Slide-Over Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          {/* Slide Drawer */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {sidebarNav}
          </aside>
        </div>
      )}

      {/* 4. Main Scrollable Content Area */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen bg-background">
        <div className="flex-1 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}

