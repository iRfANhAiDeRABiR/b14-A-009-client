import { validateImageUrl } from "./authValidation.js";
import {
  formatBookingDuration,
  formatDisplayDate,
  getBookingStatusBadge,
  getPaymentStatusBadge,
  PAYMENT_FILTER_OPTIONS,
  RENTAL_FILTER_OPTIONS,
} from "./customerUtils.js";

export const ALLOWED_EQUIPMENT_CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

export const ALLOWED_RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

export const EQUIPMENT_CONDITION_OPTIONS = [
  "Like New",
  "Excellent",
  "Good",
  "Fair",
  "Refurbished",
];

export const EQUIPMENT_FORM_LIMITS = {
  nameMin: 3,
  nameMax: 100,
  descriptionMin: 20,
  descriptionMax: 1500,
  locationMin: 2,
  locationMax: 120,
  brandMax: 80,
  modelMax: 80,
  termsMin: 10,
  termsMax: 1500,
};

export const INITIAL_EQUIPMENT_FORM_VALUES = {
  name: "",
  description: "",
  category: "",
  location: "",
  rentalPrice: "",
  rentalType: "Daily",
  availableQuantity: "1",
  condition: "",
  brand: "",
  model: "",
  image: "",
  rentalTerms: "",
};

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

export const MAX_EQUIPMENT_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateEquipmentImageFile(file) {
  if (!file) {
    return "Please choose an equipment image file.";
  }

  const mime = String(file.type || "").toLowerCase();
  const fileName = String(file.name || "");
  const isValidType =
    ALLOWED_IMAGE_MIME_TYPES.has(mime) ||
    (!mime && ALLOWED_IMAGE_EXTENSIONS.test(fileName));

  if (!isValidType) {
    return "Unsupported file type. Upload a JPG, JPEG, PNG, or WEBP image.";
  }

  if (typeof file.size === "number") {
    if (file.size <= 0) {
      return "Selected image file is empty.";
    }
    if (file.size > MAX_EQUIPMENT_IMAGE_BYTES) {
      return "Equipment image must be 5 MB or smaller.";
    }
  }

  return "";
}

