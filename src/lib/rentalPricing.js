/**
 * Pure date and rental-pricing utilities for GearNest.
 * Frontend totals are estimates only; the backend must independently
 * recalculate and validate all pricing before payment or booking creation.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function formatCurrencyBDT(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return "৳0";
  return `৳${Math.round(numeric).toLocaleString("en-US")}`;
}

export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODateToUTC(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcMs = Date.UTC(year, month - 1, day);
  const verify = new Date(utcMs);

  if (
    verify.getUTCFullYear() !== year ||
    verify.getUTCMonth() !== month - 1 ||
    verify.getUTCDate() !== day
  ) {
    return null;
  }

  return utcMs;
}

export function calculateInclusiveDays(startDate, endDate) {
  const startMs = parseISODateToUTC(startDate);
  const endMs = parseISODateToUTC(endDate);

  if (startMs === null || endMs === null || endMs < startMs) {
    return 0;
  }

  return Math.floor((endMs - startMs) / MS_PER_DAY) + 1;
}

export function getBillableUnits(inclusiveDays, rentalType = "Daily") {
  if (!inclusiveDays || inclusiveDays <= 0) return 0;

  const normalized = String(rentalType || "Daily").trim().toLowerCase();
  if (normalized === "weekly") {
    return Math.ceil(inclusiveDays / 7);
  }
  if (normalized === "monthly") {
    return Math.ceil(inclusiveDays / 30);
  }
  return inclusiveDays;
}

export function getUnitLabel(rentalType = "Daily", count = 1) {
  const normalized = String(rentalType || "Daily").trim().toLowerCase();
  const singular =
    normalized === "weekly"
      ? "week"
      : normalized === "monthly"
        ? "month"
        : "day";
  return count === 1 ? singular : `${singular}s`;
}

export function calculateRentalEstimate({
  rentalPrice = 0,
  rentalType = "Daily",
  startDate = "",
  endDate = "",
  quantity = 1,
}) {
  const unitPrice = Math.max(0, Number(rentalPrice) || 0);
  const safeQuantity = Math.max(0, Math.floor(Number(quantity) || 0));
  const inclusiveDays = calculateInclusiveDays(startDate, endDate);
  const billableUnits = getBillableUnits(inclusiveDays, rentalType);
  const estimatedTotal =
    inclusiveDays > 0 && safeQuantity > 0
      ? unitPrice * billableUnits * safeQuantity
      : 0;

  return {
    unitPrice,
    rentalType,
    inclusiveDays,
    billableUnits,
    unitLabel: getUnitLabel(rentalType, billableUnits),
    quantity: safeQuantity,
    estimatedTotal,
    isValidRange: inclusiveDays > 0,
  };
}
