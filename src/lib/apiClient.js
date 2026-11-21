import { authClient, isAuthBackendConfigured } from "@/lib/auth-client";
import { clearAccessTokenCache, getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

const authFailureListeners = new Set();

export class ApiError extends Error {
  constructor(
    message,
    { status = 500, code = "API_ERROR", requiresAuth = false, forbidden = false } = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.requiresAuth = requiresAuth;
    this.forbidden = forbidden;
  }
}

export function subscribeAuthFailures(listener) {
  if (typeof listener !== "function") return () => {};
  authFailureListeners.add(listener);
  return () => authFailureListeners.delete(listener);
}

export function notifySessionExpired(detail = {}) {
  clearAccessTokenCache();
  authFailureListeners.forEach((listener) => {
    try {
      listener({ type: "session_expired", ...detail });
    } catch {
      // Listener errors should never break caller cleanup.
    }
  });
}

export function buildApiErrorFromResponse(status, payload = {}) {
  const serverMessage =
    typeof payload?.message === "string" && payload.message.trim()
      ? payload.message.trim()
      : "";

  if (status === 401) {
    return new ApiError(
      serverMessage || "Your session has expired. Please sign in again.",
      {
        status: 401,
        code: "SESSION_EXPIRED",
        requiresAuth: true,
      }
    );
  }

  if (status === 403) {
    return new ApiError(
      serverMessage ||
        "You do not have permission to perform this action with your current role.",
      {
        status: 403,
        code: "FORBIDDEN",
        forbidden: true,
      }
    );
  }

  return new ApiError(
    serverMessage || `Request failed with status ${status}.`,
    {
      status,
      code: payload?.code || "API_ERROR",
    }
  );
}

/**
 * Centralized API request wrapper integrating Better Auth JWT bearer tokens
 * and structured 401/403 handling for protected Express endpoints.
 */
export async function apiRequest(
  path,
  {
    method = "GET",
    headers = {},
    body,
    token = null,
    authRequired = true,
    cache = "no-store",
  } = {}
) {
  if (!API_BASE_URL) {
    throw new ApiError(
      "Express backend API base URL (NEXT_PUBLIC_API_BASE_URL) is not configured yet.",
      {
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      }
    );
  }

  let activeToken = token;
  if (authRequired && !activeToken) {
    activeToken = await getAccessToken();
  }

  if (authRequired && !activeToken) {
    throw new ApiError(
      "Authentication required. Please sign in before performing this action.",
      {
        status: 401,
        code: "UNAUTHORIZED",
        requiresAuth: true,
      }
    );
  }

  const executeFetch = async (bearerToken) => {
    const finalHeaders = {
      Accept: "application/json",
      ...headers,
    };

    if (body !== undefined && !finalHeaders["Content-Type"]) {
      finalHeaders["Content-Type"] = "application/json";
    }

    if (bearerToken) {
      finalHeaders.Authorization = `Bearer ${bearerToken}`;
    }

    return fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      credentials: "include",
      cache,
      ...(body !== undefined
        ? { body: typeof body === "string" ? body : JSON.stringify(body) }
        : {}),
    });
  };

  let response = await executeFetch(activeToken);

  // If access token expired mid-flight, try refreshing once via active Better Auth session.
  if (response.status === 401 && authRequired && isAuthBackendConfigured) {
    clearAccessTokenCache();
    const refreshedToken = await getAccessToken({ forceRefresh: true });
    if (refreshedToken && refreshedToken !== activeToken) {
      response = await executeFetch(refreshedToken);
    }
  }

  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearAccessTokenCache();
    if (isAuthBackendConfigured) {
      const sessionCheck = await authClient.getSession().catch(() => null);
      if (!sessionCheck?.data?.session) {
        notifySessionExpired({ path, status: 401 });
      }
    } else {
      notifySessionExpired({ path, status: 401 });
    }
    throw buildApiErrorFromResponse(401, payload);
  }

  if (response.status === 403) {
    throw buildApiErrorFromResponse(403, payload);
  }

  if (!response.ok) {
    throw buildApiErrorFromResponse(response.status, payload);
  }

  return payload;
}
