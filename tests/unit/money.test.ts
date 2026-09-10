import { describe, it, expect } from "vitest";
import {
  Decimal,
  addMoney,
  subtractMoney,
  formatCurrency,
  isPositive,
  isZeroOrNegative,
  roundMoney,
} from "@/lib/money/decimal";

describe("Financial Precision & Money Utilities", () => {
  it("prevents floating point arithmetic drift", () => {
    // 0.1 + 0.2 is 0.30000000000000004 in standard IEEE 754 float
    const floatResult = 0.1 + 0.2;
    expect(floatResult).not.toBe(0.3);

    // With our money utility:
    const safeResult = addMoney("0.1", "0.2");
    expect(safeResult.toString()).toBe("0.3");
  });

  it("adds multiple money amounts accurately", () => {
    const total = addMoney("10000.50", "2000.25", "500.25");
    expect(total.toString()).toBe("12501");
  });

  it("subtracts money accurately to compute outstanding balances", () => {
    const quoted = new Decimal("32000.00");
    const paid1 = new Decimal("10000.00");
    const paid2 = new Decimal("12000.00");

    const remaining = subtractMoney(quoted, paid1, paid2);
    expect(remaining.toString()).toBe("10000");
  });

  it("properly formats Indian Rupee currency", () => {
    const formatted = formatCurrency("150000");
    expect(formatted).toContain("1,50,000.00");
  });

  it("checks positive and zero/negative thresholds", () => {
    expect(isPositive("100")).toBe(true);
    expect(isPositive("0")).toBe(false);
    expect(isPositive("-50")).toBe(false);

    expect(isZeroOrNegative("0")).toBe(true);
    expect(isZeroOrNegative("-10")).toBe(true);
    expect(isZeroOrNegative("10")).toBe(false);
  });

  it("rounds money to exactly two decimal places using round-half-up", () => {
    expect(roundMoney("10.555").toString()).toBe("10.56");
    expect(roundMoney("10.554").toString()).toBe("10.55");
  });
});

