import {
  formatBookingDuration,
  formatDisplayDate,
  getBookingStatusBadge,
  getPaymentStatusBadge,
  PAYMENT_FILTER_OPTIONS,
  RENTAL_FILTER_OPTIONS,
} from "./customerUtils.js";
import {
  ALLOWED_EQUIPMENT_CATEGORIES,
  computeOwnerEquipmentStats,
  getApprovalStatusBadge,
  mapEquipmentToFormValues,
  normalizeOwnerEquipmentItem,
  normalizeOwnerRental,
  OWNER_EQUIPMENT_STATUS_OPTIONS,
} from "./ownerUtils.js";
import {
  getRoleBadgeVariant,
  getRoleLabel,
  normalizeUserRole,
  USER_ROLES,
} from "./roleNavigation.js";

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

export {
  ALLOWED_EQUIPMENT_CATEGORIES,
  computeOwnerEquipmentStats,
  formatBookingDuration,
  formatDisplayDate,
  getApprovalStatusBadge,
  getBookingStatusBadge,
  getPaymentStatusBadge,
  getRoleBadgeVariant,
  getRoleLabel,
  mapEquipmentToFormValues,
  OWNER_EQUIPMENT_STATUS_OPTIONS,
  PAYMENT_FILTER_OPTIONS,
  RENTAL_FILTER_OPTIONS,
};

export const DEFAULT_ADMIN_PAGE_LIMIT = 10;

export const ADMIN_ASSIGNABLE_ROLES = ["Customer", "Owner", "Admin"];

export const ADMIN_USER_ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Customer", value: "Customer" },
  { label: "Owner", value: "Owner" },
  { label: "Admin", value: "Admin" },
];

export const ADMIN_USER_SORT_OPTIONS = [
  { label: "Recently Registered", value: "newest" },
  { label: "Oldest Registered", value: "oldest" },
  { label: "Name A to Z", value: "name_asc" },
  { label: "Name Z to A", value: "name_desc" },
];

