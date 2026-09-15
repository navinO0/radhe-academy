"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Download,
  IndianRupee,
  Loader2,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { EditStudentDialog } from "./EditStudentDialog";
import { StudentAvatar } from "./StudentAvatar";
import { IssueRefundDialog } from "./IssueRefundDialog";
import { CancelStudentDialog } from "./CancelStudentDialog";

interface StudentProfileViewProps {
  availableBatches?: Array<{ id: string; name: string }>;
  student: {
    id: string;
    publicId: string;
    studentCode: string;
    fullName: string;
    phone: string;
    email: string | null;
    profileImageKey?: string | null;
    status: string;
    joiningDate: Date;
    registrationDate: Date;
    dateOfBirth?: string | Date | null;
    batchId?: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    gender: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelation: string | null;
    notes: string | null;
    course: { name: string; duration: string | null };
    batch: { name: string; instructor?: { name: string } | null } | null;
    quotedFee: string;
    totalPayable: string;
    totalPaid: string;
    outstanding: string;
    attendancePct: number;
    instalments: Array<{
      id: string;
      publicId: string;
      label: string;
      amount: string;
      paidAmount: string;
      dueDate: string;
      status: string;
    }>;
    payments: Array<{
      id: string;
      publicId: string;
      amount: string;
      paymentDate: string;
      paymentMethod: string;
      transactionReference: string | null;
      status: string;
      receiptNumber?: string;
      receiptPublicId?: string;
      instalmentLabel?: string;
      adjustments?: Array<{
        id: string;
        type: string;
        amount: string;
        reason: string;
        createdAt: string;
      }>;
    }>;
    attendance: Array<{
      id: string;
      status: string;
      markedAt: string;
      topic: string | null;
      date: string;
    }>;
  };
  canViewFees?: boolean;
}

