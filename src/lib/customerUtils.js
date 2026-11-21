import { validateImageUrl } from "./authValidation.js";
import { calculateInclusiveDays } from "./rentalPricing.js";

const PAYMENT_STATUS_VARIANTS = {
  paid: "success",
  succeeded: "success",
  pending: "warning",
  unpaid: "warning",
  processing: "warning",
  failed: "danger",
  cancelled: "danger",
  refunded: "neutral",
};

const BOOKING_STATUS_VARIANTS = {
  pending: "warning",
  confirmed: "primary",
  active: "success",
  completed: "success",
  cancelled: "danger",
  canceled: "danger",
};

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const RENTAL_FILTER_OPTIONS = [
  { label: "All Bookings", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Active", value: "Active" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export const PAYMENT_FILTER_OPTIONS = [
  { label: "All Payments", value: "all" },
  { label: "Paid", value: "Paid" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

export const DEFAULT_BOOKINGS_LIMIT = 10;

export const FAVORITE_SORT_OPTIONS = [
  { label: "Recently Added", value: "recent" },
  { label: "Rental Price: Low to High", value: "price_asc" },
  { label: "Rental Price: High to Low", value: "price_desc" },
];

export function formatDisplayDate(rawDate) {
  if (!rawDate) return "—";
  const str = String(rawDate).trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);

  let dateObj;
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const monthIndex = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);
    dateObj = new Date(Date.UTC(year, monthIndex, day));
    if (
      dateObj.getUTCFullYear() !== year ||
      dateObj.getUTCMonth() !== monthIndex ||
      dateObj.getUTCDate() !== day
    ) {
      return "—";
    }
    return `${MONTHS_SHORT[monthIndex]} ${day}, ${year}`;
  }

  dateObj = new Date(str);
  if (Number.isNaN(dateObj.getTime())) return "—";
  return `${MONTHS_SHORT[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}, ${dateObj.getUTCFullYear()}`;
}

export function formatBookingDuration(startDate, endDate, fallbackDays = null) {
  const days = calculateInclusiveDays(startDate, endDate);
  const resolved =
    days > 0
      ? days
      : typeof fallbackDays === "number" && fallbackDays > 0
        ? Math.floor(fallbackDays)
        : 0;

  if (!resolved) return "—";
  return `${resolved} ${resolved === 1 ? "day" : "days"}`;
}

export function getPaymentStatusBadge(status) {
  const raw = String(status || "Pending").trim();
  const variant = PAYMENT_STATUS_VARIANTS[raw.toLowerCase()] || "neutral";
  return { label: raw || "Pending", variant };
}

export function getBookingStatusBadge(status) {
  const raw = String(status || "Pending").trim();
  const variant = BOOKING_STATUS_VARIANTS[raw.toLowerCase()] || "neutral";
  return { label: raw || "Pending", variant };
}

function normalizeOptionalFilterOption(rawValue, optionsList) {
  const candidate = String(rawValue || "").trim();
  if (!candidate || candidate.toLowerCase() === "all") return "all";
  const match = optionsList.find(
    (opt) => opt.value.toLowerCase() === candidate.toLowerCase()
  );
  return match ? match.value : "all";
}

export function parseBookingsFiltersFromParams(searchParams) {
  const getParam = (key) =>
    typeof searchParams?.get === "function"
      ? searchParams.get(key)
      : searchParams?.[key];

  const rawPage = Number(getParam("page"));
  const bookingParam = getParam("bookingStatus") || getParam("status");
  const paymentParam = getParam("paymentStatus");

  return {
    search: String(getParam("search") || "").trim(),
    bookingStatus: normalizeOptionalFilterOption(
      bookingParam,
      RENTAL_FILTER_OPTIONS
    ),
    paymentStatus: normalizeOptionalFilterOption(
      paymentParam,
      PAYMENT_FILTER_OPTIONS
    ),
    page: Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1,
    limit: DEFAULT_BOOKINGS_LIMIT,
  };
}

export function buildBookingsQueryString(filters = {}) {
  const params = new URLSearchParams();

  const search = String(filters.search || "").trim();
  if (search) params.set("search", search);

  const bookingStatus = normalizeOptionalFilterOption(
    filters.bookingStatus,
    RENTAL_FILTER_OPTIONS
  );
  if (bookingStatus !== "all") {
    params.set("bookingStatus", bookingStatus);
  }

  const paymentStatus = normalizeOptionalFilterOption(
    filters.paymentStatus,
    PAYMENT_FILTER_OPTIONS
  );
  if (paymentStatus !== "all") {
    params.set("paymentStatus", paymentStatus);
  }

  const page = Number(filters.page);
  if (Number.isFinite(page) && page > 1) {
    params.set("page", String(Math.floor(page)));
  }

  return params.toString();
}

