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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RotateCcw, Loader2, IndianRupee, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { issueRefundAction } from "../student.actions";

interface IssueRefundDialogProps {
  payment: {
    id: string;
    receiptNumber?: string;
    amount: string;
    paymentDate: string;
    paymentMethod: string;
    refundedAmount?: string;
    maxRefundable: string;
  };
  studentName: string;
  studentPublicId: string;
  trigger?: React.ReactNode;
}

export function IssueRefundDialog({
  payment,
  studentName,
  studentPublicId,
  trigger,
}: IssueRefundDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const maxRefund = parseFloat(payment.maxRefundable || "0");
  const [amount, setAmount] = useState(maxRefund.toFixed(2));
  const [refundMethod, setRefundMethod] = useState<string>("UPI");
  const [transactionReference, setTransactionReference] = useState("");
  const [reason, setReason] = useState("");

  const numAmount = parseFloat(amount || "0");
  const isValidAmount = numAmount > 0 && numAmount <= maxRefund;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAmount) {
      toast.error(`Please enter an amount between ₹1 and ₹${maxRefund.toFixed(2)}`);
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund");
      return;
    }

    startTransition(async () => {
      const res = await issueRefundAction({
        paymentId: payment.id,
        amount: numAmount.toFixed(2),
        refundMethod: refundMethod as any,
        transactionReference: transactionReference || undefined,
        reason: reason.trim(),
      });

      if (res.success) {
        toast.success(res.message || "Refund processed successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to process refund");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50">
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Refund
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-700">
            <RotateCcw className="h-5 w-5" /> Issue Payment Refund
          </DialogTitle>
          <DialogDescription>
            Refund payment for <strong>{studentName}</strong>. This adjusts the student&apos;s paid balance and maintains an immutable audit record.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Payment Context Card */}
          <div className="bg-muted/40 p-3 rounded-lg border text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original Receipt:</span>
              <span className="font-mono font-medium">{payment.receiptNumber || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date:</span>
              <span>{formatDate(payment.paymentDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original Amount:</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
            {parseFloat(payment.refundedAmount || "0") > 0 && (
              <div className="flex justify-between text-amber-600">
                <span>Already Refunded:</span>
                <span>{formatCurrency(payment.refundedAmount || "0")}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1.5 font-semibold text-foreground">
              <span>Max Refundable:</span>
              <span className="text-green-600">{formatCurrency(maxRefund.toFixed(2))}</span>
            </div>
          </div>

          {/* Refund Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="refund-amount">Refund Amount (₹) *</Label>
              <button
                type="button"
                onClick={() => setAmount(maxRefund.toFixed(2))}
                className="text-[11px] text-primary hover:underline"
              >
                Max ({formatCurrency(maxRefund.toFixed(2))})
              </button>
            </div>
            <Input
              id="refund-amount"
              type="number"
              step="0.01"
              min="0.01"
              max={maxRefund}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Refund Method */}
          <div className="space-y-1.5">
            <Label htmlFor="refund-method">Refund Payout Method *</Label>
            <Select value={refundMethod} onValueChange={setRefundMethod}>
              <SelectTrigger id="refund-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer / NEFT</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Reference */}
          <div className="space-y-1.5">
            <Label htmlFor="refund-ref">Transaction Reference / UTR (Optional)</Label>
            <Input
              id="refund-ref"
              placeholder="e.g. UTR12345678 or Cheque #"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
            />
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="refund-reason">Reason for Refund *</Label>
            <Textarea
              id="refund-reason"
              placeholder="e.g. Course withdrawal, batch cancellation, or fee adjustment"
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isValidAmount || !reason.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Confirm Refund
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