export const ADMIN_EQUIPMENT_SORT_OPTIONS = [
  { label: "Recently Submitted", value: "newest" },
  { label: "Oldest Submitted", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export const ADMIN_RENTAL_SORT_OPTIONS = [
  { label: "Newest Bookings", value: "newest" },
  { label: "Oldest Bookings", value: "oldest" },
  { label: "Booking Amount: Low to High", value: "amount_asc" },
  { label: "Booking Amount: High to Low", value: "amount_desc" },
];

function normalizeOptionValue(rawValue, optionsList, fallback = "all") {
  const clean = String(rawValue || "").trim();
  if (!clean || clean.toLowerCase() === "all") return fallback;
  const match = optionsList.find(
    (opt) => opt.value.toLowerCase() === clean.toLowerCase()
  );
  return match ? match.value : fallback;
}

function normalizeSortValue(rawSort, optionsList, fallback = "newest") {
  const clean = String(rawSort || "").trim();
  const match = optionsList.find((opt) => opt.value === clean);
  return match ? match.value : fallback;
}

export function normalizeDisplayRole(rawRole) {
  const roleKey = normalizeUserRole(rawRole);
  if (roleKey === USER_ROLES.ADMIN) return "Admin";
  if (roleKey === USER_ROLES.OWNER) return "Owner";
  return "Customer";
}

export function isValidAssignableRole(role) {
  return ADMIN_ASSIGNABLE_ROLES.includes(normalizeDisplayRole(role)) &&
    ADMIN_ASSIGNABLE_ROLES.some(
      (item) => item.toLowerCase() === String(role || "").trim().toLowerCase()
    );
}

export function parseAdminUsersFiltersFromParams(searchParams) {
  const getParam = (key) =>
    typeof searchParams?.get === "function"
      ? searchParams.get(key)
      : searchParams?.[key];

  const rawPage = Number(getParam("page"));
  return {
    search: String(getParam("search") || "").trim(),
    role: normalizeOptionValue(getParam("role"), ADMIN_USER_ROLE_OPTIONS, "all"),
    sort: normalizeSortValue(getParam("sort"), ADMIN_USER_SORT_OPTIONS, "newest"),
    page: Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1,
    limit: DEFAULT_ADMIN_PAGE_LIMIT,
  };
}

export function buildAdminUsersQueryString(filters = {}) {
  const params = new URLSearchParams();
  const search = String(filters.search || "").trim();
  if (search) params.set("search", search);

  const role = normalizeOptionValue(filters.role, ADMIN_USER_ROLE_OPTIONS, "all");
  if (role !== "all") params.set("role", role);

  const sort = normalizeSortValue(filters.sort, ADMIN_USER_SORT_OPTIONS, "newest");
  if (sort !== "newest") params.set("sort", sort);

  const page = Number(filters.page);
  if (Number.isFinite(page) && page > 1) params.set("page", String(Math.floor(page)));

  return params.toString();
}

export function normalizeAdminUser(raw) {
  if (!raw || typeof raw !== "object") return null;

  const id = String(raw._id || raw.id || raw.userId || "").trim();
  if (!id && !raw.email && !raw.name) return null;

  const accountStatusRaw = String(
    raw.accountStatus ||
      raw.status ||
      (raw.isSuspended === true
        ? "Suspended"
        : raw.isActive === false
          ? "Inactive"
          : "")
  ).trim();

  return {
    _id: id,
    name: String(raw.name || raw.fullName || "Registered User").trim(),
    email: String(raw.email || "").trim(),
    photoURL: String(raw.image || raw.photoURL || raw.avatar || "").trim(),
    role: normalizeDisplayRole(raw.role),
    accountStatus: accountStatusRaw,
    phone: String(raw.phone || raw.contactNumber || "").trim(),
    address: String(raw.address || "").trim(),
    provider: String(raw.provider || raw.authProvider || "").trim(),
    emailVerified:
      typeof raw.emailVerified === "boolean" ? raw.emailVerified : null,
    createdAt: raw.createdAt || raw.registeredAt || "",
  };
}

export function parseAdminEquipmentFiltersFromParams(searchParams) {
  const getParam = (key) =>
    typeof searchParams?.get === "function"
      ? searchParams.get(key)
      : searchParams?.[key];

  const rawPage = Number(getParam("page"));
  const categoryCandidate = String(getParam("category") || "").trim();
  const matchedCategory = ALLOWED_EQUIPMENT_CATEGORIES.find(
    (cat) => cat.toLowerCase() === categoryCandidate.toLowerCase()
  );

  return {
    search: String(getParam("search") || "").trim(),
    category: matchedCategory || "all",
    status: normalizeOptionValue(
      getParam("status"),
      OWNER_EQUIPMENT_STATUS_OPTIONS,
      "all"
    ),
    sort: normalizeSortValue(
      getParam("sort"),
      ADMIN_EQUIPMENT_SORT_OPTIONS,
      "newest"
    ),
    page: Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1,
    limit: DEFAULT_ADMIN_PAGE_LIMIT,
  };
}

export function buildAdminEquipmentQueryString(filters = {}) {
  const params = new URLSearchParams();
  const search = String(filters.search || "").trim();
  if (search) params.set("search", search);

  const categoryCandidate = String(filters.category || "").trim();
  const matchedCategory = ALLOWED_EQUIPMENT_CATEGORIES.find(
    (cat) => cat.toLowerCase() === categoryCandidate.toLowerCase()
  );
  if (matchedCategory) params.set("category", matchedCategory);

  const status = normalizeOptionValue(
    filters.status,
    OWNER_EQUIPMENT_STATUS_OPTIONS,
    "all"
  );
  if (status !== "all") params.set("status", status);

  const sort = normalizeSortValue(
    filters.sort,
    ADMIN_EQUIPMENT_SORT_OPTIONS,
    "newest"
  );
  if (sort !== "newest") params.set("sort", sort);

  const page = Number(filters.page);
  if (Number.isFinite(page) && page > 1) params.set("page", String(Math.floor(page)));

  return params.toString();
}

export function normalizeAdminEquipmentItem(raw) {
  return normalizeOwnerEquipmentItem(raw);
}

export function parseAdminRentalsFiltersFromParams(searchParams) {
  const getParam = (key) =>
    typeof searchParams?.get === "function"
      ? searchParams.get(key)
      : searchParams?.[key];

  const rawPage = Number(getParam("page"));
  const bookingParam = getParam("bookingStatus") || getParam("status");
  const paymentParam = getParam("paymentStatus");

  return {
    search: String(getParam("search") || "").trim(),
    bookingStatus: normalizeOptionValue(
      bookingParam,
      RENTAL_FILTER_OPTIONS,
      "all"
    ),
    paymentStatus: normalizeOptionValue(
      paymentParam,
      PAYMENT_FILTER_OPTIONS,
      "all"
    ),
    sort: normalizeSortValue(
      getParam("sort"),
      ADMIN_RENTAL_SORT_OPTIONS,
      "newest"
    ),
    page: Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1,
    limit: DEFAULT_ADMIN_PAGE_LIMIT,
  };
}

export function buildAdminRentalsQueryString(filters = {}) {
  const params = new URLSearchParams();
  const search = String(filters.search || "").trim();
  if (search) params.set("search", search);

  const bookingStatus = normalizeOptionValue(
    filters.bookingStatus,
    RENTAL_FILTER_OPTIONS,
    "all"
  );
  if (bookingStatus !== "all") params.set("bookingStatus", bookingStatus);

  const paymentStatus = normalizeOptionValue(
    filters.paymentStatus,
    PAYMENT_FILTER_OPTIONS,
    "all"
  );
  if (paymentStatus !== "all") params.set("paymentStatus", paymentStatus);

  const sort = normalizeSortValue(
    filters.sort,
    ADMIN_RENTAL_SORT_OPTIONS,
    "newest"
  );
  if (sort !== "newest") params.set("sort", sort);

  const page = Number(filters.page);
  if (Number.isFinite(page) && page > 1) params.set("page", String(Math.floor(page)));

  return params.toString();
}

export function normalizeAdminRental(raw) {
  const base = normalizeOwnerRental(raw);
  if (!base) return null;

  const ownerSource =
    raw?.owner && typeof raw.owner === "object"
      ? raw.owner
      : raw?.equipment?.owner && typeof raw.equipment.owner === "object"
        ? raw.equipment.owner
        : {};

  const ownerName = String(
    ownerSource.name || raw?.ownerName || raw?.equipment?.ownerName || "Listing Owner"
  ).trim();
  const ownerEmail = String(
    ownerSource.email || raw?.ownerEmail || ""
  ).trim();
  const ownerPhoto = String(
    ownerSource.photoURL ||
      ownerSource.image ||
      raw?.ownerPhotoURL ||
      raw?.ownerImage ||
      ""
  ).trim();

  return {
    ...base,
    owner: {
      name: ownerName || "Listing Owner",
      email: ownerEmail,
      photoURL: ownerPhoto,
    },
  };
}

export function extractPaginationMeta(rawResponse, itemCount = 0, fallbackPage = 1, fallbackLimit = DEFAULT_ADMIN_PAGE_LIMIT) {
  const rawPagination = rawResponse?.pagination || rawResponse?.meta || null;
  const hasServerPagination = Boolean(
    rawPagination &&
      (typeof rawPagination.totalItems === "number" ||
        typeof rawPagination.total === "number" ||
        typeof rawPagination.totalPages === "number")
  );

  const totalItems = hasServerPagination
    ? Number(rawPagination.totalItems ?? rawPagination.total ?? itemCount)
    : itemCount;
  const limit = Number(rawPagination?.limit || fallbackLimit);
  const currentPage = Number(
    rawPagination?.currentPage ?? rawPagination?.page ?? fallbackPage
  );
  const totalPages = hasServerPagination
    ? Math.max(
        totalItems > 0 ? 1 : 0,
        Number(
          rawPagination.totalPages ?? Math.ceil(totalItems / Math.max(1, limit))
        )
      )
    : itemCount > 0
      ? 1
      : 0;

  return {
    currentPage,
    page: currentPage,
    limit,
    totalItems,
    total: totalItems,
    totalPages,
    serverPaginationSupported: hasServerPagination,
  };
}
