import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { createStudent } from "@/server/services/student.service";
import { createPayment } from "@/server/services/payment.service";

describe("Integration: Student & Payment Lifecycle", () => {
  let orgId: string;
  let adminUserId: string;
  let courseId: string;
  let createdStudentPublicId: string;
  let createdStudentId: string;
  let instalmentId: string;

  beforeAll(async () => {
    // Look up seeded org and user
    const org = await prisma.organization.findFirst();
    const user = await prisma.user.findFirst();
    const course = await prisma.course.findFirst();

    if (!org || !user || !course) {
      throw new Error("Seed data missing for integration test");
    }

    orgId = org.id;
    adminUserId = user.id;
    courseId = course.id;
  });

  afterAll(async () => {
    // Cleanup created test student and associated transactions
    if (createdStudentId) {
      await prisma.receipt.deleteMany({ where: { studentId: createdStudentId } });
      await prisma.payment.deleteMany({ where: { studentId: createdStudentId } });
      await prisma.instalment.deleteMany({ where: { studentId: createdStudentId } });
      await prisma.feeAgreement.deleteMany({ where: { studentId: createdStudentId } });
      await prisma.student.deleteMany({ where: { id: createdStudentId } });
    }
  });

  it("registers a new student with transactional fee agreement and instalments", async () => {
    const res = await createStudent({
      organizationId: orgId,
      createdById: adminUserId,
      fullName: "Test Integration Student",
      phone: "9999988888",
      email: "test.student@example.com",
      joiningDate: new Date(),
      courseId,
      quotedFee: "25000.00",
      registrationFee: "2000.00",
      discountAmount: "1000.00", // Total payable: 26,000
      instalments: [
        {
          label: "Registration",
          amount: "6000.00",
          dueDate: new Date(),
        },
        {
          label: "2nd Instalment",
          amount: "20000.00",
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    expect(res.studentId).toBeDefined();
    expect(res.studentCode).toBeDefined();
    createdStudentId = res.studentId;
    createdStudentPublicId = res.studentPublicId;

    // Verify fee agreement
    const feeAgreement = await prisma.feeAgreement.findUnique({
      where: { studentId: res.studentId },
      include: { instalments: true },
    });

    expect(feeAgreement).toBeDefined();
    expect(feeAgreement?.totalPayable.toNumber()).toBe(26000);
    expect(feeAgreement?.instalments.length).toBe(2);

    instalmentId = feeAgreement!.instalments[0]!.id;
  });

  it("records payment with idempotency and updates instalment & balance", async () => {
    const key = "test-idemp-" + Math.random();

    const paymentRes = await createPayment({
      organizationId: orgId,
      createdById: adminUserId,
      studentId: createdStudentId,
      instalmentId,
      amount: "6000.00",
      paymentMethod: "UPI",
      transactionReference: "UPI-TEST-123456",
      idempotencyKey: key,
    });

    expect(paymentRes.paymentId).toBeDefined();
    expect(paymentRes.receiptNumber).toMatch(/^RLA-\d+$/);
    expect(paymentRes.remainingBalance).toBe("20000.00");

    // Test idempotency: resending same key must return identical result without duplicate transaction
    const dupRes = await createPayment({
      organizationId: orgId,
      createdById: adminUserId,
      studentId: createdStudentId,
      instalmentId,
      amount: "6000.00",
      paymentMethod: "UPI",
      idempotencyKey: key,
    });

    expect(dupRes.paymentId).toBe(paymentRes.paymentId);
    expect(dupRes.receiptNumber).toBe(paymentRes.receiptNumber);

    // Verify instalment status is now PAID
    const updatedInstalment = await prisma.instalment.findUnique({
      where: { id: instalmentId },
    });
    expect(updatedInstalment?.status).toBe("PAID");
    expect(updatedInstalment?.paidAmount.toNumber()).toBe(6000);
  });

  it("prevents overpayment exceeding outstanding balance", async () => {
    // Current outstanding is 20,000. Attempting to pay 25,000 must be rejected
    const key = "test-fail-" + Math.random();

    await expect(
      createPayment({
        organizationId: orgId,
        createdById: adminUserId,
        studentId: createdStudentId,
        instalmentId,
        amount: "25000.00",
        paymentMethod: "CASH",
        idempotencyKey: key,
      })
    ).rejects.toThrow(/exceeds outstanding balance/);
  });
});
