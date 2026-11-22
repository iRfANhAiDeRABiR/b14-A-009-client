import { ApiError, apiRequest } from "@/lib/apiClient";
import {
  DEFAULT_BOOKINGS_LIMIT,
  normalizeCustomerRental,
} from "@/lib/customerUtils";
import {
  computeOwnerRentalStats,
  DEFAULT_OWNER_RENTALS_LIMIT,
  normalizeOwnerRental,
} from "@/lib/ownerUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function createAuthRequiredError(actionLabel) {
  return new ApiError(
    `Authentication required to ${actionLabel}. Please sign in before continuing.`,
    { status: 401, code: "UNAUTHORIZED", requiresAuth: true }
  );
}

function createBackendUnavailableError(actionLabel) {
  return new ApiError(
    `Unable to ${actionLabel}: the booking API server is not configured or unreachable yet.`,
    { status: 503, code: "SERVICE_UNAVAILABLE" }
  );
}

/**
 * Fetch the authenticated customer's rental bookings with server-side filters & pagination:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/bookings/my?page=1&limit=10&bookingStatus=...&paymentStatus=...&search=...
 */
export async function getMyBookings({
  bookingStatus = "all",
  paymentStatus = "all",
  status = "",
  search = "",
  page = 1,
  limit = DEFAULT_BOOKINGS_LIMIT,
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("view your rental bookings");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("load your rental bookings");
  }

  const params = new URLSearchParams();
  const safePage = Number.isFinite(Number(page)) && Number(page) >= 1 ? Math.floor(Number(page)) : 1;
  const safeLimit = Number.isFinite(Number(limit)) && Number(limit) >= 1 ? Math.floor(Number(limit)) : DEFAULT_BOOKINGS_LIMIT;

  params.set("page", String(safePage));
  params.set("limit", String(safeLimit));

  const resolvedBookingStatus =
    bookingStatus && bookingStatus !== "all"
      ? bookingStatus
      : status && status !== "all"
        ? status
        : "";
  if (resolvedBookingStatus) {
    params.set("bookingStatus", resolvedBookingStatus);
  }

  if (paymentStatus && paymentStatus !== "all") {
    params.set("paymentStatus", paymentStatus);
  }

  const trimmedSearch = String(search || "").trim();
  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  }

  const payload = await apiRequest(`/api/bookings/my?${params.toString()}`, {
    method: "GET",
    token: activeToken,
    authRequired: true,
  });

  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.bookings)
        ? payload.bookings
        : [];

  const items = rawList.map(normalizeCustomerRental).filter(Boolean);
  const rawPagination = payload?.pagination || payload?.meta || null;

  const hasServerPagination = Boolean(
    rawPagination &&
      (typeof rawPagination.totalItems === "number" ||
        typeof rawPagination.total === "number" ||
        typeof rawPagination.totalPages === "number")
  );

  const totalItems = hasServerPagination
    ? Number(rawPagination.totalItems ?? rawPagination.total ?? items.length)
    : items.length;
  const resolvedLimit = Number(rawPagination?.limit || safeLimit);
  const currentPage = Number(
    rawPagination?.currentPage ?? rawPagination?.page ?? safePage
  );
  const totalPages = hasServerPagination
    ? Math.max(
        totalItems > 0 ? 1 : 0,
        Number(
          rawPagination.totalPages ??
            Math.ceil(totalItems / Math.max(1, resolvedLimit))
        )
      )
    : items.length > 0
      ? 1
      : 0;

  return {
    items,
    pagination: {
      currentPage,
      page: currentPage,
      limit: resolvedLimit,
      totalItems,
      total: totalItems,
      totalPages,
      serverPaginationSupported: hasServerPagination,
    },
    monthlyAnalytics: Array.isArray(payload?.monthlyAnalytics)
      ? payload.monthlyAnalytics
      : null,
    summary:
      payload?.summary && typeof payload.summary === "object"
        ? payload.summary
        : null,
  };
}

/**
 * Backwards-compatible alias consumed by CustomerOverview / customerService.
 */
export async function getMyRentals(options = {}) {
  return getMyBookings(options);
}

/**
 * Fetch detailed booking record belonging to the authenticated user:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/bookings/:bookingId
 */
export async function getBookingDetails(bookingId, { token = null } = {}) {
  if (!bookingId) {
    throw new ApiError("Booking ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("inspect booking details");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("load booking details");
  }

  const payload = await apiRequest(
    `/api/bookings/${encodeURIComponent(bookingId)}`,
    {
      method: "GET",
      token: activeToken,
      authRequired: true,
    }
  );

  const record =
    payload?.data && typeof payload.data === "object"
      ? payload.data
      : payload?.booking && typeof payload.booking === "object"
        ? payload.booking
        : payload;

  return normalizeCustomerRental(record);
}

/**
 * Validate requested dates and quantity against overlapping MongoDB bookings:
 * POST {NEXT_PUBLIC_API_BASE_URL}/api/bookings/check-availability
 */
export async function checkBookingAvailability({
  equipmentId,
  startDate,
  endDate,
  quantity,
  token,
}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("verify live equipment availability");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("verify live availability");
  }

  return apiRequest("/api/bookings/check-availability", {
    method: "POST",
    body: {
      equipmentId,
      startDate,
      endDate,
      quantity,
    },
    token: activeToken,
    authRequired: true,
  });
}

