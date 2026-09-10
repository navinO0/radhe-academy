import Decimal from "decimal.js";

// Configure Decimal.js for financial precision
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21,
});

export { Decimal };

/**
 * Format a Decimal/number as Indian Rupee string
 */
export function formatCurrency(
  amount: Decimal | number | string,
  options?: { showSymbol?: boolean }
): string {
  const num = new Decimal(amount).toNumber();
  const formatted = new Intl.NumberFormat("en-IN", {
    style: options?.showSymbol === false ? "decimal" : "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  return formatted;
}

/**
 * Safely add monetary amounts (avoids float arithmetic)
 */
export function addMoney(
  ...amounts: (Decimal | number | string)[]
): Decimal {
  return amounts.reduce(
    (sum, amount) => new Decimal(sum).add(new Decimal(amount)),
    new Decimal(0)
  ) as Decimal;
}

/**
 * Safely subtract monetary amounts
 */
export function subtractMoney(
  base: Decimal | number | string,
  ...amounts: (Decimal | number | string)[]
): Decimal {
  return amounts.reduce(
    (result, amount) => new Decimal(result).sub(new Decimal(amount)),
    new Decimal(base)
  ) as Decimal;
}

/**
 * Check if an amount is positive (> 0)
 */
export function isPositive(amount: Decimal | number | string): boolean {
  return new Decimal(amount).gt(0);
}

/**
 * Check if an amount is zero or negative
 */
export function isZeroOrNegative(amount: Decimal | number | string): boolean {
  return new Decimal(amount).lte(0);
}

/**
 * Clamp to 2 decimal places (for display/storage)
 */
export function roundMoney(amount: Decimal | number | string): Decimal {
  return new Decimal(amount).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

/**
 * Convert Prisma Decimal to JS number (for non-critical display only)
 */
export function toNumber(amount: Decimal | number | string): number {
  return new Decimal(amount).toNumber();
}

/**
 * Convert to string for storage (Prisma returns Decimal objects)
 */
export function toString(amount: Decimal | number | string): string {
  return new Decimal(amount).toFixed(2);
}