export function normalizeCustomerRental(raw) {
  if (!raw || typeof raw !== "object") return null;

  const equipmentObj =
    raw.equipment && typeof raw.equipment === "object" ? raw.equipment : {};

  const equipmentId =
    equipmentObj._id || equipmentObj.id || raw.equipmentId || "";
  const equipmentName =
    equipmentObj.name || raw.equipmentName || "Equipment Item";
  const equipmentImage =
    equipmentObj.image ||
    (Array.isArray(equipmentObj.images) ? equipmentObj.images[0] : "") ||
    raw.equipmentImage ||
    "/images/hero-equipment.jpg";
  const equipmentCategory =
    equipmentObj.category || raw.equipmentCategory || "";

  const ownerObj =
    equipmentObj.owner && typeof equipmentObj.owner === "object"
      ? equipmentObj.owner
      : raw.owner && typeof raw.owner === "object"
        ? raw.owner
        : null;
  const ownerName =
    ownerObj?.name || equipmentObj.ownerName || raw.ownerName || "";

  const startDate = raw.startDate || raw.rentalStartDate || "";
  const endDate = raw.endDate || raw.rentalEndDate || "";
  const createdAt = raw.createdAt || raw.bookingDate || startDate || "";
  const totalAmount = Number(raw.totalAmount ?? raw.amount ?? 0);

  const rawUnitPrice =
    raw.rentalPrice ?? raw.unitPrice ?? equipmentObj.rentalPrice;
  const rentalPrice =
    rawUnitPrice !== undefined &&
    rawUnitPrice !== null &&
    Number.isFinite(Number(rawUnitPrice))
      ? Number(rawUnitPrice)
      : null;

  const rawQty = raw.quantity ?? raw.requiredQuantity;
  const quantity =
    rawQty !== undefined &&
    rawQty !== null &&
    Number.isFinite(Number(rawQty)) &&
    Number(rawQty) > 0
      ? Math.floor(Number(rawQty))
      : null;

  const rawDuration = raw.durationDays ?? raw.duration ?? raw.totalDays;
  const computedDays = calculateInclusiveDays(startDate, endDate);
  const durationDays =
    computedDays > 0
      ? computedDays
      : rawDuration !== undefined &&
          rawDuration !== null &&
          Number.isFinite(Number(rawDuration)) &&
          Number(rawDuration) > 0
        ? Math.floor(Number(rawDuration))
        : null;

  return {
    _id: String(raw._id || raw.id || ""),
    bookingReference: String(
      raw.bookingReference || raw.referenceId || raw.bookingCode || raw._id || raw.id || ""
    ),
    equipmentId: equipmentId ? String(equipmentId) : "",
    equipment: {
      _id: equipmentId ? String(equipmentId) : "",
      name: equipmentName,
      image: equipmentImage,
      category: equipmentCategory,
      ownerName,
    },
    startDate,
    endDate,
    durationDays,
    createdAt,
    quantity,
    rentalType: String(raw.rentalType || equipmentObj.rentalType || ""),
    rentalPrice,
    totalAmount: Number.isFinite(totalAmount) ? totalAmount : 0,
    paymentStatus: String(raw.paymentStatus || "Pending"),
    bookingStatus: String(raw.bookingStatus || raw.status || "Pending"),
    transactionId: String(
      raw.transactionId || raw.paymentIntentId || raw.stripeSessionId || ""
    ),
    paidAt: raw.paidAt || raw.paymentDate || "",
    contactNumber: String(raw.contactNumber || raw.phone || ""),
    deliveryAddress: String(raw.deliveryAddress || ""),
    additionalNotes: String(raw.additionalNotes || raw.notes || ""),
  };
}

