import { ApiError, apiRequest } from "@/lib/apiClient";
import {
  DEFAULT_ADMIN_PAGE_LIMIT,
  extractPaginationMeta,
  isValidAssignableRole,
  normalizeAdminUser,
  normalizeDisplayRole,
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
    `Admin user management endpoint (${endpointLabel}) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured yet.`,
    { status: 503, code: "SERVICE_UNAVAILABLE" }
  );
}

/**
 * Fetch platform users directory for Admin governance:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/admin/users?search=&role=&sort=&page=&limit=
 */
export async function getAdminUsers({
  search = "",
  role = "all",
  status = "all",
  sort = "newest",
  page = 1,
  limit = DEFAULT_ADMIN_PAGE_LIMIT,
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("view platform users");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("GET /api/admin/users");
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

  if (role && role !== "all") {
    params.set("role", normalizeDisplayRole(role));
  }

  if (status && status !== "all") {
    params.set("status", String(status).trim());
  }

  if (sort) {
    params.set("sort", String(sort).trim());
  }

  const payload = await apiRequest(`/api/admin/users?${params.toString()}`, {
    method: "GET",
    token: activeToken,
    authRequired: true,
  });

  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.users)
        ? payload.users
        : [];

  const items = rawList.map(normalizeAdminUser).filter(Boolean);

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
 * Fetch single user details permitted for Admin review:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/admin/users/:id
 */
export async function getAdminUserById(userId, { token = null } = {}) {
  const cleanId = decodeURIComponent(String(userId || "")).trim();
  if (!cleanId) {
    throw new ApiError("User ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("inspect user account details");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("GET /api/admin/users/:id");
  }

  const payload = await apiRequest(
    `/api/admin/users/${encodeURIComponent(cleanId)}`,
    {
      method: "GET",
      token: activeToken,
      authRequired: true,
    }
  );

  const record =
    payload?.data && typeof payload.data === "object"
      ? payload.data
      : payload?.user && typeof payload.user === "object"
        ? payload.user
        : payload;

  return normalizeAdminUser(record);
}

/**
 * Update a user's platform role (Customer | Owner | Admin):
 * PATCH {NEXT_PUBLIC_API_BASE_URL}/api/admin/users/:id/role
 */
export async function updateAdminUserRole(
  userId,
  newRole,
  { token = null } = {}
) {
  const cleanId = decodeURIComponent(String(userId || "")).trim();
  if (!cleanId) {
    throw new ApiError("User ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  if (!isValidAssignableRole(newRole)) {
    throw new ApiError("Invalid role value. Allowed roles: Customer, Owner, Admin.", {
      status: 400,
      code: "VALIDATION_ERROR",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("change user roles");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("PATCH /api/admin/users/:id/role");
  }

  const resolvedRole = normalizeDisplayRole(newRole);

  return apiRequest(`/api/admin/users/${encodeURIComponent(cleanId)}/role`, {
    method: "PATCH",
    body: { role: resolvedRole },
    token: activeToken,
    authRequired: true,
  });
}

/**
 * Update a user's account access status (Active | Suspended | Banned):
 * PATCH {NEXT_PUBLIC_API_BASE_URL}/api/admin/users/:id/status
 */
export async function updateAdminUserStatus(
  userId,
  { status, reason = "" } = {},
  { token = null } = {}
) {
  const cleanId = decodeURIComponent(String(userId || "")).trim();
  if (!cleanId) {
    throw new ApiError("User ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("update user account status");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("PATCH /api/admin/users/:id/status");
  }

  return apiRequest(`/api/admin/users/${encodeURIComponent(cleanId)}/status`, {
    method: "PATCH",
    body: {
      status: String(status || "").trim(),
      ...(reason !== undefined ? { reason: String(reason || "").trim() } : {}),
    },
    token: activeToken,
    authRequired: true,
  });
}

/**
 * Update safe user profile metadata from Admin Panel:
 * PATCH {NEXT_PUBLIC_API_BASE_URL}/api/admin/users/:id
 */
export async function updateAdminUserDetails(
  userId,
  { name, phone, address } = {},
  { token = null } = {}
) {
  const cleanId = decodeURIComponent(String(userId || "")).trim();
  if (!cleanId) {
    throw new ApiError("User ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("update user account profile");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("PATCH /api/admin/users/:id");
  }

  const body = {};
  if (name !== undefined) body.name = String(name).trim();
  if (phone !== undefined) body.phone = String(phone).trim();
  if (address !== undefined) body.address = String(address).trim();

  return apiRequest(`/api/admin/users/${encodeURIComponent(cleanId)}`, {
    method: "PATCH",
    body,
    token: activeToken,
    authRequired: true,
  });
}

/**
 * Archive & remove a user account safely:
 * DELETE {NEXT_PUBLIC_API_BASE_URL}/api/admin/users/:id
 */
export async function deleteAdminUser(userId, { token = null } = {}) {
  const cleanId = decodeURIComponent(String(userId || "")).trim();
  if (!cleanId) {
    throw new ApiError("User ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("remove user accounts");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("DELETE /api/admin/users/:id");
  }

  return apiRequest(`/api/admin/users/${encodeURIComponent(cleanId)}`, {
    method: "DELETE",
    token: activeToken,
    authRequired: true,
  });
}
