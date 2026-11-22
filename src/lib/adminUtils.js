import { formatDisplayDate, getBookingStatusBadge, getPaymentStatusBadge } from "./customerUtils.js";
import { getApprovalStatusBadge } from "./ownerUtils.js";

export const ADMIN_PERIOD_OPTIONS = [
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last 12 Months", value: "12m" },
];

export const DEFAULT_ADMIN_PERIOD = "6m";

export function normalizeAdminAnalyticsPeriod(rawPeriod) {
  const clean = String(rawPeriod || "")
    .trim()
    .toLowerCase();
  if (clean === "3m" || clean === "6m" || clean === "12m") {
    return clean;
  }
  return DEFAULT_ADMIN_PERIOD;
}

/**
 * Parse a backend counter or currency metric while distinguishing explicit 0
 * from missing/null unavailable metrics so the UI never fabricates numbers.
 */
function toOptionalMetricNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return null;
  }
  return num;
}

function toCountOrZero(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.floor(num);
}

function toNonNegativeAmount(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return 0;
  return num;
}

function normalizeApprovalStatusLabel(rawStatus) {
  const clean = String(rawStatus || "").trim().toLowerCase();
  if (clean === "pending") return "Pending";
  if (clean === "approved") return "Approved";
  if (clean === "rejected") return "Rejected";
  return "";
}

function normalizeActivityCategory(rawType) {
  const clean = String(rawType || "").trim().toLowerCase();
  if (clean.includes("user")) return "user";
  if (clean.includes("equip") || clean.includes("listing")) return "equipment";
  if (clean.includes("pay") || clean.includes("trans") || clean.includes("stripe")) {
    return "payment";
  }
  if (clean.includes("book") || clean.includes("rent")) return "booking";
  return "general";
}

function formatActivityTypeLabel(rawType, category) {
  const clean = String(rawType || "").trim();
  if (clean) return clean;
  if (category === "user") return "User Activity";
  if (category === "equipment") return "Equipment Submission";
  if (category === "payment") return "Payment Transaction";
  if (category === "booking") return "Rental Booking";
  return "Platform Activity";
}

export function normalizePlatformActivityItem(raw, index = 0) {
  if (!raw || typeof raw !== "object") return null;

  const category = normalizeActivityCategory(
    raw.type || raw.activityType || raw.category || raw.kind
  );

  const id = String(
    raw._id ||
      raw.id ||
      raw.referenceId ||
      raw.bookingId ||
      raw.equipmentId ||
      `activity-${index}`
  );

  const subject = String(
    raw.title ||
      raw.subject ||
      raw.name ||
      raw.equipmentName ||
      raw.userName ||
      raw.summary ||
      raw.description ||
      ""
  ).trim();

  const reference = String(
    raw.reference || raw.referenceId || raw.bookingReference || ""
  ).trim();

  if (!subject && !reference) {
    return null;
  }

  const rawStatus = String(
    raw.status || raw.bookingStatus || raw.paymentStatus || raw.approvalStatus || ""
  ).trim();

  let statusBadge = null;
  if (rawStatus) {
    if (category === "payment") {
      statusBadge = getPaymentStatusBadge(rawStatus);
    } else if (category === "equipment") {
      statusBadge = getApprovalStatusBadge(rawStatus);
    } else if (category === "booking") {
      statusBadge = getBookingStatusBadge(rawStatus);
    } else {
      const lower = rawStatus.toLowerCase();
      const variant =
        lower === "approved" || lower === "paid" || lower === "active" || lower === "completed"
          ? "success"
          : lower === "pending"
            ? "warning"
            : lower === "rejected" || lower === "failed" || lower === "cancelled"
              ? "danger"
              : "neutral";
      statusBadge = { label: rawStatus, variant };
    }
  }

  return {
    id,
    category,
    typeLabel: formatActivityTypeLabel(raw.type || raw.activityType, category),
    subject: subject || `Ref #${reference}`,
    reference,
    date: raw.createdAt || raw.date || raw.timestamp || "",
    statusBadge,
  };
}

