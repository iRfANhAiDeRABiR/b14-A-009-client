import { ApiError, apiRequest } from "@/lib/apiClient";
import {
  DEFAULT_ADMIN_PAGE_LIMIT,
  extractPaginationMeta,
  normalizeAdminRental,
} from "@/lib/adminUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function createAuthRequiredError(actionLabel) {
  return new ApiError(
    `Authentication required to ${actionLabel}. Please sign in with an Administrator account.`,
    { status: 401, code: "UNAUTHORIZED", requiresAuth: true }
  );
}

function createBackendUnavailableError(endpointLabel) {
  return new ApiError(
    `Admin rentals endpoint (${endpointLabel}) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured yet.`,
    { status: 503, code: "SERVICE_UNAVAILABLE" }
  );
}

/**
 * Fetch platform-wide booking records for Admin monitoring:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/admin/rentals
 */
export async function getAdminRentals({
  search = "",
  bookingStatus = "all",
  paymentStatus = "all",
  sort = "newest",
  page = 1,
  limit = DEFAULT_ADMIN_PAGE_LIMIT,
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("view platform rental bookings");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("GET /api/admin/rentals");
  }

  const params = new URLSearchParams();
  const safePage =
    Number.isFinite(Number(page)) && Number(page) >= 1
      ? Math.floor(Number(page))
      : 1;
  const safeLimit =
    Number.isFinite(Number(limit)) && Number(limit) >= 1
      ? Math.floor(Number(limit))
      : DEFAULT_ADMIN_PAGE_LIMIT;

  params.set("page", String(safePage));
  params.set("limit", String(safeLimit));

  const trimmedSearch = String(search || "").trim();
  if (trimmedSearch) params.set("search", trimmedSearch);

  if (bookingStatus && bookingStatus !== "all") {
    params.set("bookingStatus", bookingStatus);
  }
  if (paymentStatus && paymentStatus !== "all") {
    params.set("paymentStatus", paymentStatus);
  }
  if (sort) {
    params.set("sort", String(sort).trim());
  }

  const payload = await apiRequest(`/api/admin/rentals?${params.toString()}`, {
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

  const items = rawList.map(normalizeAdminRental).filter(Boolean);

  return {
    items,
    pagination: extractPaginationMeta(payload, items.length, safePage, safeLimit),
    summary:
      payload?.summary && typeof payload.summary === "object"
        ? payload.summary
        : null,
  };
}

/**
 * Fetch detailed rental record for Admin inspection:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/admin/rentals/:id
 */
export async function getAdminRentalById(rentalId, { token = null } = {}) {
  const cleanId = decodeURIComponent(String(rentalId || "")).trim();
  if (!cleanId) {
    throw new ApiError("Booking ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("inspect platform booking details");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("GET /api/admin/rentals/:id");
  }

  const payload = await apiRequest(
    `/api/admin/rentals/${encodeURIComponent(cleanId)}`,
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

  return normalizeAdminRental(record);
}

/**
 * Update an internal Administrator governance note on a rental record:
 * PATCH {NEXT_PUBLIC_API_BASE_URL}/api/admin/rentals/:id/note
 */
export async function updateAdminRentalNote(
  rentalId,
  { adminNote = "" } = {},
  { token = null } = {}
) {
  const cleanId = decodeURIComponent(String(rentalId || "")).trim();
  if (!cleanId) {
    throw new ApiError("Booking ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("update rental governance notes");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("PATCH /api/admin/rentals/:id/note");
  }

  const payload = await apiRequest(
    `/api/admin/rentals/${encodeURIComponent(cleanId)}/note`,
    {
      method: "PATCH",
      body: { adminNote: String(adminNote || "").trim() },
      token: activeToken,
      authRequired: true,
    }
  );

  const record =
    payload?.data && typeof payload.data === "object" ? payload.data : payload;
  return {
    record: normalizeAdminRental(record),
    message:
      typeof payload?.message === "string"
        ? payload.message
        : "Rental governance note updated.",
  };
}
