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
import { Trash2, Loader2, AlertTriangle, Users } from "lucide-react";
import { toast } from "sonner";
import { deleteBatchAction } from "../batch.actions";

interface DeleteBatchDialogProps {
  batch: {
    id: string;
    name: string;
    studentCount: number;
  };
  trigger?: React.ReactNode;
}

export function DeleteBatchDialog({
  batch,
  trigger,
}: DeleteBatchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasStudents = batch.studentCount > 0;

  const handleDelete = (forceUnassign = false) => {
    startTransition(async () => {
      const res = await deleteBatchAction(batch.id, { forceUnassign });
      if (res.success) {
        toast.success(res.message || "Batch deleted successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete batch");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> Delete Batch: {batch.name}
          </DialogTitle>
          <DialogDescription>
            Permanently delete this batch schedule. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {hasStudents ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-800 dark:text-amber-200 flex gap-2.5 items-start">
              <Users className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Active Students Enrolled:</strong> Batch <strong>{batch.name}</strong> currently has <strong>{batch.studentCount}</strong> enrolled student(s). Deleting will unassign these students from this batch (their overall enrollment and fees will remain intact).
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted/40 border rounded-md text-xs text-muted-foreground">
              Batch <strong>{batch.name}</strong> has no students enrolled. It will be permanently removed.
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
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleDelete(hasStudents)}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-1.5" /> {hasStudents ? "Unassign & Delete" : "Delete Batch"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

