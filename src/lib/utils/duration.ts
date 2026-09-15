/**
 * Calculate the estimated batch end date given a start date and a course duration string.
 * Supports formats like:
 * - "6 months", "3 month", "1 year", "2 years"
 * - "12 weeks", "4 week", "45 days", "30 day"
 *
 * Defaults to start date if duration cannot be parsed.
 */
export function calculateEndDateFromDuration(
  startDateStr: string,
  durationStr?: string | null
): string {
  if (!startDateStr) return "";
  if (!durationStr || typeof durationStr !== "string") return "";

  const trimmed = durationStr.trim().toLowerCase();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(month|mon|m|week|wk|w|day|d|year|yr|y)s?$/i);

  if (!match) {
    // Try finding any number followed by unit anywhere in string (e.g. "Duration: 6 Months")
    const flexibleMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(month|mon|week|wk|day|year|yr)s?/i);
    if (!flexibleMatch || !flexibleMatch[1] || !flexibleMatch[2]) return "";
    return computeDate(startDateStr, parseFloat(flexibleMatch[1]), flexibleMatch[2].toLowerCase());
  }

  if (!match[1] || !match[2]) return "";
  return computeDate(startDateStr, parseFloat(match[1]), match[2].toLowerCase());
}

function computeDate(startDateStr: string, amount: number, unit: string): string {
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return "";

  if (unit.startsWith("m")) {
    // Months
    const targetMonth = date.getMonth() + Math.round(amount);
    date.setMonth(targetMonth);
  } else if (unit.startsWith("w")) {
    // Weeks
    date.setDate(date.getDate() + Math.round(amount * 7));
  } else if (unit.startsWith("d")) {
    // Days
    date.setDate(date.getDate() + Math.round(amount));
  } else if (unit.startsWith("y")) {
    // Years
    date.setFullYear(date.getFullYear() + Math.round(amount));
  } else {
    return "";
  }

  const iso = date.toISOString().split("T")[0];
  return iso || "";
}
