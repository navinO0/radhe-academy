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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { UserX, Trash2, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cancelOrDeleteStudentAction } from "../student.actions";

interface CancelStudentDialogProps {
  student: {
    id: string;
    publicId: string;
    studentCode: string;
    fullName: string;
    status: string;
    totalPayable: string;
    totalPaid: string;
    outstanding: string;
    batchName?: string | null;
  };
  trigger?: React.ReactNode;
}

export function CancelStudentDialog({
  student,
  trigger,
}: CancelStudentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasPayments = parseFloat(student.totalPaid || "0") > 0;
  const hasOutstanding = parseFloat(student.outstanding || "0") > 0;

  const [actionType, setActionType] = useState<"DELETE" | "CANCEL">(
    hasPayments ? "CANCEL" : "DELETE"
  );
  const [reason, setReason] = useState("");
  const [waiveRemainingBalance, setWaiveRemainingBalance] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    startTransition(async () => {
      const res = await cancelOrDeleteStudentAction({
        studentPublicId: student.publicId,
        action: actionType,
        reason: reason.trim(),
        waiveRemainingBalance: hasPayments ? waiveRemainingBalance : false,
      });

      if (res.success) {
        toast.success(res.message || "Student status updated successfully!");
        setOpen(false);
        if (actionType === "DELETE") {
          router.push("/academy/students");
        } else {
          router.refresh();
        }
      } else {
        toast.error(res.error || "Operation failed");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
            <UserX className="h-3.5 w-3.5 mr-1" /> Cancel Admission / Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {hasPayments ? "Cancel Student Admission" : "Delete Student Record"}
          </DialogTitle>
          <DialogDescription>
            {hasPayments
              ? `Manage withdrawal and settle balances for ${student.fullName} (${student.studentCode}).`
              : `Permanently delete ${student.fullName} (${student.studentCode}).`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Status Overview Card */}
          <div className="bg-muted/40 p-3 rounded-lg border text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Student:</span>
              <span className="font-semibold">{student.fullName} ({student.studentCode})</span>
            </div>
            {student.batchName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enrolled Batch:</span>
                <span>{student.batchName} (Will be freed)</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Fees Agreed:</span>
              <span>{formatCurrency(student.totalPayable)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Fees Paid:</span>
              <span className="font-medium text-green-600">{formatCurrency(student.totalPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Outstanding Dues:</span>
              <span className={hasOutstanding ? "font-medium text-amber-600" : ""}>
                {formatCurrency(student.outstanding)}
              </span>
            </div>
          </div>

          {/* Explanation Notice */}
          {hasPayments ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-800 dark:text-amber-200 flex gap-2.5 items-start">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Financial Records Maintained:</strong> Because payments exist, student records, receipts, and audit history will be permanently retained. The student will be marked <strong>CANCELLED</strong> and their seat released.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-xs text-destructive flex gap-2.5 items-start">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                This student has ₹0 recorded payments. Permanently deleting will remove their record from the database.
              </div>
            </div>
          )}

          {/* Waive Dues Option if Payments Exist and Outstanding > 0 */}
          {hasPayments && hasOutstanding && (
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="waive-dues"
                checked={waiveRemainingBalance}
                onCheckedChange={(c: boolean | "indeterminate") => setWaiveRemainingBalance(Boolean(c))}
              />
              <label
                htmlFor="waive-dues"
                className="text-xs font-medium cursor-pointer"
              >
                Waive remaining dues ({formatCurrency(student.outstanding)}) on cancellation
              </label>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="cancel-reason">Reason *</Label>
            <Textarea
              id="cancel-reason"
              placeholder={hasPayments ? "Reason for student withdrawal or cancellation..." : "Reason for deletion..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={isPending || !reason.trim()}
              variant="destructive"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                </>
              ) : hasPayments ? (
                <>
                  <UserX className="h-4 w-4 mr-1.5" /> Confirm Cancellation
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1.5" /> Permanently Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