export function validateEquipmentListingForm(values = {}) {
  const errors = {};

  const name = String(values.name || "").trim();
  if (!name) {
    errors.name = "Equipment name is required.";
  } else if (name.length < EQUIPMENT_FORM_LIMITS.nameMin) {
    errors.name = `Equipment name must be at least ${EQUIPMENT_FORM_LIMITS.nameMin} characters.`;
  } else if (name.length > EQUIPMENT_FORM_LIMITS.nameMax) {
    errors.name = `Equipment name cannot exceed ${EQUIPMENT_FORM_LIMITS.nameMax} characters.`;
  }

  const description = String(values.description || "").trim();
  if (!description) {
    errors.description = "Equipment description is required.";
  } else if (description.length < EQUIPMENT_FORM_LIMITS.descriptionMin) {
    errors.description = `Please enter at least ${EQUIPMENT_FORM_LIMITS.descriptionMin} characters describing the equipment.`;
  } else if (description.length > EQUIPMENT_FORM_LIMITS.descriptionMax) {
    errors.description = `Description cannot exceed ${EQUIPMENT_FORM_LIMITS.descriptionMax} characters.`;
  }

  const category = String(values.category || "").trim();
  if (!ALLOWED_EQUIPMENT_CATEGORIES.includes(category)) {
    errors.category = "Select a valid equipment category.";
  }

  const location = String(values.location || "").trim();
  if (!location) {
    errors.location = "Rental location is required.";
  } else if (location.length < EQUIPMENT_FORM_LIMITS.locationMin) {
    errors.location = "Enter a valid rental location (e.g., Gazipur, Dhaka).";
  } else if (location.length > EQUIPMENT_FORM_LIMITS.locationMax) {
    errors.location = `Location cannot exceed ${EQUIPMENT_FORM_LIMITS.locationMax} characters.`;
  }

  const rawPrice = String(values.rentalPrice ?? "").trim();
  const numericPrice = Number(rawPrice);
  if (!rawPrice) {
    errors.rentalPrice = "Rental price is required.";
  } else if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    errors.rentalPrice = "Rental price must be a positive number greater than 0.";
  }

  const rentalType = String(values.rentalType || "").trim();
  if (!ALLOWED_RENTAL_TYPES.includes(rentalType)) {
    errors.rentalType = "Select Daily, Weekly, or Monthly as the rental type.";
  }

  const rawQty = String(values.availableQuantity ?? "").trim();
  const numericQty = Number(rawQty);
  if (!rawQty) {
    errors.availableQuantity = "Available quantity is required.";
  } else if (!Number.isInteger(numericQty) || numericQty < 1) {
    errors.availableQuantity =
      "Available quantity must be a whole number of at least 1.";
  }

  const condition = String(values.condition || "").trim();
  if (!condition) {
    errors.condition = "Equipment condition is required.";
  }

  const brand = String(values.brand || "").trim();
  if (!brand) {
    errors.brand = "Equipment brand is required.";
  } else if (brand.length > EQUIPMENT_FORM_LIMITS.brandMax) {
    errors.brand = `Brand cannot exceed ${EQUIPMENT_FORM_LIMITS.brandMax} characters.`;
  }

  const model = String(values.model || "").trim();
  if (!model) {
    errors.model = "Equipment model is required.";
  } else if (model.length > EQUIPMENT_FORM_LIMITS.modelMax) {
    errors.model = `Model cannot exceed ${EQUIPMENT_FORM_LIMITS.modelMax} characters.`;
  }

  const image = String(values.image || "").trim();
  if (!image) {
    errors.image = "Please upload an equipment image before submitting.";
  } else {
    const imageUrlErr = validateImageUrl(image);
    if (imageUrlErr) {
      errors.image = "Hosted equipment image URL is invalid. Please re-upload the image.";
    }
  }

  const rentalTerms = String(values.rentalTerms || "").trim();
  if (!rentalTerms) {
    errors.rentalTerms = "Rental terms and conditions are required.";
  } else if (rentalTerms.length < EQUIPMENT_FORM_LIMITS.termsMin) {
    errors.rentalTerms = `Please enter at least ${EQUIPMENT_FORM_LIMITS.termsMin} characters for rental terms.`;
  } else if (rentalTerms.length > EQUIPMENT_FORM_LIMITS.termsMax) {
    errors.rentalTerms = `Rental terms cannot exceed ${EQUIPMENT_FORM_LIMITS.termsMax} characters.`;
  }

  return errors;
}

/**
 * Construct a strict equipment creation payload omitting status or ownerId
 * so the backend enforces Pending status and owner identity from JWT/session.
 */
export function buildCreateEquipmentPayload(values = {}) {
  return {
    name: String(values.name || "").trim(),
    description: String(values.description || "").trim(),
    category: String(values.category || "").trim(),
    location: String(values.location || "").trim(),
    rentalPrice: Number(values.rentalPrice),
    rentalType: String(values.rentalType || "").trim(),
    availableQuantity: Math.floor(Number(values.availableQuantity)),
    condition: String(values.condition || "").trim(),
    brand: String(values.brand || "").trim(),
    model: String(values.model || "").trim(),
    image: String(values.image || "").trim(),
    rentalTerms: String(values.rentalTerms || "").trim(),
  };
}

export function buildUpdateEquipmentPayload(values = {}) {
  return buildCreateEquipmentPayload(values);
}

function normalizeOwnerStatusFilter(rawStatus) {
  const clean = String(rawStatus || "").trim().toLowerCase();
  if (clean === "pending") return "Pending";
  if (clean === "approved") return "Approved";
  if (clean === "rejected") return "Rejected";
  return "all";
}

function normalizeOwnerCategoryFilter(rawCategory) {
  const clean = String(rawCategory || "").trim();
  if (!clean || clean.toLowerCase() === "all") return "all";
  const match = ALLOWED_EQUIPMENT_CATEGORIES.find(
    (cat) => cat.toLowerCase() === clean.toLowerCase()
  );
  return match || "all";
}

function normalizeOwnerSortOption(rawSort) {
  const clean = String(rawSort || "").trim();
  const match = OWNER_EQUIPMENT_SORT_OPTIONS.find((opt) => opt.value === clean);
  return match ? match.value : "newest";
}

