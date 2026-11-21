import { ApiError, apiRequest } from "@/lib/apiClient";
import { normalizeCustomerRental } from "@/lib/customerUtils";
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
 * Fetch the authenticated customer's rental bookings:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/bookings/my
 */
export async function getMyRentals({
  status = "",
  page = 1,
  limit = 10,
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
  if (status && status !== "all") {
    params.set("status", status);
  }
  if (page && Number(page) > 1) {
    params.set("page", String(page));
  }
  if (limit && Number(limit) > 0) {
    params.set("limit", String(limit));
  }

  const queryString = params.toString();
  const path = queryString ? `/api/bookings/my?${queryString}` : "/api/bookings/my";

  const payload = await apiRequest(path, {
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
  const rawPagination = payload?.pagination || payload?.meta || {};
  const total =
    typeof rawPagination.total === "number"
      ? rawPagination.total
      : items.length;
  const totalPages =
    typeof rawPagination.totalPages === "number"
      ? rawPagination.totalPages
      : Math.max(1, Math.ceil(total / (limit || 10)));

  return {
    items,
    pagination: {
      page: Number(rawPagination.page || page || 1),
      limit: Number(rawPagination.limit || limit || 10),
      total,
      totalPages,
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
