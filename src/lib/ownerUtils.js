import {
  formatBookingDuration,
  formatDisplayDate,
  getBookingStatusBadge,
  getPaymentStatusBadge,
} from "./customerUtils.js";

export const OWNER_PERIOD_OPTIONS = [
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last 12 Months", value: "12m" },
];

export const DEFAULT_OWNER_PERIOD = "6m";

const APPROVAL_BADGE_VARIANTS = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

export function normalizeOwnerAnalyticsPeriod(rawPeriod) {
  const clean = String(rawPeriod || "")
    .trim()
    .toLowerCase();
  if (clean === "3m" || clean === "6m" || clean === "12m") {
    return clean;
  }
  return DEFAULT_OWNER_PERIOD;
}

export function getApprovalStatusBadge(status) {
  const raw = String(status || "").trim();
  if (!raw) {
    return { label: "Unknown", variant: "neutral" };
  }
  const variant = APPROVAL_BADGE_VARIANTS[raw.toLowerCase()] || "neutral";
  const label = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return { label, variant };
}

function toNonNegativeNumber(value, fallback = 0) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return fallback;
  return num;
}

function toOptionalNonNegativeNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return null;
  return num;
}

export function normalizeOwnerEquipmentPerformanceItem(raw) {
  if (!raw || typeof raw !== "object") return null;

  const id = raw._id || raw.id || raw.equipmentId || "";
  if (!id && !raw.name) return null;

  const availableQuantity = toOptionalNonNegativeNumber(raw.availableQuantity);
  const approvalStatus = raw.approvalStatus || raw.status || "";
  const availabilityLabel =
    raw.availabilityStatus ||
    (availableQuantity !== null
      ? availableQuantity > 0
        ? "Available"
        : "Unavailable"
      : "");

  return {
    _id: String(id || raw.name),
    name: String(raw.name || "Listed Equipment"),
    image:
      raw.image ||
      (Array.isArray(raw.images) ? raw.images[0] : "") ||
      "/images/hero-equipment.jpg",
    category: String(raw.category || ""),
    rentalPrice: toOptionalNonNegativeNumber(raw.rentalPrice),
    rentalType: String(raw.rentalType || "Daily"),
    approvalStatus: String(approvalStatus || ""),
    availableQuantity,
    availabilityStatus: String(availabilityLabel || ""),
    rentalsCount: toOptionalNonNegativeNumber(
      raw.rentalsCount ?? raw.totalRentals ?? raw.bookingsCount
    ),
    earningsGenerated: toOptionalNonNegativeNumber(
      raw.earningsGenerated ?? raw.totalEarnings ?? raw.revenue
    ),
  };
}

export function normalizeOwnerRecentRentalItem(raw) {
  if (!raw || typeof raw !== "object") return null;

  const equipmentObj =
    raw.equipment && typeof raw.equipment === "object" ? raw.equipment : {};
  const customerObj =
    raw.customer && typeof raw.customer === "object" ? raw.customer : {};

  const equipmentId =
    equipmentObj._id || equipmentObj.id || raw.equipmentId || "";
  const startDate = raw.startDate || raw.rentalStartDate || "";
  const endDate = raw.endDate || raw.rentalEndDate || "";

  const bookingAmount = toOptionalNonNegativeNumber(
    raw.bookingAmount ?? raw.totalAmount ?? raw.amount
  );

  const quantity = toOptionalNonNegativeNumber(raw.quantity ?? raw.requiredQuantity);
  const rawDurationDays = toOptionalNonNegativeNumber(
    raw.durationDays ?? raw.duration
  );

  return {
    _id: String(raw._id || raw.id || `${equipmentId}-${startDate}`),
    bookingReference: String(raw.bookingReference || raw.bookingCode || raw._id || ""),
    customerName: String(
      customerObj.name || raw.customerName || ""
    ).trim(),
    equipment: {
      _id: equipmentId ? String(equipmentId) : "",
      name: String(
        equipmentObj.name || raw.equipmentName || "Equipment Item"
      ),
      image:
        equipmentObj.image ||
        (Array.isArray(equipmentObj.images) ? equipmentObj.images[0] : "") ||
        raw.equipmentImage ||
        "/images/hero-equipment.jpg",
    },
    startDate,
    endDate,
    durationLabel: formatBookingDuration(startDate, endDate, rawDurationDays),
    quantity: quantity !== null && quantity > 0 ? Math.floor(quantity) : null,
    bookingAmount: bookingAmount ?? 0,
    paymentStatus: String(raw.paymentStatus || "Pending"),
    bookingStatus: String(raw.bookingStatus || raw.status || "Pending"),
    createdAt: raw.createdAt || raw.bookingDate || startDate || "",
  };
}

/**
 * Normalize backend GET /api/owner/analytics payload without fabricating metrics.
 * Returns zero-filled summary counters and empty arrays for missing backend fields.
 */
export function normalizeOwnerAnalyticsPayload(rawResponse) {
  const data =
    rawResponse?.data && typeof rawResponse.data === "object"
      ? rawResponse.data
      : rawResponse && typeof rawResponse === "object"
        ? rawResponse
        : {};

  const rawBreakdown =
    data.equipmentStatusBreakdown &&
    typeof data.equipmentStatusBreakdown === "object"
      ? data.equipmentStatusBreakdown
      : null;

  const equipmentStatusBreakdown = rawBreakdown
    ? {
        approved: toOptionalNonNegativeNumber(rawBreakdown.approved),
        pending: toOptionalNonNegativeNumber(rawBreakdown.pending),
        rejected: toOptionalNonNegativeNumber(rawBreakdown.rejected),
      }
    : null;

  const monthlyEarningsData = Array.isArray(data.monthlyEarningsData)
    ? data.monthlyEarningsData
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          month: String(entry.month || entry.label || "—"),
          earnings: toNonNegativeNumber(
            entry.earnings ?? entry.amount ?? entry.totalEarnings,
            0
          ),
        }))
    : [];

  const monthlyRentalData = Array.isArray(data.monthlyRentalData)
    ? data.monthlyRentalData
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          month: String(entry.month || entry.label || "—"),
          totalBookings: Math.floor(
            toNonNegativeNumber(
              entry.totalBookings ?? entry.bookingsCount ?? entry.bookings,
              0
            )
          ),
          completedRentals: Math.floor(
            toNonNegativeNumber(
              entry.completedRentals ?? entry.completed ?? 0,
              0
            )
          ),
        }))
    : [];

  const equipmentPerformance = Array.isArray(data.equipmentPerformance)
    ? data.equipmentPerformance
        .map(normalizeOwnerEquipmentPerformanceItem)
        .filter(Boolean)
    : [];

  const recentRentals = Array.isArray(data.recentRentals)
    ? data.recentRentals
        .map(normalizeOwnerRecentRentalItem)
        .filter(Boolean)
    : [];

  return {
    stats: {
      totalListedEquipment: Math.floor(
        toNonNegativeNumber(data.totalListedEquipment, 0)
      ),
      completedRentals: Math.floor(
        toNonNegativeNumber(data.completedRentals, 0)
      ),
      totalEarnings: toNonNegativeNumber(data.totalEarnings, 0),
      monthlyEarnings: toNonNegativeNumber(data.monthlyEarnings, 0),
      grossBookingVolume: toOptionalNonNegativeNumber(data.grossBookingVolume),
      equipmentStatusBreakdown,
    },
    monthlyEarningsData,
    monthlyRentalData,
    equipmentPerformance,
    recentRentals,
  };
}

export { formatDisplayDate, getBookingStatusBadge, getPaymentStatusBadge };
