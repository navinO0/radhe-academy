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
import { Trash2, Archive, Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { deleteCourseAction } from "../course.actions";

interface DeleteCourseDialogProps {
  course: {
    id: string;
    name: string;
    studentCount: number;
    batchCount?: number;
    status: string;
  };
  trigger?: React.ReactNode;
}

export function DeleteCourseDialog({
  course,
  trigger,
}: DeleteCourseDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasStudents = course.studentCount > 0;

  const handleDeleteOrArchive = (forceArchive = false) => {
    startTransition(async () => {
      const res = await deleteCourseAction(course.id, { forceArchive });
      if (res.success) {
        toast.success(res.message || "Course updated successfully");
        setOpen(false);
        router.push("/academy/courses");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update course");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {hasStudents ? `Archive Course: ${course.name}` : `Delete Course: ${course.name}`}
          </DialogTitle>
          <DialogDescription>
            {hasStudents
              ? `This course has ${course.studentCount} enrolled student(s). To protect student records and academic history, it cannot be deleted.`
              : `Permanently delete this course and its empty batches. This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {hasStudents ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-800 dark:text-amber-200 flex gap-2.5 items-start">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Curriculum Records Maintained:</strong> Archiving will hide <strong>{course.name}</strong> from new student registrations and batch creation while preserving all existing student fee agreements and graduation certificates.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted/40 border rounded-md text-xs text-muted-foreground">
              Course <strong>{course.name}</strong> has no students enrolled. It will be permanently removed.
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          {hasStudents ? (
            <Button
              type="button"
              onClick={() => handleDeleteOrArchive(true)}
              disabled={isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Archiving...
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-1.5" /> Archive Course
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleDeleteOrArchive(false)}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1.5" /> Delete Course
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