export function normalizeFavoriteEquipment(raw) {
  if (!raw || typeof raw !== "object") return null;

  const hasNestedEquipment = Object.prototype.hasOwnProperty.call(
    raw,
    "equipment"
  );
  const nestedEquipment =
    hasNestedEquipment && raw.equipment && typeof raw.equipment === "object"
      ? raw.equipment
      : null;

  // Handle deleted or orphaned favorite records where backend populated equipment as null/deleted.
  const isExplicitlyDeleted = Boolean(
    raw.isDeleted ||
      raw.equipmentDeleted ||
      (hasNestedEquipment && raw.equipment === null)
  );

  const item = nestedEquipment || raw;
  const equipmentId =
    nestedEquipment?._id ||
    nestedEquipment?.id ||
    raw.equipmentId ||
    item._id ||
    item.id ||
    "";

  if (!equipmentId) return null;

  const hasEquipmentName = Boolean(
    typeof item.name === "string" && item.name.trim()
  );
  const isDeletedRecord = isExplicitlyDeleted || !hasEquipmentName;

  const approvalStatus = String(item.status || "")
    .trim()
    .toLowerCase();
  const hasExplicitNonApprovedStatus = Boolean(
    approvalStatus && approvalStatus !== "approved"
  );

  const availableQuantity =
    typeof item.availableQuantity === "number"
      ? item.availableQuantity
      : item.availableQuantity !== undefined && item.availableQuantity !== null
        ? Number(item.availableQuantity)
        : NaN;

  const hasNumericStock = Number.isFinite(availableQuantity);
  const rawAvailability = String(item.availabilityStatus || "").trim();
  const normalizedAvailability = rawAvailability.toLowerCase();

  let availabilityStatus = "Available";
  let availabilityVariant = "success";
  let isRentable = true;

  if (isDeletedRecord) {
    availabilityStatus = "Unavailable (Removed)";
    availabilityVariant = "neutral";
    isRentable = false;
  } else if (hasExplicitNonApprovedStatus) {
    availabilityStatus = "Unavailable";
    availabilityVariant = "warning";
    isRentable = false;
  } else if (hasNumericStock && availableQuantity <= 0) {
    availabilityStatus = "Unavailable";
    availabilityVariant = "warning";
    isRentable = false;
  } else if (normalizedAvailability.includes("unavailable")) {
    availabilityStatus = rawAvailability || "Unavailable";
    availabilityVariant = "warning";
    isRentable = false;
  } else if (normalizedAvailability.includes("limited")) {
    availabilityStatus = rawAvailability || "Limited Stock";
    availabilityVariant = "warning";
    isRentable = true;
  } else if (rawAvailability) {
    availabilityStatus = rawAvailability;
    availabilityVariant = "success";
    isRentable = true;
  }

  return {
    favoriteId: String(raw._id || raw.id || equipmentId),
    equipmentId: String(equipmentId),
    name: hasEquipmentName ? item.name.trim() : "Equipment No Longer Listed",
    image:
      item.image ||
      (Array.isArray(item.images) ? item.images[0] : "") ||
      "/images/hero-equipment.jpg",
    category: item.category || (isDeletedRecord ? "Removed Listing" : "Equipment"),
    rentalPrice:
      item.rentalPrice !== undefined &&
      item.rentalPrice !== null &&
      Number.isFinite(Number(item.rentalPrice))
        ? Number(item.rentalPrice)
        : null,
    rentalType: item.rentalType || "",
    location: item.location || "",
    availableQuantity: hasNumericStock ? availableQuantity : null,
    approvalStatus,
    isDeletedRecord,
    isPubliclyApproved: !isDeletedRecord && !hasExplicitNonApprovedStatus,
    isRentable,
    availabilityStatus,
    availabilityVariant,
    addedAt: raw.createdAt || raw.addedAt || "",
  };
}

export function computeFavoriteStats(favorites = []) {
  const safeList = Array.isArray(favorites) ? favorites : [];
  const total = safeList.length;
  const available = safeList.filter((item) => Boolean(item?.isRentable)).length;
  const unavailable = total - available;

  return {
    total,
    available,
    unavailable,
  };
}

