import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Standard table loading skeleton for list pages
 * (Students, Batches, Fees, Payments, Receipts, Audit Logs, Users)
 */
export function TableSkeleton({
  title = true,
  columns = 5,
  rows = 8,
  kpiCards = 0,
}: {
  title?: boolean;
  columns?: number;
  rows?: number;
  kpiCards?: number;
}) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      )}

      {/* Optional KPI Metric Cards */}
      {kpiCards > 0 && (
        <div className={`grid gap-4 grid-cols-2 md:grid-cols-${Math.min(kpiCards, 4)}`}>
          {Array.from({ length: kpiCards }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-28 mt-1" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Filter / Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border bg-card">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/40">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center gap-4 px-4 py-3.5">
              {Array.from({ length: columns }).map((_, c) => (
                <Skeleton
                  key={c}
                  className={`h-4 flex-1 ${c === 0 ? "w-1/3" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of cards skeleton (Courses list, Roles list)
 */
export function CardsGridSkeleton({
  title = true,
  count = 6,
}: {
  title?: boolean;
  count?: number;
}) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </CardHeader>
            <CardContent className="pt-2 border-t flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Detail page skeleton (Student details, Course details)
 */
export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Main Profile / Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-32 mt-1" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Tabs / Sub-table */}
      <div className="space-y-3">
        <div className="flex gap-2 border-b pb-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Dashboard root overview skeleton
 */
export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-60" />
      </div>

      {/* 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-32 mt-1" />
              <Skeleton className="h-3 w-40 mt-1" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Two-column layout for charts / recent activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