export function parseOwnerEquipmentFiltersFromParams(searchParams) {
  const getParam = (key) =>
    typeof searchParams?.get === "function"
      ? searchParams.get(key)
      : searchParams?.[key];

  const rawPage = Number(getParam("page"));

  return {
    search: String(getParam("search") || "").trim(),
    category: normalizeOwnerCategoryFilter(getParam("category")),
    status: normalizeOwnerStatusFilter(getParam("status")),
    sort: normalizeOwnerSortOption(getParam("sort")),
    page: Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1,
    limit: DEFAULT_OWNER_EQUIPMENT_LIMIT,
  };
}

export function buildOwnerEquipmentQueryString(filters = {}) {
  const params = new URLSearchParams();

  const search = String(filters.search || "").trim();
  if (search) params.set("search", search);

  const category = normalizeOwnerCategoryFilter(filters.category);
  if (category !== "all") params.set("category", category);

  const status = normalizeOwnerStatusFilter(filters.status);
  if (status !== "all") params.set("status", status);

  const sort = normalizeOwnerSortOption(filters.sort);
  if (sort !== "newest") params.set("sort", sort);

  const page = Number(filters.page);
  if (Number.isFinite(page) && page > 1) {
    params.set("page", String(Math.floor(page)));
  }

  return params.toString();
}

export function normalizeOwnerEquipmentItem(raw) {
  if (!raw || typeof raw !== "object") return null;

  const id = raw._id || raw.id || "";
  if (!id && !raw.name) return null;

  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.filter(Boolean)
      : raw.image
        ? [raw.image]
        : [];

  const availableQty = toOptionalNonNegativeNumber(raw.availableQuantity);
  const statusBadge = getApprovalStatusBadge(raw.status || raw.approvalStatus || "Pending");
  const ownerObj =
    raw.owner && typeof raw.owner === "object"
      ? {
          _id: raw.owner._id ? String(raw.owner._id) : "",
          name: String(raw.owner.name || ""),
          email: String(raw.owner.email || ""),
          image: String(raw.owner.image || raw.owner.photoURL || ""),
        }
      : null;

  return {
    _id: String(id),
    name: String(raw.name || "Untitled Equipment"),
    description: String(raw.description || ""),
    category: String(raw.category || ""),
    location: String(raw.location || ""),
    rentalPrice: toOptionalNonNegativeNumber(raw.rentalPrice),
    rentalType: String(raw.rentalType || "Daily"),
    availableQuantity: availableQty !== null ? Math.floor(availableQty) : 0,
    condition: String(raw.condition || ""),
    brand: String(raw.brand || ""),
    model: String(raw.model || ""),
    image: String(raw.image || images[0] || "/images/hero-equipment.jpg"),
    images,
    rentalTerms: String(raw.rentalTerms || raw.terms || ""),
    status: statusBadge.label,
    rejectionReason: String(
      raw.rejectionReason || raw.adminNote || raw.reviewNote || ""
    ).trim(),
    owner: ownerObj,
    availabilityStatus:
      raw.availabilityStatus ||
      (availableQty !== null && availableQty > 0 ? "Available" : "Unavailable"),
    createdAt: raw.createdAt || "",
    updatedAt: raw.updatedAt || "",
  };
}

export function mapEquipmentToFormValues(item) {
  if (!item || typeof item !== "object") {
    return { ...INITIAL_EQUIPMENT_FORM_VALUES };
  }

  return {
    name: String(item.name || ""),
    description: String(item.description || ""),
    category: ALLOWED_EQUIPMENT_CATEGORIES.includes(item.category)
      ? item.category
      : "",
    location: String(item.location || ""),
    rentalPrice:
      item.rentalPrice !== null && item.rentalPrice !== undefined
        ? String(item.rentalPrice)
        : "",
    rentalType: ALLOWED_RENTAL_TYPES.includes(item.rentalType)
      ? item.rentalType
      : "Daily",
    availableQuantity:
      item.availableQuantity !== null && item.availableQuantity !== undefined
        ? String(Math.max(1, Math.floor(Number(item.availableQuantity) || 1)))
        : "1",
    condition: String(item.condition || ""),
    brand: String(item.brand || ""),
    model: String(item.model || ""),
    image:
      typeof item.image === "string" && /^https?:\/\//i.test(item.image.trim())
        ? item.image.trim()
        : "",
    rentalTerms: String(item.rentalTerms || ""),
  };
}