export function StudentProfileView({
  student,
  availableBatches = [],
  canViewFees = false,
}: StudentProfileViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedInstalmentId, setSelectedInstalmentId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [transactionReference, setTransactionReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Success dialog after payment
  const [successReceipt, setSuccessReceipt] = useState<{
    receiptNumber: string;
    receiptPublicId: string;
    remainingBalance: string;
  } | null>(null);

  const pendingInstalments = student.instalments.filter(
    (i) => i.status === "PENDING" || i.status === "PARTIALLY_PAID"
  );

  const handleOpenPayment = (instalmentId?: string) => {
    const targetInstalment = instalmentId
      ? student.instalments.find((i) => i.id === instalmentId)
      : pendingInstalments[0];

    if (targetInstalment) {
      setSelectedInstalmentId(targetInstalment.id);
      const remainingForInstalment = Math.max(
        0,
        parseFloat(targetInstalment.amount) - parseFloat(targetInstalment.paidAmount)
      );
      setPaymentAmount(remainingForInstalment.toString());
    } else {
      setSelectedInstalmentId("");
      setPaymentAmount(student.outstanding);
    }
    setIsPaymentOpen(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstalmentId || !paymentAmount) {
      toast.error("Please specify instalment and amount");
      return;
    }

    const numAmount = parseFloat(paymentAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Amount must be a positive number");
      return;
    }

    if (numAmount > parseFloat(student.outstanding)) {
      toast.error(`Amount cannot exceed outstanding balance (₹${student.outstanding})`);
      return;
    }

    setIsSubmittingPayment(true);

    try {
      // Client generates unique idempotency key
      const idempotencyKey = crypto.randomUUID();

      const response = await fetch("/api/academy/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          instalmentId: selectedInstalmentId,
          amount: numAmount.toFixed(2),
          paymentMethod,
          transactionReference: transactionReference || undefined,
          idempotencyKey,
          notes: paymentNotes || undefined,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData?.error?.message || "Failed to record payment");
      }

      setIsPaymentOpen(false);
      setSuccessReceipt({
        receiptNumber: resData.data.receiptNumber,
        receiptPublicId: resData.data.receiptPublicId,
        remainingBalance: resData.data.remainingBalance,
      });

      toast.success("Payment recorded successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Payment transaction failed");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const newBalancePreview = (
    parseFloat(student.outstanding) - (parseFloat(paymentAmount) || 0)
  ).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Overview Stat Ribbon */}
      <div className={`grid gap-4 ${canViewFees ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2"}`}>
        <Card>
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Status</CardDescription>
            <CardTitle className="text-base">
              <Badge variant={student.status === "ACTIVE" ? "success" : "secondary"}>
                {student.status}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {canViewFees && (
          <>
            <Card>
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs">Total Agreed Fee</CardDescription>
                <CardTitle className="text-lg font-bold">{formatCurrency(student.totalPayable)}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs">Outstanding Dues</CardDescription>
                <CardTitle className="text-lg font-bold">
                  <span className={parseFloat(student.outstanding) > 0 ? "text-amber-600" : "text-green-600"}>
                    {formatCurrency(student.outstanding)}
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Attendance</CardDescription>
            <CardTitle className="text-lg font-bold">{student.attendancePct}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="overflow-x-auto pb-1 max-w-full">
            <TabsList className="inline-flex w-max sm:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {canViewFees && <TabsTrigger value="fees">Fees & Payments</TabsTrigger>}
              {canViewFees && <TabsTrigger value="instalments">Instalments</TabsTrigger>}
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <EditStudentDialog
              student={{
                id: student.id,
                publicId: student.publicId,
                studentCode: student.studentCode,
                fullName: student.fullName,
                profileImageKey: student.profileImageKey,
                phone: student.phone,
                email: student.email,
                gender: student.gender,
                dateOfBirth: student.dateOfBirth
                  ? new Date(student.dateOfBirth).toISOString().split("T")[0]
                  : "",
                address: student.address,
                city: student.city,
                state: student.state,
                postalCode: student.postalCode,
                emergencyContactName: student.emergencyContactName,
                emergencyContactPhone: student.emergencyContactPhone,
                emergencyContactRelation: student.emergencyContactRelation,
                batchId: student.batchId,
                status: student.status,
                notes: student.notes,
              }}
              batches={availableBatches}
            />

            {canViewFees && parseFloat(student.outstanding) > 0 && (
              <Button onClick={() => handleOpenPayment()} className="w-full sm:w-auto shrink-0">
                <IndianRupee className="h-4 w-4 mr-1" />
                Record Payment
              </Button>
            )}

            <CancelStudentDialog
              student={{
                id: student.id,
                publicId: student.publicId,
                studentCode: student.studentCode,
                fullName: student.fullName,
                status: student.status,
                totalPayable: student.totalPayable,
                totalPaid: student.totalPaid,
                outstanding: student.outstanding,
                batchName: student.batch?.name,
              }}
            />
          </div>
        </div>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Personal Information</CardTitle>
                <EditStudentDialog
                  student={{
                    id: student.id,
                    publicId: student.publicId,
                    studentCode: student.studentCode,
                    fullName: student.fullName,
                    profileImageKey: student.profileImageKey,
                    phone: student.phone,
                    email: student.email,
                    gender: student.gender,
                    dateOfBirth: student.dateOfBirth
                      ? new Date(student.dateOfBirth).toISOString().split("T")[0]
                      : "",
                    address: student.address,
                    city: student.city,
                    state: student.state,
                    postalCode: student.postalCode,
                    emergencyContactName: student.emergencyContactName,
                    emergencyContactPhone: student.emergencyContactPhone,
                    emergencyContactRelation: student.emergencyContactRelation,
                    batchId: student.batchId,
                    status: student.status,
                    notes: student.notes,
                  }}
                  batches={availableBatches}
                  trigger={
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  }
                />
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-4 pb-3 border-b">
                  <StudentAvatar
                    profileImageKey={student.profileImageKey}
                    fullName={student.fullName}
                    subtitle={`${student.studentCode} • Profile Photo`}
                    previewable
                    className="h-16 w-16 text-lg border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="text-base font-semibold">{student.fullName}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{student.studentCode}</p>
                    <Badge variant={student.status === "ACTIVE" ? "success" : "secondary"} className="mt-1">
                      {student.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{student.phone}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Email</span>
                  <span>{student.email || "—"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Gender</span>
                  <span>{student.gender || "—"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Date of Birth</span>
                  <span>{student.dateOfBirth ? formatDate(new Date(student.dateOfBirth)) : "—"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">City / State</span>
                  <span>{[student.city, student.state].filter(Boolean).join(", ") || "—"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Address</span>
                  <span>{student.address || "—"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Academy & Emergency Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Course</span>
                  <span className="font-medium">{student.course.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Batch</span>
                  <span>{student.batch?.name || "Unassigned"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Instructor</span>
                  <span>{student.batch?.instructor?.name || "—"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Joining Date</span>
                  <span>{formatDate(student.joiningDate)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Emergency Contact</span>
                  <span>{student.emergencyContactName ? `${student.emergencyContactName} (${student.emergencyContactRelation})` : "—"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Emergency Phone</span>
                  <span>{student.emergencyContactPhone || "—"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Fees & Payments */}
        {canViewFees && (
          <TabsContent value="fees" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Payment History</CardTitle>
                  <CardDescription>Immutable record of all successful financial transactions</CardDescription>
                </div>
                {parseFloat(student.outstanding) > 0 && (
                  <Button size="sm" onClick={() => handleOpenPayment()}>
                    <IndianRupee className="h-4 w-4 mr-1" />
                    Receive Payment
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {student.payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No payments recorded yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Receipt #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Instalment</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Refunded</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.payments.map((payment) => {
                          const refundedAmount = (payment.adjustments ?? [])
                            .filter((a) => a.type === "REFUND" || a.type === "CANCELLATION")
                            .reduce((acc, a) => acc + parseFloat(a.amount), 0);
                          const maxRefundable = Math.max(0, parseFloat(payment.amount) - refundedAmount);

                          return (
                            <TableRow key={payment.id}>
                              <TableCell className="font-mono text-xs font-semibold">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span>{payment.receiptNumber || "—"}</span>
                                  {payment.status === "REFUNDED" ? (
                                    <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
                                      REFUNDED
                                    </Badge>
                                  ) : refundedAmount > 0 ? (
                                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 text-amber-600 bg-amber-50">
                                      PARTIAL REFUND
                                    </Badge>
                                  ) : null}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs">{formatDate(payment.paymentDate)}</TableCell>
                              <TableCell>{payment.instalmentLabel || "General"}</TableCell>
                              <TableCell>{payment.paymentMethod.replace("_", " ")}</TableCell>
                              <TableCell className="text-xs text-muted-foreground font-mono">
                                {payment.transactionReference || "—"}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(payment.amount)}
                              </TableCell>
                              <TableCell className="text-right font-medium text-amber-600">
                                {refundedAmount > 0 ? formatCurrency(refundedAmount.toFixed(2)) : "—"}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {payment.receiptPublicId && (
                                    <a
                                      href={`/api/academy/receipts/${payment.receiptPublicId}/pdf`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Download Receipt PDF"
                                    >
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </a>
                                  )}
                                  {canViewFees && maxRefundable > 0 && payment.status !== "CANCELLED" && (
                                    <IssueRefundDialog
                                      payment={{
                                        id: payment.id,
                                        receiptNumber: payment.receiptNumber,
                                        amount: payment.amount,
                                        paymentDate: payment.paymentDate,
                                        paymentMethod: payment.paymentMethod,
                                        refundedAmount: refundedAmount.toFixed(2),
                                        maxRefundable: maxRefundable.toFixed(2),
                                      }}
                                      studentName={student.fullName}
                                      studentPublicId={student.publicId}
                                    />
                                  )}
                                </div>
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
          </TabsContent>
        )}

        {/* Tab 3: Instalments */}
        {canViewFees && (
          <TabsContent value="instalments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agreed Instalment Schedule</CardTitle>
                <CardDescription>Track payments against scheduled dues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Label</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.instalments.map((inst) => {
                        const isDue = new Date(inst.dueDate) < new Date() && inst.status !== "PAID";
                        return (
                          <TableRow key={inst.id}>
                            <TableCell className="font-medium">{inst.label}</TableCell>
                            <TableCell className={isDue ? "text-red-600 font-medium" : ""}>
                              {formatDate(inst.dueDate)}
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(inst.amount)}</TableCell>
                            <TableCell className="text-right font-medium text-green-700">
                              {formatCurrency(inst.paidAmount)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  inst.status === "PAID"
                                    ? "success"
                                    : isDue
                                    ? "destructive"
                                    : inst.status === "PARTIALLY_PAID"
                                    ? "warning"
                                    : "secondary"
                                }
                              >
                                {inst.status === "PAID" ? "Paid" : isDue ? "Overdue" : inst.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {inst.status !== "PAID" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenPayment(inst.id)}
                                >
                                  Pay
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab 4: Attendance */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Records</CardTitle>
              <CardDescription>Overall Attendance: {student.attendancePct}%</CardDescription>
            </CardHeader>
            <CardContent>
              {student.attendance.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No attendance records yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Date</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Marked At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.attendance.map((rec) => (
                        <TableRow key={rec.id}>
                          <TableCell>{formatDate(rec.date)}</TableCell>
                          <TableCell>{rec.topic || "Regular Session"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                rec.status === "PRESENT"
                                  ? "success"
                                  : rec.status === "ABSENT"
                                  ? "destructive"
                                  : "warning"
                              }
                            >
                              {rec.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDateTime(rec.markedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Notes */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Student Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {student.notes || "No notes recorded for this student."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Record Payment Dialog */}
      {canViewFees && (
        <>
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>
                  Record a fee payment for {student.fullName} ({student.studentCode})
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleRecordPayment} className="space-y-4 py-2">
                {/* Payment Summary Safety Card */}
                <div className="rounded-lg bg-muted p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Total Outstanding:</span>
                    <span className="font-semibold text-amber-600">{formatCurrency(student.outstanding)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Amount:</span>
                    <span className="font-semibold">{formatCurrency(paymentAmount || "0")}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 font-bold">
                    <span>New Remaining Balance:</span>
                    <span className={parseFloat(newBalancePreview) > 0 ? "text-amber-600" : "text-green-600"}>
                      {formatCurrency(newBalancePreview)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instalmentSelect">Apply to Instalment *</Label>
                  <Select value={selectedInstalmentId} onValueChange={setSelectedInstalmentId}>
                    <SelectTrigger id="instalmentSelect">
                      <SelectValue placeholder="Select instalment" />
                    </SelectTrigger>
                    <SelectContent>
                      {student.instalments.map((inst) => {
                        const remaining = Math.max(0, parseFloat(inst.amount) - parseFloat(inst.paidAmount));
                        return (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.label} (Remaining: ₹{remaining.toFixed(2)})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payAmount">Amount (₹) *</Label>
                  <Input
                    id="payAmount"
                    type="number"
                    step="0.01"
                    placeholder="10000"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI (GPay / PhonePe / Paytm)</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</SelectItem>
                      <SelectItem value="CARD">Debit / Credit Card</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="txRef">Transaction Reference / UTR Number</Label>
                  <Input
                    id="txRef"
                    placeholder="e.g. 123456789012"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPaymentOpen(false)}
                    disabled={isSubmittingPayment}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmittingPayment}>
                    {isSubmittingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm & Issue Receipt"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Payment Success Confirmation Dialog */}
          <Dialog open={!!successReceipt} onOpenChange={() => setSuccessReceipt(null)}>
            <DialogContent className="max-w-sm text-center">
              <div className="flex flex-col items-center py-4 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
                <DialogTitle className="text-xl">Payment Successful!</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Receipt <strong className="text-foreground">#{successReceipt?.receiptNumber}</strong> has been generated.
                </p>
                <div className="bg-muted w-full p-3 rounded-md text-sm">
                  Remaining Balance:{" "}
                  <strong>{formatCurrency(successReceipt?.remainingBalance || "0")}</strong>
                </div>
                <div className="flex gap-2 w-full pt-2">
                  <a
                    href={`/api/academy/receipts/${successReceipt?.receiptPublicId}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                  </a>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

