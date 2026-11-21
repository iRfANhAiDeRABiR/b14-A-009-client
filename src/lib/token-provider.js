import { authClient, isAuthBackendConfigured } from "@/lib/auth-client";

const EXPIRY_SAFETY_BUFFER_MS = 30 * 1000;

let cachedToken = null;
let cachedExpiresAtMs = 0;
let inFlightPromise = null;

/**
 * Extract the JWT expiration timestamp in milliseconds from standard `exp` claim.
 * Signature verification stays strictly on the Express backend.
 */
function parseJwtExpiryMs(token) {
  try {
    if (typeof token !== "string") return 0;
    const parts = token.split(".");
    if (parts.length !== 3) return 0;

    const base64Url = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64Url.padEnd(Math.ceil(base64Url.length / 4) * 4, "=");
    const jsonString =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");

    const payload = JSON.parse(jsonString);
    if (typeof payload?.exp === "number" && Number.isFinite(payload.exp)) {
      return payload.exp * 1000;
    }
    return 0;
  } catch {
    return 0;
  }
}

function isTokenFresh(token, expiresAtMs) {
  if (!token) return false;
  if (!expiresAtMs) return false;
  return Date.now() + EXPIRY_SAFETY_BUFFER_MS < expiresAtMs;
}

export function clearAccessTokenCache() {
  cachedToken = null;
  cachedExpiresAtMs = 0;
  inFlightPromise = null;
}

/**
 * Retrieve a signed Better Auth JWT from GET {AUTH_API_BASE_URL}/api/auth/token.
 * Tokens remain strictly in memory (never persisted to localStorage/sessionStorage).
 */
export async function getAccessToken({ forceRefresh = false } = {}) {
  if (!isAuthBackendConfigured) {
    clearAccessTokenCache();
    return null;
  }

  if (!forceRefresh && isTokenFresh(cachedToken, cachedExpiresAtMs)) {
    return cachedToken;
  }

  if (inFlightPromise && !forceRefresh) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const response = await authClient.$fetch("/token", {
        method: "GET",
      });

      const token =
        typeof response?.data?.token === "string" && response.data.token.trim()
          ? response.data.token.trim()
          : null;

      if (!token || response?.error) {
        clearAccessTokenCache();
        return null;
      }

      const parsedExp = parseJwtExpiryMs(token);
      cachedToken = token;
      cachedExpiresAtMs = parsedExp || Date.now() + 60 * 1000;
      return cachedToken;
    } catch {
      clearAccessTokenCache();
      return null;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

export async function buildBearerHeaders(
  baseHeaders = {},
  { forceRefresh = false } = {}
) {
  const token = await getAccessToken({ forceRefresh });
  const headers = { ...baseHeaders };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return { headers, token };
}
