import { formatBookingDuration, formatDisplayDate } from "./customerUtils.js";

export const PAYMENT_VERIFICATION_STATES = {
  VERIFYING: "verifying",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  FAILED: "failed",
  INVALID: "invalid",
};

export const MAX_PAYMENT_POLL_ATTEMPTS = 5;

const POLL_BACKOFF_DELAYS_MS = [2000, 3500, 5000, 7000, 10000];

const APPROVED_STRIPE_HOSTS = new Set([
  "checkout.stripe.com",
  "checkout.link.com",
]);

export function getPaymentPollDelayMs(attemptIndex = 0) {
  const safeIdx = Math.max(
    0,
    Math.min(POLL_BACKOFF_DELAYS_MS.length - 1, Math.floor(attemptIndex))
  );
  return POLL_BACKOFF_DELAYS_MS[safeIdx];
}

/**
 * Strictly verify that a backend-returned checkoutUrl points to an approved HTTPS
 * Stripe Checkout domain before navigating the browser. Rejects arbitrary external URLs,
 * javascript: URIs, and plain HTTP destinations.
 */
export function isApprovedStripeCheckoutUrl(rawUrl) {
  const clean = String(rawUrl || "").trim();
  if (!clean) return false;

  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== "https:") {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    if (APPROVED_STRIPE_HOSTS.has(host)) {
      return true;
    }

    if (host.endsWith(".checkout.stripe.com")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function isValidStripeSessionId(rawSessionId) {
  const clean = String(rawSessionId || "").trim();
  if (!clean || clean.length < 8 || clean.length > 256) {
    return false;
  }
  return /^[A-Za-z0-9_-]+$/.test(clean);
}

/**
 * Classify backend verification status strictly from server-verified payment fields.
 * Never trusts URL query parameters or browser state as proof of payment.
 */
export function resolvePaymentVerificationState({
  paymentStatus = "",
  sessionStatus = "",
  isVerified = null,
} = {}) {
  const cleanPayment = String(paymentStatus || "").trim().toLowerCase();
  const cleanSession = String(sessionStatus || "").trim().toLowerCase();

  if (isVerified === true && (cleanPayment === "paid" || cleanPayment === "succeeded")) {
    return PAYMENT_VERIFICATION_STATES.CONFIRMED;
  }

  if (cleanPayment === "paid" || cleanPayment === "succeeded" || cleanPayment === "verified") {
    return PAYMENT_VERIFICATION_STATES.CONFIRMED;
  }

  if (
    cleanPayment === "failed" ||
    cleanPayment === "cancelled" ||
    cleanPayment === "canceled" ||
    cleanSession === "expired"
  ) {
    return PAYMENT_VERIFICATION_STATES.FAILED;
  }

  return PAYMENT_VERIFICATION_STATES.PROCESSING;
}

export function normalizeCheckoutSessionCreation(rawResponse) {
  const data =
    rawResponse?.data && typeof rawResponse.data === "object"
      ? rawResponse.data
      : rawResponse && typeof rawResponse === "object"
        ? rawResponse
        : {};

  return {
    bookingId: String(data.bookingIntentId || data.bookingId || data._id || "").trim(),
    sessionId: String(data.sessionId || data.stripeSessionId || "").trim(),
    checkoutUrl: String(data.checkoutUrl || data.url || "").trim(),
    message:
      typeof rawResponse?.message === "string" ? rawResponse.message.trim() : "",
  };
}

export function normalizePaymentSessionPayload(rawResponse) {
  if (!rawResponse || typeof rawResponse !== "object") return null;

  const data =
    rawResponse?.data && typeof rawResponse.data === "object"
      ? rawResponse.data
      : rawResponse?.session && typeof rawResponse.session === "object"
        ? rawResponse.session
        : rawResponse;

  if (!data || typeof data !== "object") return null;

  const bookingObj =
    data.booking && typeof data.booking === "object" ? data.booking : {};
  const equipmentObj =
    data.equipment && typeof data.equipment === "object"
      ? data.equipment
      : bookingObj.equipment && typeof bookingObj.equipment === "object"
        ? bookingObj.equipment
        : {};

  const sessionId = String(
    data.sessionId || data.stripeSessionId || data.id || ""
  ).trim();
  const bookingId = String(
    data.bookingIntentId || data.bookingId || bookingObj._id || bookingObj.id || ""
  ).trim();
  const bookingReference = String(
    data.bookingReference ||
      bookingObj.bookingReference ||
      bookingObj.referenceId ||
      bookingId ||
      ""
  ).trim();

  const equipmentId = String(
    data.equipmentId || equipmentObj._id || equipmentObj.id || bookingObj.equipmentId || ""
  ).trim();
  const equipmentName = String(
    data.equipmentName || equipmentObj.name || bookingObj.equipmentName || ""
  ).trim();
  const equipmentImage = String(
    data.equipmentImage ||
      equipmentObj.image ||
      (Array.isArray(equipmentObj.images) ? equipmentObj.images[0] : "") ||
      ""
  ).trim();

  const startDate = data.startDate || bookingObj.startDate || "";
  const endDate = data.endDate || bookingObj.endDate || "";
  const rawDuration =
    data.durationDays ?? bookingObj.durationDays ?? data.duration ?? null;
  const numericDuration =
    rawDuration !== null &&
    rawDuration !== undefined &&
    Number.isFinite(Number(rawDuration))
      ? Math.floor(Number(rawDuration))
      : null;

  const rawQty = data.quantity ?? bookingObj.quantity;
  const quantity =
    rawQty !== undefined &&
    rawQty !== null &&
    Number.isFinite(Number(rawQty)) &&
    Number(rawQty) > 0
      ? Math.floor(Number(rawQty))
      : null;

  const rawAmount =
    data.totalAmount ?? bookingObj.totalAmount ?? data.amountTotal ?? data.amount;
  const totalAmount =
    rawAmount !== undefined &&
    rawAmount !== null &&
    Number.isFinite(Number(rawAmount))
      ? Number(rawAmount)
      : null;

  const paymentStatus = String(
    data.paymentStatus || bookingObj.paymentStatus || "Pending"
  ).trim();
  const bookingStatus = String(
    data.bookingStatus || bookingObj.bookingStatus || bookingObj.status || ""
  ).trim();
  const sessionStatus = String(
    data.sessionStatus || data.stripeSessionStatus || ""
  ).trim();

  const verificationState = resolvePaymentVerificationState({
    paymentStatus,
    sessionStatus,
    isVerified: typeof data.verified === "boolean" ? data.verified : null,
  });

  const canRetryPayment = Boolean(
    typeof data.canRetryPayment === "boolean"
      ? data.canRetryPayment
      : bookingId &&
          verificationState !== PAYMENT_VERIFICATION_STATES.CONFIRMED &&
          bookingStatus.toLowerCase() !== "cancelled"
  );

  return {
    sessionId,
    bookingId,
    bookingReference,
    equipmentId,
    equipmentName,
    equipmentImage,
    startDate,
    endDate,
    durationDays: numericDuration,
    durationLabel: formatBookingDuration(startDate, endDate, numericDuration),
    quantity,
    rentalType: String(
      data.rentalType || bookingObj.rentalType || equipmentObj.rentalType || ""
    ).trim(),
    totalAmount,
    paymentStatus,
    bookingStatus,
    sessionStatus,
    transactionId: String(
      data.transactionId ||
        data.paymentIntentId ||
        bookingObj.transactionId ||
        ""
    ).trim(),
    paidAt: data.paidAt || data.paymentDate || bookingObj.paidAt || "",
    failureReason: String(
      data.failureReason || data.errorMessage || data.message || ""
    ).trim(),
    verificationState,
    canRetryPayment,
  };
}

export { formatBookingDuration, formatDisplayDate };
