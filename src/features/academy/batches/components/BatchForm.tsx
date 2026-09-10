"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBatchAction } from "@/features/academy/batches/batch.actions";

interface BatchFormProps {
  courses: Array<{ id: string; name: string }>;
  instructors: Array<{ id: string; name: string }>;
}

export function BatchForm({ courses, instructors }: BatchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [capacity, setCapacity] = useState("30");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timing, setTiming] = useState("10:00 AM - 12:00 PM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !courseId) {
      toast.error("Please enter batch name and select course");
      return;
    }

    startTransition(async () => {
      const res = await createBatchAction({
        name,
        courseId,
        instructorId: instructorId && instructorId !== "none" ? instructorId : undefined,
        capacity: parseInt(capacity, 10) || 30,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        schedule: { time: timing },
        status: "ACTIVE",
      });

      if (res.success) {
        toast.success("Batch created successfully!");
        router.push("/academy/batches");
      } else {
        toast.error(res.error || "Failed to create batch");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Batch Details</CardTitle>
        <CardDescription>Schedule, seat capacity, and instructor assignment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bName">Batch Name *</Label>
            <Input
              id="bName"
              placeholder="e.g. Fashion Batch 2026-A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bCourse">Course *</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger id="bCourse">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bInstructor">Instructor</Label>
              <Select value={instructorId} onValueChange={setInstructorId}>
                <SelectTrigger id="bInstructor">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bCapacity">Capacity (Maximum Seats) *</Label>
              <Input
                id="bCapacity"
                type="number"
                min="1"
                max="500"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bTiming">Class Timings</Label>
              <Input
                id="bTiming"
                placeholder="10:00 AM - 12:00 PM"
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bStart">Start Date</Label>
              <Input
                id="bStart"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bEnd">End Date</Label>
              <Input
                id="bEnd"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push("/academy/batches")}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Batch"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

