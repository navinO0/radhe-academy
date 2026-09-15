import { prisma } from "@/lib/db/prisma";
import { Decimal, addMoney, subtractMoney, roundMoney } from "@/lib/money/decimal";
import {
  NotFoundError,
  ConflictError,
  AppError,
} from "@/lib/errors";
import { createId } from "@paralleldrive/cuid2";

export interface StudentFinancials {
  totalPayable: Decimal;
  totalPaid: Decimal;
  totalAdjustments: Decimal;
  outstandingBalance: Decimal;
  isOverpaid: boolean;
}

/**
 * Recalculate student financials inside a transaction (with row locking).
 * NEVER call this with stale data — always recalculate from DB.
 */
export async function recalculateStudentBalance(
  studentId: string,
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
): Promise<StudentFinancials> {
  // Lock the student row to prevent concurrent payment races
  await tx.$queryRaw`SELECT id FROM students WHERE id = ${studentId} FOR UPDATE`;

  const feeAgreement = await tx.feeAgreement.findUnique({
    where: { studentId },
    select: { totalPayable: true },
  });

  if (!feeAgreement) {
    throw new NotFoundError("Fee agreement");
  }

  const totalPayable = new Decimal(feeAgreement.totalPayable.toString());

  // Sum all successful payments
  const paymentsAgg = await tx.payment.aggregate({
    where: { studentId, status: "SUCCESSFUL" },
    _sum: { amount: true },
  });
  const totalPaid = new Decimal(paymentsAgg._sum.amount?.toString() ?? "0");

  // Sum all adjustments (refunds, cancellations reduce balance)
  const adjustmentsAgg = await tx.paymentAdjustment.aggregate({
    where: {
      payment: { studentId },
      type: { in: ["REFUND", "CANCELLATION", "REVERSAL"] },
    },
    _sum: { amount: true },
  });
  const totalAdjustments = new Decimal(
    adjustmentsAgg._sum.amount?.toString() ?? "0"
  );

  const effectivePaid = subtractMoney(totalPaid, totalAdjustments);
  const outstandingBalance = subtractMoney(totalPayable, effectivePaid);

  return {
    totalPayable,
    totalPaid,
    totalAdjustments,
    outstandingBalance: roundMoney(outstandingBalance),
    isOverpaid: outstandingBalance.lt(0),
  };
}

export interface CreatePaymentInput {
  organizationId: string;
  studentId: string;
  instalmentId: string;
  amount: string;
  paymentDate?: Date;
  paymentMethod: "CASH" | "UPI" | "BANK_TRANSFER" | "CARD" | "OTHER";
  transactionReference?: string;
  idempotencyKey: string;
  notes?: string;
  createdById: string;
}

/**
 * Create a payment with full security pipeline.
 * Runs inside a database transaction with row-level locking.
 */