export function computeOwnerEquipmentStats(
  items = [],
  backendSummary = null,
  paginationTotal = null
) {
  if (backendSummary && typeof backendSummary === "object") {
    const total = toOptionalNonNegativeNumber(
      backendSummary.totalEquipment ?? backendSummary.total
    );
    const pending = toOptionalNonNegativeNumber(
      backendSummary.pending ?? backendSummary.pendingCount
    );
    const approved = toOptionalNonNegativeNumber(
      backendSummary.approved ?? backendSummary.approvedCount
    );
    const rejected = toOptionalNonNegativeNumber(
      backendSummary.rejected ?? backendSummary.rejectedCount
    );

    if (
      total !== null &&
      pending !== null &&
      approved !== null &&
      rejected !== null
    ) {
      return {
        total: Math.floor(total),
        pending: Math.floor(pending),
        approved: Math.floor(approved),
        rejected: Math.floor(rejected),
      };
    }
  }

  const safeList = Array.isArray(items) ? items : [];
  let pending = 0;
  let approved = 0;
  let rejected = 0;

  for (const item of safeList) {
    const normalizedStatus = String(item?.status || "")
      .trim()
      .toLowerCase();
    if (normalizedStatus === "pending") pending += 1;
    else if (normalizedStatus === "approved") approved += 1;
    else if (normalizedStatus === "rejected") rejected += 1;
  }

  return {
    total:
      typeof paginationTotal === "number" && paginationTotal >= safeList.length
        ? Math.floor(paginationTotal)
        : safeList.length,
    pending,
    approved,
    rejected,
  };
}

export const OWNER_PERIOD_OPTIONS = [
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last 12 Months", value: "12m" },
];

export const DEFAULT_OWNER_PERIOD = "6m";

export const DEFAULT_OWNER_EQUIPMENT_LIMIT = 10;

export const OWNER_EQUIPMENT_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

