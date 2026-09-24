"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserCheck, UserX, Clock, Loader2, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { markBulkAttendanceAction } from "@/features/academy/attendance/attendance.actions";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LEAVE";

interface SessionInfo {
  id: string;
  batchName: string;
  topic: string | null;
  status: string;
  attendanceCount: number;
}

interface BatchInfo {
  id: string;
  name: string;
  courseId: string;
}

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  currentStatus: AttendanceStatus | null;
}

export function AttendanceMarker({
  sessions,
}: {
  sessions: SessionInfo[];
  batches: BatchInfo[];
  organizationId: string;
}) {
  const [selectedSession, setSelectedSession] = useState<SessionInfo | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadStudents = async (session: SessionInfo) => {
    setIsLoadingStudents(true);
    setSelectedSession(session);
    try {
      const res = await fetch(`/api/academy/attendance/session/${session.id}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as { data: { students: Student[] } };
      setStudents(data.data.students);
      const initial: Record<string, AttendanceStatus> = {};
      data.data.students.forEach((s: Student) => {
        if (s.currentStatus) initial[s.id] = s.currentStatus;
      });
      setAttendance(initial);
    } catch {
      toast.error("Failed to load student list");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const markAll = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = () => {
    if (!selectedSession) return;
    const records = students.map((s) => ({
      studentId: s.id,
      status: attendance[s.id] ?? "ABSENT",
    }));

    startTransition(async () => {
      const result = await markBulkAttendanceAction(selectedSession.id, records);
      if (result.success) {
        toast.success(`Attendance saved for ${records.length} students`);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Session list */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Today's Class Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions scheduled for today</p>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedSession?.id === session.id && "ring-2 ring-primary"
              )}
              onClick={() => loadStudents(session)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{session.batchName}</CardTitle>
                {session.topic && (
                  <CardDescription className="text-xs">{session.topic}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={session.status === "COMPLETED" ? "success" : "secondary"}
                    className="text-xs"
                  >
                    {session.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {session.attendanceCount} marked
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Attendance marking */}
      <div>
        {!selectedSession ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border rounded-md">
            <CalendarCheck className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">Select a class session from the left to mark attendance</p>
          </div>
        ) : isLoadingStudents ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
            <div className="border rounded-md divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex gap-1.5">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-semibold">{selectedSession.batchName}</h2>
                <p className="text-sm text-muted-foreground">{students.length} enrolled students</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => markAll("PRESENT")}>
                  <UserCheck className="h-4 w-4 mr-1 text-green-600" /> All Present
                </Button>
                <Button variant="outline" size="sm" onClick={() => markAll("ABSENT")}>
                  <UserX className="h-4 w-4 mr-1 text-red-600" /> All Absent
                </Button>
              </div>
            </div>

            <div className="border rounded-md divide-y">
              {students.map((student) => (
                <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{student.studentCode}</p>
                  </div>
                  <div className="flex gap-1.5 w-full sm:w-auto">
                    {(["PRESENT", "ABSENT", "LEAVE"] as const).map((status) => (
                      <Button
                        key={status}
                        variant={attendance[student.id] === status ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 flex-1 sm:flex-none px-2.5 text-xs",
                          attendance[student.id] === status && {
                            PRESENT: "bg-green-600 hover:bg-green-700 text-white",
                            ABSENT: "bg-red-600 hover:bg-red-700 text-white",
                            LEAVE: "bg-amber-600 hover:bg-amber-700 text-white",
                          }[status]
                        )}
                        onClick={() =>
                          setAttendance((prev) => ({ ...prev, [student.id]: status }))
                        }
                      >
                        {status === "PRESENT" ? (
                          <UserCheck className="h-3 w-3 mr-1" />
                        ) : status === "ABSENT" ? (
                          <UserX className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSubmit} disabled={isPending || students.length === 0} className="w-full sm:w-auto">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving Attendance...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="h-4 w-4 mr-2" /> Submit Attendance
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

