import { describe, it, expect } from "vitest";
import {
  phoneSchema,
  emailSchema,
  amountSchema,
  createPaymentSchema,
} from "@/lib/validation/schemas";

describe("Validation Schemas", () => {
  it("validates 10-digit Indian mobile numbers", () => {
    expect(phoneSchema.safeParse("9876543210").success).toBe(true);
    expect(phoneSchema.safeParse("8123456789").success).toBe(true);
    expect(phoneSchema.safeParse("7000000000").success).toBe(true);
    expect(phoneSchema.safeParse("6000000000").success).toBe(true);

    // Invalid numbers
    expect(phoneSchema.safeParse("1234567890").success).toBe(false); // Does not start with 6-9
    expect(phoneSchema.safeParse("987654321").success).toBe(false); // Only 9 digits
    expect(phoneSchema.safeParse("98765432100").success).toBe(false); // 11 digits
    expect(phoneSchema.safeParse("abc9876543").success).toBe(false); // Letters
  });

  it("validates standard emails", () => {
    expect(emailSchema.safeParse("test@raadhelabel.com").success).toBe(true);
    expect(emailSchema.safeParse("notanemail").success).toBe(false);
  });

  it("validates monetary amount strings", () => {
    expect(amountSchema.safeParse("1000").success).toBe(true);
    expect(amountSchema.safeParse("1000.50").success).toBe(true);
    expect(amountSchema.safeParse(500).success).toBe(true);

    // Invalid amounts
    expect(amountSchema.safeParse("0").success).toBe(false);
    expect(amountSchema.safeParse("-100").success).toBe(false);
    expect(amountSchema.safeParse("abc").success).toBe(false);
  });

  it("validates payment creation schema", () => {
    const validPayment = {
      studentId: "std_123",
      instalmentId: "inst_456",
      amount: "5000",
      paymentMethod: "UPI",
      idempotencyKey: "123e4567-e89b-12d3-a456-426614174000",
    };
    expect(createPaymentSchema.safeParse(validPayment).success).toBe(true);

    // Missing idempotencyKey (must be UUID)
    const invalidKey = { ...validPayment, idempotencyKey: "not-a-uuid" };
    expect(createPaymentSchema.safeParse(invalidKey).success).toBe(false);
  });
});

