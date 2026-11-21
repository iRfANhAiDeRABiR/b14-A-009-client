import { ApiError, apiRequest } from "@/lib/apiClient";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function createAuthRequiredError(actionLabel) {
  return new ApiError(
    `Authentication required to ${actionLabel}. Please sign in before submitting a reservation.`,
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
