"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  Eye,
  Search,
  Users,
  Calendar,
  RotateCcw,
} from "lucide-react";

export interface AttendanceRecordItem {
  id: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
  markedAt: string;
  student: {
    id: string;
    publicId: string;
    studentCode: string;
    fullName: string;
  };
}

export interface SessionHistoryItem {
  id: string;
  publicId: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  topic: string | null;
  status: string;
  batch: {
    id: string;
    name: string;
  };
  records: AttendanceRecordItem[];
}

export interface AttendanceHistoryViewProps {
  sessions: SessionHistoryItem[];
  batches: Array<{ id: string; name: string }>;
}

export function AttendanceHistoryView({
  sessions,
  batches,
}: AttendanceHistoryViewProps) {
  const [selectedBatch, setSelectedBatch] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [datePreset, setDatePreset] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [activeSessionDetail, setActiveSessionDetail] =
    useState<SessionHistoryItem | null>(null);

  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset);
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    if (preset === "ALL") {
      setDateFrom("");
      setDateTo("");
    } else if (preset === "TODAY") {
      setDateFrom(todayStr);
      setDateTo(todayStr);
    } else if (preset === "YESTERDAY") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      setDateFrom(yStr);
      setDateTo(yStr);
    } else if (preset === "LAST_7_DAYS") {
      const past7 = new Date(now);
      past7.setDate(now.getDate() - 6);
      setDateFrom(past7.toISOString().slice(0, 10));
      setDateTo(todayStr);
    } else if (preset === "THIS_MONTH") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setDateFrom(firstDay.toISOString().slice(0, 10));
      setDateTo(todayStr);
    }
  };

  const handleResetFilters = () => {
    setSelectedBatch("ALL");
    setSelectedStatus("ALL");
    setSearchQuery("");
    setDatePreset("ALL");
    setDateFrom("");
    setDateTo("");
  };

  const isFiltered =
    selectedBatch !== "ALL" ||
    selectedStatus !== "ALL" ||
    searchQuery.trim() !== "" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    datePreset !== "ALL";

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    if (selectedBatch !== "ALL" && s.batch.id !== selectedBatch) return false;
    if (selectedStatus !== "ALL" && s.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBatch = s.batch.name.toLowerCase().includes(q);
      const matchTopic = (s.topic || "").toLowerCase().includes(q);
      if (!matchBatch && !matchTopic) return false;
    }
    const sessionDate = new Date(s.date);
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (sessionDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (sessionDate > to) return false;
    }
    return true;
  });

  // Calculate aggregates
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLeave = 0;
  let totalMarked = 0;

  sessions.forEach((s) => {
    s.records.forEach((r) => {
      totalMarked++;
      if (r.status === "PRESENT") totalPresent++;
      else if (r.status === "ABSENT") totalAbsent++;
      else if (r.status === "LEAVE") totalLeave++;
    });
  });

  const overallPct =
    totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stat Ribbon */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Total Sessions</CardDescription>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              {sessions.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Attendance Rate</CardDescription>
            <CardTitle className="text-xl font-bold text-green-600 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              {overallPct}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Present Marks</CardDescription>
            <CardTitle className="text-xl font-bold text-green-700">
              {totalPresent}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Absences / Leaves</CardDescription>
            <CardTitle className="text-xl font-bold text-amber-600">
              {totalAbsent + totalLeave}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="space-y-3 bg-card border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search batch or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            <div className="w-full sm:w-44">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Batches</SelectItem>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-36">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-40">
              <Select value={datePreset} onValueChange={handleDatePresetChange}>
                <SelectTrigger className="text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Filter Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Dates</SelectItem>
                  <SelectItem value="TODAY">Today</SelectItem>
                  <SelectItem value="YESTERDAY">Yesterday</SelectItem>
                  <SelectItem value="LAST_7_DAYS">Last 7 Days</SelectItem>
                  <SelectItem value="THIS_MONTH">This Month</SelectItem>
                  <SelectItem value="CUSTOM">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs text-muted-foreground hover:text-foreground h-9 gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Custom Date Range Row */}
        {(datePreset === "CUSTOM" || dateFrom || dateTo) && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-2 border-t text-sm">
            <span className="text-xs font-medium text-muted-foreground mr-1">
              Date Range:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setDatePreset("CUSTOM");
                }}
                className="h-8 text-xs w-full sm:w-36"
                aria-label="From Date"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setDatePreset("CUSTOM");
                }}
                className="h-8 text-xs w-full sm:w-36"
                aria-label="To Date"
              />
            </div>
          </div>
        )}
      </div>

      {/* History Table */}
      <Card>
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-base font-semibold">
            Class Sessions & Attendance History
          </CardTitle>
          <CardDescription>
            Showing {filteredSessions.length} of {sessions.length} sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarCheck className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No attendance session history found matching the filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Attendance Breakdown</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => {
                    const pres = session.records.filter((r) => r.status === "PRESENT").length;
                    const abs = session.records.filter((r) => r.status === "ABSENT").length;
                    const lve = session.records.filter((r) => r.status === "LEAVE").length;
                    const total = session.records.length;

                    return (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {formatDate(session.date)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="font-semibold">{session.batch.name}</span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {session.topic || "Regular Session"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              session.status === "COMPLETED" ? "success" : "secondary"
                            }
                          >
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {total > 0 ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                              <span className="inline-flex items-center text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                <UserCheck className="h-3 w-3 mr-1" />
                                {pres}
                              </span>
                              <span className="inline-flex items-center text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                <UserX className="h-3 w-3 mr-1" />
                                {abs}
                              </span>
                              {lve > 0 && (
                                <span className="inline-flex items-center text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {lve}
                                </span>
                              )}
                              <span className="text-muted-foreground ml-1">
                                ({total} marked)
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Not marked yet
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveSessionDetail(session)}
                            className="gap-1.5 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Attendance Details Dialog */}
      <Dialog
        open={Boolean(activeSessionDetail)}
        onOpenChange={(open) => !open && setActiveSessionDetail(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {activeSessionDetail && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between text-lg">
                  <span>{activeSessionDetail.batch.name}</span>
                  <Badge
                    variant={
                      activeSessionDetail.status === "COMPLETED"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {activeSessionDetail.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Date: {formatDate(activeSessionDetail.date)} • Topic:{" "}
                  {activeSessionDetail.topic || "Regular Session"}
                </DialogDescription>
              </DialogHeader>

              <div className="border rounded-md divide-y">
                {activeSessionDetail.records.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No attendance records submitted for this session yet.
                  </div>
                ) : (
                  activeSessionDetail.records.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-3 px-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <Link
                          href={`/academy/students/${rec.student.publicId}`}
                          className="font-medium text-sm hover:underline hover:text-primary flex items-center gap-1.5"
                        >
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {rec.student.fullName}
                        </Link>
                        <p className="text-xs text-muted-foreground font-mono">
                          {rec.student.studentCode}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            rec.status === "PRESENT"
                              ? "success"
                              : rec.status === "ABSENT"
                              ? "destructive"
                              : "warning"
                          }
                          className="text-xs"
                        >
                          {rec.status === "PRESENT" ? (
                            <UserCheck className="h-3 w-3 mr-1" />
                          ) : rec.status === "ABSENT" ? (
                            <UserX className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {rec.status}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground hidden sm:inline">
                          {formatDateTime(rec.markedAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveSessionDetail(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