/**
 * Create a booking record on the Express backend and prepare Stripe Checkout handoff:
 * POST {NEXT_PUBLIC_API_BASE_URL}/api/bookings
 */
export async function createBooking({
  equipmentId,
  startDate,
  endDate,
  quantity,
  contactNumber,
  deliveryAddress,
  additionalNotes = "",
  token,
}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("create a rental booking");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("submit booking");
  }

  return apiRequest("/api/bookings", {
    method: "POST",
    body: {
      equipmentId,
      startDate,
      endDate,
      quantity,
      contactNumber,
      deliveryAddress,
      additionalNotes,
    },
    token: activeToken,
    authRequired: true,
  });
}

/**
 * Fetch rental bookings associated with the authenticated owner's equipment:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/owner/rentals
 * Never sends ownerId as proof of authorization; backend identifies owner via verified JWT.
 */
export async function getOwnerRentals({
  search = "",
  bookingStatus = "all",
  paymentStatus = "all",
  equipmentId = "all",
  sort = "newest",
  page = 1,
  limit = DEFAULT_OWNER_RENTALS_LIMIT,
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("view rentals for your equipment");
  }
  if (!API_BASE_URL) {
    throw new ApiError(
      "Owner rentals endpoint (GET /api/owner/rentals) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured yet.",
      { status: 503, code: "SERVICE_UNAVAILABLE" }
    );
  }

  const params = new URLSearchParams();
  const safePage =
    Number.isFinite(Number(page)) && Number(page) >= 1
      ? Math.floor(Number(page))
      : 1;
  const safeLimit =
    Number.isFinite(Number(limit)) && Number(limit) >= 1
      ? Math.floor(Number(limit))
      : DEFAULT_OWNER_RENTALS_LIMIT;

  params.set("page", String(safePage));
  params.set("limit", String(safeLimit));

  const trimmedSearch = String(search || "").trim();
  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  }

  if (bookingStatus && bookingStatus !== "all") {
    params.set("bookingStatus", bookingStatus);
  }

  if (paymentStatus && paymentStatus !== "all") {
    params.set("paymentStatus", paymentStatus);
  }

  const cleanEquipmentId = String(equipmentId || "").trim();
  if (cleanEquipmentId && cleanEquipmentId.toLowerCase() !== "all") {
    params.set("equipmentId", cleanEquipmentId);
  }

  if (sort) {
    params.set("sort", String(sort).trim());
  }

  const payload = await apiRequest(`/api/owner/rentals?${params.toString()}`, {
    method: "GET",
    token: activeToken,
    authRequired: true,
  });

  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.rentals)
        ? payload.rentals
        : Array.isArray(payload?.bookings)
          ? payload.bookings
          : [];

  const items = rawList.map(normalizeOwnerRental).filter(Boolean);
  const rawPagination = payload?.pagination || payload?.meta || null;

  const hasServerPagination = Boolean(
    rawPagination &&
      (typeof rawPagination.totalItems === "number" ||
        typeof rawPagination.total === "number" ||
        typeof rawPagination.totalPages === "number")
  );

  const totalItems = hasServerPagination
    ? Number(rawPagination.totalItems ?? rawPagination.total ?? items.length)
    : items.length;
  const resolvedLimit = Number(rawPagination?.limit || safeLimit);
  const currentPage = Number(
    rawPagination?.currentPage ?? rawPagination?.page ?? safePage
  );
  const totalPages = hasServerPagination
    ? Math.max(
        totalItems > 0 ? 1 : 0,
        Number(
          rawPagination.totalPages ??
            Math.ceil(totalItems / Math.max(1, resolvedLimit))
        )
      )
    : items.length > 0
      ? 1
      : 0;

  const summary =
    payload?.summary && typeof payload.summary === "object"
      ? payload.summary
      : payload?.stats && typeof payload.stats === "object"
        ? payload.stats
        : null;

  const hasActiveFilters = Boolean(
    trimmedSearch ||
      (bookingStatus && bookingStatus !== "all") ||
      (paymentStatus && paymentStatus !== "all") ||
      (cleanEquipmentId && cleanEquipmentId.toLowerCase() !== "all")
  );

  return {
    items,
    stats: computeOwnerRentalStats(
      items,
      summary,
      totalItems,
      hasActiveFilters
    ),
    pagination: {
      currentPage,
      page: currentPage,
      limit: resolvedLimit,
      totalItems,
      total: totalItems,
      totalPages,
      serverPaginationSupported: hasServerPagination,
    },
  };
}

/**
 * Fetch full details for a single booking belonging to the authenticated owner:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/owner/rentals/:bookingId
 */
export async function getOwnerRentalById(bookingId, { token = null } = {}) {
  if (!bookingId) {
    throw new ApiError("Booking ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("inspect owner rental details");
  }
  if (!API_BASE_URL) {
    throw new ApiError(
      "Owner rental detail endpoint (GET /api/owner/rentals/:bookingId) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured yet.",
      { status: 503, code: "SERVICE_UNAVAILABLE" }
    );
  }

  const payload = await apiRequest(
    `/api/owner/rentals/${encodeURIComponent(bookingId)}`,
    {
      method: "GET",
      token: activeToken,
      authRequired: true,
    }
  );

  const record =
    payload?.data && typeof payload.data === "object"
      ? payload.data
      : payload?.rental && typeof payload.rental === "object"
        ? payload.rental
        : payload?.booking && typeof payload.booking === "object"
          ? payload.booking
          : payload;

  return normalizeOwnerRental(record);
}
