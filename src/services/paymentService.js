import { ApiError, apiRequest } from "@/lib/apiClient";
import {
  isValidStripeSessionId,
  normalizeCheckoutSessionCreation,
  normalizePaymentSessionPayload,
} from "@/lib/paymentUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function createAuthRequiredError(actionLabel) {
  return new ApiError(
    `Authentication required to ${actionLabel}. Please sign in to continue.`,
    { status: 401, code: "UNAUTHORIZED", requiresAuth: true }
  );
}

function createBackendUnavailableError(endpointLabel) {
  return new ApiError(
    `Payment endpoint (${endpointLabel}) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured yet.`,
    { status: 503, code: "SERVICE_UNAVAILABLE" }
  );
}

/**
 * Create a Stripe Checkout session via Express backend:
 * POST {NEXT_PUBLIC_API_BASE_URL}/api/payments/create-checkout-session
 * Never computes or trusts frontend price totals or payment status.
 */
export async function createCheckoutSession(
  {
    bookingId = "",
    equipmentId = "",
    startDate = "",
    endDate = "",
    quantity = 1,
    contactNumber = "",
    deliveryAddress = "",
    additionalNotes = "",
    idempotencyKey = "",
  } = {},
  { token = null } = {}
) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("initiate rental checkout");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError(
      "POST /api/payments/create-checkout-session"
    );
  }

  const cleanBookingId = String(bookingId || "").trim();
  const payloadBody = cleanBookingId
    ? { bookingId: cleanBookingId }
    : {
        equipmentId: String(equipmentId || "").trim(),
        startDate: String(startDate || "").trim(),
        endDate: String(endDate || "").trim(),
        quantity: Math.floor(Number(quantity) || 1),
        contactNumber: String(contactNumber || "").trim(),
        deliveryAddress: String(deliveryAddress || "").trim(),
        additionalNotes: String(additionalNotes || "").trim(),
      };

  const headers = idempotencyKey
    ? { "Idempotency-Key": String(idempotencyKey) }
    : {};

  const response = await apiRequest("/api/payments/create-checkout-session", {
    method: "POST",
    body: payloadBody,
    headers,
    token: activeToken,
    authRequired: true,
  });

  return normalizeCheckoutSessionCreation(response);
}

/**
 * Retrieve and verify a Stripe Checkout session belonging to the authenticated customer:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/payments/session/:sessionId
 */
export async function getPaymentSession(sessionId, { token = null } = {}) {
  const cleanSessionId = String(sessionId || "").trim();
  if (!isValidStripeSessionId(cleanSessionId)) {
    throw new ApiError(
      "The provided checkout session reference is missing or invalid.",
      { status: 400, code: "INVALID_SESSION_REFERENCE" }
    );
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("verify payment status");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("GET /api/payments/session/:sessionId");
  }

  const response = await apiRequest(
    `/api/payments/session/${encodeURIComponent(cleanSessionId)}`,
    {
      method: "GET",
      token: activeToken,
      authRequired: true,
    }
  );

  const normalized = normalizePaymentSessionPayload(response);
  if (!normalized) {
    throw new ApiError(
      "Unable to interpret payment verification data returned by the backend.",
      { status: 502, code: "INVALID_PAYMENT_RESPONSE" }
    );
  }

  return normalized;
}

/**
 * Retrieve verified payment status for a specific customer booking:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/payments/booking/:bookingId
 */
export async function getBookingPaymentStatus(bookingId, { token = null } = {}) {
  const cleanBookingId = decodeURIComponent(String(bookingId || "")).trim();
  if (!cleanBookingId) {
    throw new ApiError("Booking ID is required to inspect payment status.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("check booking payment status");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError(
      "GET /api/payments/booking/:bookingId"
    );
  }

  const response = await apiRequest(
    `/api/payments/booking/${encodeURIComponent(cleanBookingId)}`,
    {
      method: "GET",
      token: activeToken,
      authRequired: true,
    }
  );

  const normalized = normalizePaymentSessionPayload(response);
  if (!normalized) {
    throw new ApiError(
      "No verified payment status record found for this booking.",
      { status: 404, code: "NOT_FOUND" }
    );
  }

  return normalized;
}
