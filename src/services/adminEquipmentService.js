import { ApiError, apiRequest } from "@/lib/apiClient";
import {
  computeOwnerEquipmentStats,
  DEFAULT_ADMIN_PAGE_LIMIT,
  extractPaginationMeta,
  normalizeAdminEquipmentItem,
} from "@/lib/adminUtils";
import { buildUpdateEquipmentPayload } from "@/lib/ownerUtils";
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
    `Admin equipment endpoint (${endpointLabel}) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured yet.`,
    { status: 503, code: "SERVICE_UNAVAILABLE" }
  );
}

/**
 * Fetch all marketplace equipment listings (Pending, Approved, Rejected):
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/admin/equipment
 */
export async function getAdminEquipment({
  search = "",
  category = "all",
  status = "all",
  sort = "newest",
  page = 1,
  limit = DEFAULT_ADMIN_PAGE_LIMIT,
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("manage marketplace equipment");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("GET /api/admin/equipment");
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

  if (category && category !== "all") params.set("category", category);
  if (status && status !== "all") params.set("status", status);
  if (sort) params.set("sort", String(sort).trim());

  const payload = await apiRequest(`/api/admin/equipment?${params.toString()}`, {
    method: "GET",
    token: activeToken,
    authRequired: true,
  });

  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.equipment)
        ? payload.equipment
        : [];

  const items = rawList.map(normalizeAdminEquipmentItem).filter(Boolean);
  const pagination = extractPaginationMeta(payload, items.length, safePage, safeLimit);

  const summary =
    payload?.summary ||
    payload?.statusBreakdown ||
    payload?.equipmentStatusBreakdown ||
    null;

  return {
    items,
    stats: computeOwnerEquipmentStats(items, summary, pagination.totalItems),
    pagination,
  };
}

/**
 * Fetch complete listing record for Admin inspection or editing:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/admin/equipment/:id
 */
export async function getAdminEquipmentById(equipmentId, { token = null } = {}) {
  const cleanId = decodeURIComponent(String(equipmentId || "")).trim();
  if (!cleanId) {
    throw new ApiError("Equipment ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("inspect equipment listing details");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("GET /api/admin/equipment/:id");
  }

  const payload = await apiRequest(
    `/api/admin/equipment/${encodeURIComponent(cleanId)}`,
    {
      method: "GET",
      token: activeToken,
      authRequired: true,
    }
  );

  const record =
    payload?.data && typeof payload.data === "object"
      ? payload.data
      : payload?.equipment && typeof payload.equipment === "object"
        ? payload.equipment
        : payload;

  return normalizeAdminEquipmentItem(record);
}

/**
 * Approve an equipment listing for public display:
 * PATCH {NEXT_PUBLIC_API_BASE_URL}/api/admin/equipment/:id/approve
 */
export async function approveAdminEquipment(equipmentId, { token = null } = {}) {
  const cleanId = decodeURIComponent(String(equipmentId || "")).trim();
  if (!cleanId) {
    throw new ApiError("Equipment ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("approve equipment listings");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("PATCH /api/admin/equipment/:id/approve");
  }

  return apiRequest(
    `/api/admin/equipment/${encodeURIComponent(cleanId)}/approve`,
    {
      method: "PATCH",
      token: activeToken,
      authRequired: true,
    }
  );
}

/**
 * Reject an equipment listing with optional/required admin feedback:
 * PATCH {NEXT_PUBLIC_API_BASE_URL}/api/admin/equipment/:id/reject
 */
export async function rejectAdminEquipment(
  equipmentId,
  { rejectionReason = "" } = {},
  { token = null } = {}
) {
  const cleanId = decodeURIComponent(String(equipmentId || "")).trim();
  if (!cleanId) {
    throw new ApiError("Equipment ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("reject equipment listings");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("PATCH /api/admin/equipment/:id/reject");
  }

  const cleanReason = String(rejectionReason || "").trim();

  return apiRequest(
    `/api/admin/equipment/${encodeURIComponent(cleanId)}/reject`,
    {
      method: "PATCH",
      body: cleanReason ? { rejectionReason: cleanReason } : {},
      token: activeToken,
      authRequired: true,
    }
  );
}

/**
 * Update supported equipment metadata fields without altering owner identity or history:
 * PATCH {NEXT_PUBLIC_API_BASE_URL}/api/admin/equipment/:id
 */
export async function updateAdminEquipment(
  equipmentId,
  formValues,
  { token = null } = {}
) {
  const cleanId = decodeURIComponent(String(equipmentId || "")).trim();
  if (!cleanId) {
    throw new ApiError("Equipment ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("update equipment listings");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("PATCH /api/admin/equipment/:id");
  }

  const sanitizedBody = buildUpdateEquipmentPayload(formValues);

  return apiRequest(`/api/admin/equipment/${encodeURIComponent(cleanId)}`, {
    method: "PATCH",
    body: sanitizedBody,
    token: activeToken,
    authRequired: true,
  });
}

/**
 * Request deletion of an equipment listing following backend history/policy guards:
 * DELETE {NEXT_PUBLIC_API_BASE_URL}/api/admin/equipment/:id
 */
export async function deleteAdminEquipment(equipmentId, { token = null } = {}) {
  const cleanId = decodeURIComponent(String(equipmentId || "")).trim();
  if (!cleanId) {
    throw new ApiError("Equipment ID is required.", {
      status: 400,
      code: "BAD_REQUEST",
    });
  }

  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw createAuthRequiredError("delete equipment listings");
  }
  if (!API_BASE_URL) {
    throw createBackendUnavailableError("DELETE /api/admin/equipment/:id");
  }

  return apiRequest(`/api/admin/equipment/${encodeURIComponent(cleanId)}`, {
    method: "DELETE",
    token: activeToken,
    authRequired: true,
  });
}
