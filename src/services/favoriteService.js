import { ApiError, apiRequest } from "@/lib/apiClient";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function createUnauthorizedError() {
  return new ApiError(
    "Sign in is required to manage favorites. Please log in to continue.",
    { status: 401, code: "UNAUTHORIZED", requiresAuth: true }
  );
}

function createServiceUnavailableError(message) {
  return new ApiError(
    message ||
      "Favorites service is not connected yet. Connect the Express backend to persist favorites in MongoDB.",
    { status: 503, code: "SERVICE_UNAVAILABLE" }
  );
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
    const json = await apiRequest("/api/favorites", {
      method: "GET",
      token: activeToken,
      authRequired: true,
    });

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
    if (error instanceof ApiError && error.requiresAuth) {
      return {
        items: [],
        error: "Session expired or unauthorized. Please sign in again.",
        requiresAuth: true,
      };
    }

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

  return apiRequest("/api/favorites", {
    method: "POST",
    body: { equipmentId },
    token: activeToken,
    authRequired: true,
  });
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

  return apiRequest(`/api/favorites/${encodeURIComponent(equipmentId)}`, {
    method: "DELETE",
    token: activeToken,
    authRequired: true,
  });
}