export function filterAndSortFavorites(
  favorites = [],
  { search = "", category = "all", sort = "recent" } = {}
) {
  const safeList = Array.isArray(favorites) ? [...favorites] : [];
  const searchLower = String(search || "").trim().toLowerCase();
  const categoryLower = String(category || "all").trim().toLowerCase();

  let filtered = safeList.filter((item) => {
    if (categoryLower && categoryLower !== "all") {
      if (String(item.category || "").trim().toLowerCase() !== categoryLower) {
        return false;
      }
    }

    if (searchLower) {
      const hay = `${item.name || ""} ${item.location || ""} ${
        item.category || ""
      }`.toLowerCase();
      if (!hay.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  if (sort === "price_asc") {
    filtered.sort(
      (a, b) => (Number(a.rentalPrice) || 0) - (Number(b.rentalPrice) || 0)
    );
  } else if (sort === "price_desc") {
    filtered.sort(
      (a, b) => (Number(b.rentalPrice) || 0) - (Number(a.rentalPrice) || 0)
    );
  } else if (sort === "recent") {
    filtered.sort((a, b) => {
      if (a.addedAt && b.addedAt) {
        return String(b.addedAt).localeCompare(String(a.addedAt));
      }
      return 0;
    });
  }

  return filtered;
}

export function computeCustomerStats(
  rentals = [],
  favoritesCount = 0,
  backendSummary = null
) {
  const safeRentals = Array.isArray(rentals) ? rentals : [];

  if (backendSummary && typeof backendSummary === "object") {
    const hasExplicitCounts =
      typeof backendSummary.totalRentals === "number" &&
      typeof backendSummary.activeRentals === "number" &&
      typeof backendSummary.completedRentals === "number";

    if (hasExplicitCounts) {
      return {
        totalRentals: backendSummary.totalRentals,
        activeRentals: backendSummary.activeRentals,
        completedRentals: backendSummary.completedRentals,
        favoriteCount:
          typeof backendSummary.favoriteCount === "number"
            ? backendSummary.favoriteCount
            : Math.max(0, Number(favoritesCount) || 0),
      };
    }
  }

  let activeRentals = 0;
  let completedRentals = 0;

  for (const rental of safeRentals) {
    const status = String(rental?.bookingStatus || "").trim().toLowerCase();
    if (status === "active") {
      activeRentals += 1;
    } else if (status === "completed") {
      completedRentals += 1;
    }
  }

  return {
    totalRentals: safeRentals.length,
    activeRentals,
    completedRentals,
    favoriteCount: Math.max(0, Number(favoritesCount) || 0),
  };
}

export function aggregateMonthlyRentals(
  rentals = [],
  backendMonthly = null,
  maxMonths = 6
) {
  if (Array.isArray(backendMonthly) && backendMonthly.length > 0) {
    return backendMonthly
      .map((entry) => ({
        monthKey: String(entry.monthKey || entry.month || ""),
        label: String(entry.label || entry.month || "Month"),
        bookingsCount: Number(entry.bookingsCount ?? entry.count ?? 0) || 0,
        totalAmount: Number(entry.totalAmount ?? entry.amount ?? 0) || 0,
      }))
      .slice(-maxMonths);
  }

  const safeRentals = Array.isArray(rentals) ? rentals : [];
  if (safeRentals.length === 0) return [];

  const buckets = new Map();

  for (const rental of safeRentals) {
    const rawDate = rental?.createdAt || rental?.startDate;
    if (!rawDate) continue;

    const match = /^(\d{4})-(\d{2})/.exec(String(rawDate).trim());
    let year;
    let monthIndex;

    if (match) {
      year = Number(match[1]);
      monthIndex = Number(match[2]) - 1;
    } else {
      const parsed = new Date(rawDate);
      if (Number.isNaN(parsed.getTime())) continue;
      year = parsed.getUTCFullYear();
      monthIndex = parsed.getUTCMonth();
    }

    if (monthIndex < 0 || monthIndex > 11) continue;

    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const existing = buckets.get(key) || {
      monthKey: key,
      label: `${MONTHS_SHORT[monthIndex]} ${year}`,
      bookingsCount: 0,
      totalAmount: 0,
    };

    existing.bookingsCount += 1;
    existing.totalAmount += Math.max(0, Number(rental?.totalAmount) || 0);
    buckets.set(key, existing);
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .slice(-maxMonths);
}

export function validateCustomerProfile({
  name = "",
  photoURL = "",
  phone = "",
  address = "",
} = {}) {
  const errors = {};

  const trimmedName = String(name || "").trim();
  if (!trimmedName) {
    errors.name = "Full name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  } else if (trimmedName.length > 80) {
    errors.name = "Full name cannot exceed 80 characters.";
  }

  const photoError = validateImageUrl(photoURL);
  if (photoError) {
    errors.photoURL = photoError;
  }

  const trimmedPhone = String(phone || "").trim();
  if (trimmedPhone) {
    const digitsOnly = trimmedPhone.replace(/\D/g, "");
    if (
      !/^\+?[0-9\s\-()]+$/.test(trimmedPhone) ||
      digitsOnly.length < 7 ||
      digitsOnly.length > 15
    ) {
      errors.phone =
        "Enter a valid phone number (7 to 15 digits, e.g., 01XXXXXXXXX).";
    }
  }

  const trimmedAddress = String(address || "").trim();
  if (trimmedAddress.length > 250) {
    errors.address = "Address cannot exceed 250 characters.";
  }

  return errors;
}

export function buildProfileUpdatePayload({
  name = "",
  photoURL = "",
  phone = "",
  address = "",
} = {}) {
  return {
    name: String(name || "").trim(),
    photoURL: String(photoURL || "").trim(),
    phone: String(phone || "").trim(),
    address: String(address || "").trim(),
  };
}
