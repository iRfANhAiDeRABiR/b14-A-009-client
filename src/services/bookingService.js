const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function createAuthRequiredError(actionLabel) {
  const err = new Error(
    `Authentication required to ${actionLabel}. Please sign in before submitting a reservation.`
  );
  err.code = "UNAUTHORIZED";
  return err;
}

function createBackendUnavailableError(actionLabel) {
  const err = new Error(
    `Unable to ${actionLabel}: the booking API server is not configured or unreachable yet.`
  );
  err.code = "SERVICE_UNAVAILABLE";
  return err;
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
  if (!token) {
    throw createAuthRequiredError("verify live equipment availability");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("verify live availability");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/bookings/check-availability`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        equipmentId,
        startDate,
        endDate,
        quantity,
      }),
    }
  );

  if (response.status === 401 || response.status === 403) {
    throw createAuthRequiredError("verify equipment availability");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload?.message ||
        `Availability check failed with status ${response.status}.`
    );
  }

  return payload;
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
  if (!token) {
    throw createAuthRequiredError("create a rental booking");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("submit booking");
  }

  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      equipmentId,
      startDate,
      endDate,
      quantity,
      contactNumber,
      deliveryAddress,
      additionalNotes,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    throw createAuthRequiredError("create a rental booking");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload?.message || `Booking request failed with status ${response.status}.`
    );
  }

  return payload;
}
