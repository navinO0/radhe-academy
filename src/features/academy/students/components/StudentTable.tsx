"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { StudentAvatar } from "./StudentAvatar";

type Student = {
  id: string;
  publicId: string;
  studentCode: string;
  fullName: string;
  profileImageKey?: string | null;
  gender?: string | null;
  phone: string;
  status: string;
  joiningDate: Date;
  course: { id: string; name: string } | null;
  batch: { id: string; name: string } | null;
  financials: { totalPayable: string; totalPaid: string; outstanding: string };
};

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const STATUS_VARIANTS: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  ACTIVE: "success",
  COMPLETED: "secondary",
  ON_HOLD: "warning",
  DROPPED: "destructive",
  CANCELLED: "destructive",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  DROPPED: "Dropped",
  CANCELLED: "Cancelled",
};

export function StudentTable({
  students,
  pagination,
}: {
  students: Student[];
  pagination: Pagination;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset to page 1 on filter change
      if (!updates.page) params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, code, phone..."
            defaultValue={currentSearch}
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams({ search: e.currentTarget.value });
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={currentStatus || "all"}
            onValueChange={(val) =>
              updateParams({ status: val === "all" ? undefined : val })
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ON_HOLD">On Hold</SelectItem>
              <SelectItem value="DROPPED">Dropped</SelectItem>
            </SelectContent>
          </Select>

          {(currentSearch || currentStatus) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateParams({ search: undefined, status: undefined })}
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Course</TableHead>
                <TableHead className="hidden lg:table-cell">Batch</TableHead>
                <TableHead className="hidden md:table-cell">Joining Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden xl:table-cell text-right">Outstanding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/academy/students/${student.publicId}`)}
                  >
                    <TableCell className="font-mono text-xs">
                      {student.studentCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2.5">
                        <StudentAvatar
                          profileImageKey={student.profileImageKey}
                          fullName={student.fullName}
                          subtitle={`${student.studentCode} • Profile Photo`}
                          previewable
                          className="h-8 w-8 text-[11px]"
                        />
                        <span className="truncate">{student.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {student.phone}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {student.course?.name ?? "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {student.batch?.name ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(student.joiningDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[student.status] ?? "secondary"}>
                        {STATUS_LABELS[student.status] ?? student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-right">
                      <span
                        className={parseFloat(student.financials.outstanding) > 0 ? "text-amber-600 font-medium" : "text-green-600 font-medium"}
                      >
                        {formatCurrency(student.financials.outstanding)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.pageSize + 1}–
          {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
          {pagination.total} students
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => updateParams({ page: String(pagination.page - 1) })}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-xs sm:text-sm font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => updateParams({ page: String(pagination.page + 1) })}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