export async function createPayment(input: CreatePaymentInput) {
  const {
    organizationId,
    studentId,
    instalmentId,
    paymentDate,
    paymentMethod,
    transactionReference,
    idempotencyKey,
    notes,
    createdById,
  } = input;

  const paymentAmount = new Decimal(input.amount);

  return await prisma.$transaction(async (tx) => {
    // 1. Check idempotency key first (before locking)
    const existingKey = await tx.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
    });
    if (existingKey) {
      // Return original result if not expired
      if (new Date() < existingKey.expiresAt) {
        return existingKey.result as ReturnType<typeof buildPaymentResult>;
      }
      // Key expired — treat as new request, delete old key
      await tx.idempotencyKey.delete({ where: { key: idempotencyKey } });
    }

    // 2. Verify student belongs to organization (IDOR protection)
    const student = await tx.student.findFirst({
      where: { id: studentId, organizationId },
      select: { id: true, fullName: true, studentCode: true },
    });
    if (!student) throw new NotFoundError("Student");

    // 3. Verify instalment belongs to student
    const instalment = await tx.instalment.findFirst({
      where: { id: instalmentId, studentId, organizationId },
      select: { id: true, amount: true, paidAmount: true, status: true, label: true },
    });
    if (!instalment) throw new NotFoundError("Instalment");
    if (instalment.status === "CANCELLED" || instalment.status === "WAIVED") {
      throw new AppError("Cannot pay a cancelled or waived instalment", 409);
    }

    // 4. Recalculate balance with row lock (concurrency protection)
    const financials = await recalculateStudentBalance(studentId, tx);

    // 5. Server-side amount validation
    if (paymentAmount.lte(0)) {
      throw new AppError("Payment amount must be positive", 422);
    }
    if (paymentAmount.gt(financials.outstandingBalance)) {
      throw new AppError(
        `Payment amount ₹${paymentAmount.toFixed(2)} exceeds outstanding balance ₹${financials.outstandingBalance.toFixed(2)}`,
        422
      );
    }

    // 6. Generate receipt number (server-side, sequential per org)
    const receiptCount = await tx.receipt.count({ where: { organizationId } });
    const receiptNumber = `RLA-${String(receiptCount + 1).padStart(6, "0")}`;

    const previousBalance = financials.outstandingBalance;
    const remainingBalance = subtractMoney(previousBalance, paymentAmount);

    // 7. Create payment
    const payment = await tx.payment.create({
      data: {
        publicId: createId(),
        organizationId,
        studentId,
        instalmentId,
        amount: paymentAmount.toDecimalPlaces(2),
        paymentDate: paymentDate ?? new Date(),
        paymentMethod,
        transactionReference: transactionReference ?? null,
        idempotencyKey,
        status: "SUCCESSFUL",
        notes: notes ?? null,
        createdById,
      },
    });

    // 8. Update instalment paid amount & status
    const newPaidAmount = addMoney(
      new Decimal(instalment.paidAmount.toString()),
      paymentAmount
    );
    const instalmentTotal = new Decimal(instalment.amount.toString());
    let newStatus: "PENDING" | "PARTIALLY_PAID" | "PAID" =
      newPaidAmount.gte(instalmentTotal) ? "PAID" : "PARTIALLY_PAID";

    await tx.instalment.update({
      where: { id: instalmentId },
      data: {
        paidAmount: newPaidAmount.toDecimalPlaces(2),
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    // 9. Create receipt
    const receipt = await tx.receipt.create({
      data: {
        publicId: createId(),
        organizationId,
        receiptNumber,
        studentId,
        paymentId: payment.id,
        instalmentId,
        amount: paymentAmount.toDecimalPlaces(2),
        paymentDate: paymentDate ?? new Date(),
        paymentMethod,
        transactionReference: transactionReference ?? null,
        previousBalance: previousBalance.toDecimalPlaces(2),
        remainingBalance: remainingBalance.toDecimalPlaces(2),
        generatedById: createdById,
      },
    });

    // 10. Store idempotency key
    const result = buildPaymentResult(payment, receipt, remainingBalance);
    await tx.idempotencyKey.create({
      data: {
        key: idempotencyKey,
        organizationId,
        result: result as any,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return result;
  });
}

function buildPaymentResult(
  payment: { id: string; publicId: string; amount: unknown },
  receipt: { id: string; publicId: string; receiptNumber: string },
  remainingBalance: Decimal
) {
  return {
    paymentId: payment.id,
    paymentPublicId: payment.publicId,
    receiptId: receipt.id,
    receiptPublicId: receipt.publicId,
    receiptNumber: receipt.receiptNumber,
    remainingBalance: remainingBalance.toFixed(2),
  };
}

/**
 * Cancel a payment and create an adjustment record.
 */
export async function cancelPayment(input: {
  paymentId: string;
  organizationId: string;
  reason: string;
  cancelledById: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: { id: input.paymentId, organizationId: input.organizationId },
      include: { instalment: true },
    });

    if (!payment) throw new NotFoundError("Payment");
    if (payment.status !== "SUCCESSFUL") {
      throw new ConflictError("Only successful payments can be cancelled");
    }

    // Update payment status
    await tx.payment.update({
      where: { id: input.paymentId },
      data: { status: "CANCELLED" },
    });

    // Create adjustment record
    await tx.paymentAdjustment.create({
      data: {
        paymentId: input.paymentId,
        type: "CANCELLATION",
        amount: payment.amount,
        reason: input.reason,
        createdById: input.cancelledById,
      },
    });

    // Reverse instalment paid amount
    if (payment.instalmentId && payment.instalment) {
      const newPaidAmount = subtractMoney(
        new Decimal(payment.instalment.paidAmount.toString()),
        new Decimal(payment.amount.toString())
      );
      const isPaidAmountPositive = newPaidAmount.gt(0);
      await tx.instalment.update({
        where: { id: payment.instalmentId },
        data: {
          paidAmount: newPaidAmount.lte(0)
            ? new Decimal(0)
            : newPaidAmount.toDecimalPlaces(2),
          status: isPaidAmountPositive ? "PARTIALLY_PAID" : "PENDING",
        },
      });
    }

    return { success: true };
  });
}

export interface IssuePaymentRefundInput {
  organizationId: string;
  paymentId: string;
  amount: string;
  refundMethod: "CASH" | "UPI" | "BANK_TRANSFER" | "CARD" | "OTHER";
  transactionReference?: string;
  reason: string;
  createdById: string;
}

/**
 * Issue a partial or full refund against a payment.
 * Records PaymentAdjustment, reverses instalment paid amounts, and recalculates student balances.
 */
export async function issuePaymentRefund(input: IssuePaymentRefundInput) {
  const refundAmount = new Decimal(input.amount);
  if (refundAmount.lte(0)) {
    throw new AppError("Refund amount must be greater than zero", 422);
  }

  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: { id: input.paymentId, organizationId: input.organizationId },
      include: {
        instalment: true,
        adjustments: true,
        student: { select: { id: true, publicId: true, fullName: true, studentCode: true } },
      },
    });

    if (!payment) throw new NotFoundError("Payment");
    if (payment.status !== "SUCCESSFUL" && payment.status !== "REFUNDED") {
      throw new ConflictError("Refunds can only be issued against successful payments");
    }

    // Calculate maximum refundable amount
    const existingRefunds = payment.adjustments
      .filter((a) => a.type === "REFUND" || a.type === "CANCELLATION")
      .reduce((acc, a) => acc.add(new Decimal(a.amount.toString())), new Decimal(0));

    const originalAmount = new Decimal(payment.amount.toString());
    const maxRefundable = originalAmount.sub(existingRefunds);

    if (refundAmount.gt(maxRefundable)) {
      throw new AppError(
        `Refund amount ₹${refundAmount.toFixed(2)} exceeds maximum refundable balance ₹${maxRefundable.toFixed(2)}`,
        422
      );
    }

    // 1. Create PaymentAdjustment record
    const reasonText = `${input.refundMethod}: ${input.reason}${
      input.transactionReference ? ` (Ref: ${input.transactionReference})` : ""
    }`;

    const adjustment = await tx.paymentAdjustment.create({
      data: {
        paymentId: payment.id,
        type: "REFUND",
        amount: refundAmount.toDecimalPlaces(2),
        reason: reasonText,
        createdById: input.createdById,
      },
    });

    // 2. If fully refunded, update payment status to REFUNDED
    const totalRefundedNow = existingRefunds.add(refundAmount);
    if (totalRefundedNow.gte(originalAmount)) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "REFUNDED" },
      });
    }

    // 3. Reverse instalment paid amount
    if (payment.instalmentId && payment.instalment) {
      const currentInstalment = await tx.instalment.findUnique({
        where: { id: payment.instalmentId },
      });
      if (currentInstalment) {
        const currentInstPaid = new Decimal(currentInstalment.paidAmount.toString());
        const newInstPaid = currentInstPaid.sub(refundAmount);
        const safePaid = newInstPaid.lte(0) ? new Decimal(0) : newInstPaid.toDecimalPlaces(2);
        const instTotal = new Decimal(currentInstalment.amount.toString());
        const newStatus = safePaid.gte(instTotal)
          ? "PAID"
          : safePaid.gt(0)
          ? "PARTIALLY_PAID"
          : "PENDING";

        await tx.instalment.update({
          where: { id: currentInstalment.id },
          data: {
            paidAmount: safePaid,
            status: newStatus,
            updatedAt: new Date(),
          },
        });
      }
    }

    // 4. Recalculate balance for student
    const financials = await recalculateStudentBalance(payment.studentId, tx);

    return {
      adjustmentId: adjustment.id,
      paymentId: payment.id,
      studentId: payment.studentId,
      studentPublicId: payment.student.publicId,
      refundAmount: refundAmount.toFixed(2),
      remainingRefundable: maxRefundable.sub(refundAmount).toFixed(2),
      newOutstandingBalance: financials.outstandingBalance.toFixed(2),
      effectivePaid: financials.totalPaid.sub(financials.totalAdjustments).toFixed(2),
    };
  });
}


