import { clearAccessTokenCache, getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function createUnauthorizedError() {
  const err = new Error(
    "Sign in is required to manage favorites. Please log in to continue."
  );
  err.code = "UNAUTHORIZED";
  return err;
}

function createServiceUnavailableError(message) {
  const err = new Error(
    message ||
      "Favorites service is not connected yet. Connect the Express backend to persist favorites in MongoDB."
  );
  err.code = "SERVICE_UNAVAILABLE";
  return err;
}

/**
 * Fetch the authenticated customer's saved favorites from Express/MongoDB:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/favorites
 */
export async function getFavorites({ token } = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    return {
      items: [],
      error: null,
      requiresAuth: true,
    };
  }

  if (!API_BASE_URL) {
    return {
      items: [],
      error: "Backend API base URL is not configured.",
      requiresAuth: false,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${activeToken}`,
      },
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      clearAccessTokenCache();
      return {
        items: [],
        error: "Session expired or unauthorized. Please sign in again.",
        requiresAuth: true,
      };
    }

    if (!response.ok) {
      throw new Error(`Favorites API responded with status ${response.status}`);
    }

    const json = await response.json();
    const list = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.favorites)
          ? json.favorites
          : [];

    return {
      items: list,
      error: null,
      requiresAuth: false,
    };
  } catch (error) {
    return {
      items: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load saved favorites.",
      requiresAuth: false,
    };
  }
}

/**
 * Save an equipment item to the authenticated customer's MongoDB favorites:
 * POST {NEXT_PUBLIC_API_BASE_URL}/api/favorites { equipmentId }
 */
export async function addFavorite({ equipmentId, token } = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createUnauthorizedError();
  }
  if (!API_BASE_URL) {
    throw createServiceUnavailableError();
  }

  const response = await fetch(`${API_BASE_URL}/api/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${activeToken}`,
    },
    body: JSON.stringify({ equipmentId }),
  });

  if (response.status === 401 || response.status === 403) {
    clearAccessTokenCache();
    throw createUnauthorizedError();
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload?.message || `Failed to save favorite (status ${response.status}).`
    );
  }

  return payload;
}

/**
 * Remove an equipment item from the authenticated customer's MongoDB favorites:
 * DELETE {NEXT_PUBLIC_API_BASE_URL}/api/favorites/:equipmentId
 */
export async function removeFavorite({ equipmentId, token } = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createUnauthorizedError();
  }
  if (!API_BASE_URL) {
    throw createServiceUnavailableError();
  }

  const response = await fetch(
    `${API_BASE_URL}/api/favorites/${encodeURIComponent(equipmentId)}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${activeToken}`,
      },
    }
  );

  if (response.status === 401 || response.status === 403) {
    clearAccessTokenCache();
    throw createUnauthorizedError();
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload?.message ||
        `Failed to remove favorite (status ${response.status}).`
    );
  }

  return payload;
}
