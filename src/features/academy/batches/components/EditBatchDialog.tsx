"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { updateBatchAction } from "../batch.actions";
import { calculateEndDateFromDuration } from "@/lib/utils/duration";

interface EditBatchDialogProps {
  batch: {
    id: string;
    name: string;
    courseId: string;
    instructorId?: string | null;
    capacity: number;
    startDate?: string | null;
    endDate?: string | null;
    timing?: string | null;
    status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  };
  courses: Array<{ id: string; name: string; duration?: string | null }>;
  instructors: Array<{ id: string; name: string }>;
  trigger?: React.ReactNode;
}

export function EditBatchDialog({
  batch,
  courses,
  instructors,
  trigger,
}: EditBatchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(batch.name);
  const [courseId, setCourseId] = useState(batch.courseId);
  const [instructorId, setInstructorId] = useState(batch.instructorId || "none");
  const [capacity, setCapacity] = useState(batch.capacity.toString());
  const [startDate, setStartDate] = useState(batch.startDate || "");
  const [endDate, setEndDate] = useState(batch.endDate || "");
  const [timing, setTiming] = useState(batch.timing || "10:00 AM - 12:00 PM");
  const [status, setStatus] = useState<"UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED">(batch.status);

  const selectedCourse = courses.find((c) => c.id === courseId);

  const handleCourseChange = (newCourseId: string) => {
    setCourseId(newCourseId);
    const course = courses.find((c) => c.id === newCourseId);
    if (course?.duration && startDate) {
      const calculated = calculateEndDateFromDuration(startDate, course.duration);
      if (calculated) {
        setEndDate(calculated);
      }
    }
  };

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    if (selectedCourse?.duration && newStartDate) {
      const calculated = calculateEndDateFromDuration(newStartDate, selectedCourse.duration);
      if (calculated) {
        setEndDate(calculated);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !courseId) {
      toast.error("Please fill in batch name and select course");
      return;
    }

    startTransition(async () => {
      const res = await updateBatchAction(batch.id, {
        name,
        courseId,
        instructorId: instructorId && instructorId !== "none" ? instructorId : undefined,
        capacity: parseInt(capacity, 10) || 30,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        schedule: { time: timing },
        status,
      });

      if (res.success) {
        toast.success("Batch updated successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update batch");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>
              Update batch schedule, capacity, or instructor assignment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-bName">Batch Name *</Label>
              <Input
                id="edit-bName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bCourse">Course *</Label>
                <Select value={courseId} onValueChange={handleCourseChange}>
                  <SelectTrigger id="edit-bCourse">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.duration ? `(${c.duration})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bInstructor">Instructor</Label>
                <Select value={instructorId} onValueChange={setInstructorId}>
                  <SelectTrigger id="edit-bInstructor">
                    <SelectValue placeholder="Assign instructor (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None / Unassigned</SelectItem>
                    {instructors.map((ins) => (
                      <SelectItem key={ins.id} value={ins.id}>
                        {ins.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bCapacity">Capacity (Seats) *</Label>
                <Input
                  id="edit-bCapacity"
                  type="number"
                  min="1"
                  max="500"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bTiming">Class Timings</Label>
                <Input
                  id="edit-bTiming"
                  placeholder="10:00 AM - 12:00 PM"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bStartDate">Start Date</Label>
                <Input
                  id="edit-bStartDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-bEndDate">End Date</Label>
                  {selectedCourse?.duration && (
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Auto ({selectedCourse.duration})
                    </span>
                  )}
                </div>
                <Input
                  id="edit-bEndDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bStatus">Status</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as typeof status)}
              >
                <SelectTrigger id="edit-bStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
