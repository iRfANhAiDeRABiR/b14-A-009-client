import { ApiError, apiRequest } from "@/lib/apiClient";
import { buildProfileUpdatePayload } from "@/lib/customerUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function normalizeProfile(raw = {}) {
  const data =
    raw?.data && typeof raw.data === "object"
      ? raw.data
      : raw?.user && typeof raw.user === "object"
        ? raw.user
        : raw;

  return {
    name: data?.name || "",
    email: data?.email || "",
    photoURL: data?.photoURL || data?.image || "",
    phone: data?.phone || data?.phoneNumber || "",
    address: data?.address || "",
    role: data?.role || "",
  };
}

/**
 * Fetch the currently authenticated user's profile from Express:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/users/me
 */
export async function getMyProfile({ token = null } = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError("Authentication required to load your profile.", {
      status: 401,
      code: "UNAUTHORIZED",
      requiresAuth: true,
    });
  }

  if (!API_BASE_URL) {
    throw new ApiError(
      "Express backend URL (NEXT_PUBLIC_API_BASE_URL) is not configured yet.",
      {
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      }
    );
  }

  const payload = await apiRequest("/api/users/me", {
    method: "GET",
    token: activeToken,
    authRequired: true,
  });

  return normalizeProfile(payload);
}

/**
 * Update editable fields of the currently authenticated user's profile:
 * PATCH {NEXT_PUBLIC_API_BASE_URL}/api/users/me
 * Strictly strips role/email/permissions so the client cannot self-escalate.
 */
export async function updateMyProfile(profileData, { token = null } = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError("Authentication required to save profile changes.", {
      status: 401,
      code: "UNAUTHORIZED",
      requiresAuth: true,
    });
  }

  if (!API_BASE_URL) {
    throw new ApiError(
      "Profile update endpoint (PATCH /api/users/me) is not connected yet because NEXT_PUBLIC_API_BASE_URL is unset.",
      {
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      }
    );
  }

  const safeBody = buildProfileUpdatePayload(profileData);

  const payload = await apiRequest("/api/users/me", {
    method: "PATCH",
    body: safeBody,
    token: activeToken,
    authRequired: true,
  });

  return normalizeProfile(payload);
}