export const OWNER_EQUIPMENT_SORT_OPTIONS = [
  { label: "Recently Added", value: "newest" },
  { label: "Name: A to Z", value: "name_asc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

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

export {
  formatBookingDuration,
  formatDisplayDate,
  getBookingStatusBadge,
  getPaymentStatusBadge,
  PAYMENT_FILTER_OPTIONS,
  RENTAL_FILTER_OPTIONS,
};

export const DEFAULT_OWNER_RENTALS_LIMIT = 10;

export const OWNER_RENTAL_SORT_OPTIONS = [
  { label: "Newest Bookings", value: "newest" },
  { label: "Oldest Bookings", value: "oldest" },
  { label: "Booking Amount: Low to High", value: "amount_asc" },
  { label: "Booking Amount: High to Low", value: "amount_desc" },
  { label: "Rental Start Date", value: "start_date" },
];

function normalizeOwnerRentalFilterOption(rawValue, optionsList) {
  const candidate = String(rawValue || "").trim();
  if (!candidate || candidate.toLowerCase() === "all") return "all";
  const match = optionsList.find(
    (opt) => opt.value.toLowerCase() === candidate.toLowerCase()
  );
  return match ? match.value : "all";
}

function normalizeOwnerRentalSortOption(rawSort) {
  const candidate = String(rawSort || "").trim();
  const match = OWNER_RENTAL_SORT_OPTIONS.find(
    (opt) => opt.value === candidate
  );
  return match ? match.value : "newest";
}

export function parseOwnerRentalsFiltersFromParams(searchParams) {
  const getParam = (key) =>
    typeof searchParams?.get === "function"
      ? searchParams.get(key)
      : searchParams?.[key];

  const rawPage = Number(getParam("page"));
  const bookingParam = getParam("bookingStatus") || getParam("status");
  const paymentParam = getParam("paymentStatus");
  const equipmentParam = String(getParam("equipmentId") || "").trim();

  return {
    search: String(getParam("search") || "").trim(),
    bookingStatus: normalizeOwnerRentalFilterOption(
      bookingParam,
      RENTAL_FILTER_OPTIONS
    ),
    paymentStatus: normalizeOwnerRentalFilterOption(
      paymentParam,
      PAYMENT_FILTER_OPTIONS
    ),
    equipmentId:
      equipmentParam && equipmentParam.toLowerCase() !== "all"
        ? equipmentParam
        : "all",
    sort: normalizeOwnerRentalSortOption(getParam("sort")),
    page: Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1,
    limit: DEFAULT_OWNER_RENTALS_LIMIT,
  };
}

export function buildOwnerRentalsQueryString(filters = {}) {
  const params = new URLSearchParams();

  const search = String(filters.search || "").trim();
  if (search) params.set("search", search);

  const bookingStatus = normalizeOwnerRentalFilterOption(
    filters.bookingStatus,
    RENTAL_FILTER_OPTIONS
  );
  if (bookingStatus !== "all") {
    params.set("bookingStatus", bookingStatus);
  }

  const paymentStatus = normalizeOwnerRentalFilterOption(
    filters.paymentStatus,
    PAYMENT_FILTER_OPTIONS
  );
  if (paymentStatus !== "all") {
    params.set("paymentStatus", paymentStatus);
  }

  const equipmentId = String(filters.equipmentId || "").trim();
  if (equipmentId && equipmentId.toLowerCase() !== "all") {
    params.set("equipmentId", equipmentId);
  }

  const sort = normalizeOwnerRentalSortOption(filters.sort);
  if (sort !== "newest") {
    params.set("sort", sort);
  }

  const page = Number(filters.page);
  if (Number.isFinite(page) && page > 1) {
    params.set("page", String(Math.floor(page)));
  }

  return params.toString();
}

/**
 * Normalize a booking record from GET /api/owner/rentals (or /:id) while preserving
 * exact backend bookingStatus/paymentStatus values and omitting private fields.
 */
export function normalizeOwnerRental(raw) {
  if (!raw || typeof raw !== "object") return null;

  const equipmentObj =
    raw.equipment && typeof raw.equipment === "object" ? raw.equipment : {};
  const customerObj =
    raw.customer && typeof raw.customer === "object"
      ? raw.customer
      : raw.user && typeof raw.user === "object"
        ? raw.user
        : {};

  const equipmentId =
    equipmentObj._id || equipmentObj.id || raw.equipmentId || "";
  const equipmentName = String(
    equipmentObj.name || raw.equipmentName || "Equipment Item"
  ).trim();
  const equipmentImage = String(
    equipmentObj.image ||
      (Array.isArray(equipmentObj.images) ? equipmentObj.images[0] : "") ||
      raw.equipmentImage ||
      "/images/hero-equipment.jpg"
  );
  const equipmentCategory = String(
    equipmentObj.category || raw.equipmentCategory || ""
  ).trim();
  const equipmentLocation = String(
    equipmentObj.location || raw.equipmentLocation || ""
  ).trim();

  const customerName = String(
    customerObj.name || raw.customerName || "Verified Customer"
  ).trim();
  const customerEmail = String(
    customerObj.email || raw.customerEmail || ""
  ).trim();
  const customerPhoto = String(
    customerObj.photoURL ||
      customerObj.image ||
      raw.customerPhotoURL ||
      raw.customerImage ||
      ""
  ).trim();

  const startDate = raw.startDate || raw.rentalStartDate || "";
  const endDate = raw.endDate || raw.rentalEndDate || "";
  const createdAt = raw.createdAt || raw.bookingDate || startDate || "";

  const totalAmount = toNonNegativeNumber(
    raw.totalAmount ?? raw.bookingAmount ?? raw.amount,
    0
  );
  const rentalPrice = toOptionalNonNegativeNumber(
    raw.rentalPrice ?? raw.unitPrice ?? equipmentObj.rentalPrice
  );
  const rawQty = toOptionalNonNegativeNumber(raw.quantity ?? raw.requiredQuantity);
  const quantity = rawQty !== null && rawQty > 0 ? Math.floor(rawQty) : null;

  const rawDuration = toOptionalNonNegativeNumber(
    raw.durationDays ?? raw.duration ?? raw.totalDays
  );
  const durationLabel = formatBookingDuration(startDate, endDate, rawDuration);

  return {
    _id: String(raw._id || raw.id || ""),
    bookingReference: String(
      raw.bookingReference ||
        raw.referenceId ||
        raw.bookingCode ||
        raw._id ||
        raw.id ||
        ""
    ),
    customer: {
      name: customerName || "Verified Customer",
      email: customerEmail,
      photoURL: customerPhoto,
    },
    equipment: {
      _id: equipmentId ? String(equipmentId) : "",
      name: equipmentName || "Equipment Item",
      image: equipmentImage,
      category: equipmentCategory,
      location: equipmentLocation,
    },
    startDate,
    endDate,
    durationDays: rawDuration !== null && rawDuration > 0 ? Math.floor(rawDuration) : null,
    durationLabel,
    createdAt,
    quantity,
    rentalType: String(raw.rentalType || equipmentObj.rentalType || ""),
    rentalPrice,
    totalAmount,
    paymentStatus: String(raw.paymentStatus || "Pending"),
    bookingStatus: String(raw.bookingStatus || raw.status || "Pending"),
    transactionId: String(
      raw.transactionId || raw.paymentIntentId || raw.stripeSessionId || ""
    ),
    paidAt: raw.paidAt || raw.paymentDate || "",
    contactNumber: String(
      raw.contactNumber || raw.phone || customerObj.phone || ""
    ),
    deliveryAddress: String(raw.deliveryAddress || ""),
    additionalNotes: String(raw.additionalNotes || raw.notes || ""),
  };
}

/**
 * Compute owner rental KPI stats strictly from backend summary totals when supplied,
 * or directly from backend bookingStatus values when the loaded dataset is complete.
 * Never infers booking status from startDate/endDate on the frontend.
 */
export function computeOwnerRentalStats(
  items = [],
  backendSummary = null,
  paginationTotal = null,
  hasActiveFilters = false
) {
  if (backendSummary && typeof backendSummary === "object") {
    const totalBookings = toOptionalNonNegativeNumber(
      backendSummary.totalBookings ?? backendSummary.total
    );
    const pendingBookings = toOptionalNonNegativeNumber(
      backendSummary.pendingBookings ??
        backendSummary.pending ??
        backendSummary.pendingCount
    );
    const activeRentals = toOptionalNonNegativeNumber(
      backendSummary.activeRentals ??
        backendSummary.active ??
        backendSummary.activeCount
    );
    const completedRentals = toOptionalNonNegativeNumber(
      backendSummary.completedRentals ??
        backendSummary.completed ??
        backendSummary.completedCount
    );

    if (
      totalBookings !== null &&
      pendingBookings !== null &&
      activeRentals !== null &&
      completedRentals !== null
    ) {
      return {
        totalBookings: Math.floor(totalBookings),
        pendingBookings: Math.floor(pendingBookings),
        activeRentals: Math.floor(activeRentals),
        completedRentals: Math.floor(completedRentals),
        isPartialSummary: false,
      };
    }
  }

  const safeList = Array.isArray(items) ? items : [];
  let pendingBookings = 0;
  let activeRentals = 0;
  let completedRentals = 0;

  for (const rental of safeList) {
    const status = String(rental?.bookingStatus || "")
      .trim()
      .toLowerCase();
    if (status === "pending") pendingBookings += 1;
    else if (status === "active") activeRentals += 1;
    else if (status === "completed") completedRentals += 1;
  }

  const resolvedTotal =
    typeof paginationTotal === "number" && paginationTotal >= safeList.length
      ? Math.floor(paginationTotal)
      : safeList.length;

  const isPartialSummary =
    Boolean(hasActiveFilters) || resolvedTotal > safeList.length;

  return {
    totalBookings: resolvedTotal,
    pendingBookings,
    activeRentals,
    completedRentals,
    isPartialSummary: safeList.length > 0 && isPartialSummary,
  };
}