export const UNAVAILABLE_ADMIN_ANALYTICS = {
  hasData: false,
  metrics: {
    totalUsers: null,
    totalEquipment: null,
    totalBookings: null,
    pendingApprovals: null,
    completedRentals: null,
    totalRevenue: null,
    monthlyBookings: null,
  },
  monthlyBookingData: [],
  monthlyRevenueData: [],
  equipmentApprovalData: [],
  recentActivity: [],
};

/**
 * Normalize backend GET /api/admin/analytics payload cleanly.
 * Distinguishes numeric 0 metrics from null/unavailable responses without fabricating values.
 */
export function normalizeAdminAnalyticsPayload(rawResponse) {
  if (!rawResponse || typeof rawResponse !== "object") {
    return UNAVAILABLE_ADMIN_ANALYTICS;
  }

  const data =
    rawResponse?.data && typeof rawResponse.data === "object"
      ? rawResponse.data
      : rawResponse;

  if (!data || typeof data !== "object") {
    return UNAVAILABLE_ADMIN_ANALYTICS;
  }

  const totalUsers = toOptionalMetricNumber(data.totalUsers);
  const totalEquipment = toOptionalMetricNumber(data.totalEquipment);
  const totalBookings = toOptionalMetricNumber(data.totalBookings);
  const pendingApprovals = toOptionalMetricNumber(data.pendingApprovals);
  const completedRentals = toOptionalMetricNumber(data.completedRentals);
  const totalRevenue = toOptionalMetricNumber(data.totalRevenue);
  const monthlyBookings = toOptionalMetricNumber(data.monthlyBookings);

  const monthlyBookingData = Array.isArray(data.monthlyBookingData)
    ? data.monthlyBookingData
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          month: String(entry.month || entry.label || "—"),
          bookings: toCountOrZero(
            entry.bookings ?? entry.totalBookings ?? entry.count
          ),
        }))
    : [];

  const monthlyRevenueData = Array.isArray(data.monthlyRevenueData)
    ? data.monthlyRevenueData
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) => ({
          month: String(entry.month || entry.label || "—"),
          revenue: toNonNegativeAmount(
            entry.revenue ?? entry.totalRevenue ?? entry.amount
          ),
        }))
    : [];

  const rawApprovals = Array.isArray(data.equipmentApprovalData)
    ? data.equipmentApprovalData
    : [];

  const equipmentApprovalData = rawApprovals
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => {
      const status = normalizeApprovalStatusLabel(entry.status);
      if (!status) return null;
      return {
        status,
        count: toCountOrZero(entry.count),
      };
    })
    .filter(Boolean);

  const recentActivity = Array.isArray(data.recentActivity)
    ? data.recentActivity.map(normalizePlatformActivityItem).filter(Boolean)
    : [];

  const hasAnyMetric =
    totalUsers !== null ||
    totalEquipment !== null ||
    totalBookings !== null ||
    pendingApprovals !== null ||
    completedRentals !== null ||
    totalRevenue !== null ||
    monthlyBookings !== null;

  return {
    hasData:
      hasAnyMetric ||
      monthlyBookingData.length > 0 ||
      monthlyRevenueData.length > 0 ||
      equipmentApprovalData.length > 0 ||
      recentActivity.length > 0,
    metrics: {
      totalUsers: totalUsers !== null ? Math.floor(totalUsers) : null,
      totalEquipment: totalEquipment !== null ? Math.floor(totalEquipment) : null,
      totalBookings: totalBookings !== null ? Math.floor(totalBookings) : null,
      pendingApprovals:
        pendingApprovals !== null ? Math.floor(pendingApprovals) : null,
      completedRentals:
        completedRentals !== null ? Math.floor(completedRentals) : null,
      totalRevenue,
      monthlyBookings:
        monthlyBookings !== null ? Math.floor(monthlyBookings) : null,
    },
    monthlyBookingData,
    monthlyRevenueData,
    equipmentApprovalData,
    recentActivity,
  };
}

export { formatDisplayDate };
