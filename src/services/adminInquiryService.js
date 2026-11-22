import { ApiError, apiRequest } from "@/lib/apiClient";
import { extractPaginationMeta } from "@/lib/adminUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

export const ADMIN_INQUIRY_STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "New", value: "New" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
];

export const ADMIN_INQUIRY_TYPE_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "General Inquiry", value: "General Inquiry" },
  { label: "Equipment Rental", value: "Equipment Rental" },
  { label: "Equipment Listing", value: "Equipment Listing" },
  { label: "Payment Support", value: "Payment Support" },
  { label: "Technical Support", value: "Technical Support" },
  { label: "Other", value: "Other" },
];

export async function getAdminInquiries({
  search = "",
  status = "all",
  inquiryType = "all",
  sort = "newest",
  page = 1,
  limit = 10,
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError(
      "Authentication required to inspect support inquiries.",
      { status: 401, code: "UNAUTHORIZED", requiresAuth: true }
    );
  }
  if (!API_BASE_URL) {
    throw new ApiError(
      "Admin inquiries endpoint (GET /api/admin/inquiries) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured.",
      { status: 503, code: "SERVICE_UNAVAILABLE" }
    );
  }

  const params = new URLSearchParams();
  const safePage = Number.isFinite(Number(page)) && Number(page) >= 1 ? Math.floor(Number(page)) : 1;
  const safeLimit = Number.isFinite(Number(limit)) && Number(limit) >= 1 ? Math.floor(Number(limit)) : 10;

  params.set("page", String(safePage));
  params.set("limit", String(safeLimit));
  if (String(search || "").trim()) params.set("search", String(search).trim());
  if (status && status !== "all") params.set("status", status);
  if (inquiryType && inquiryType !== "all") params.set("inquiryType", inquiryType);
  if (sort) params.set("sort", sort);

  const payload = await apiRequest(`/api/admin/inquiries?${params.toString()}`, {
    method: "GET",
    token: activeToken,
    authRequired: true,
  });

  const items = Array.isArray(payload?.data) ? payload.data : [];

  return {
    items,
    pagination: extractPaginationMeta(payload, items.length, safePage, safeLimit),
    summary:
      payload?.summary && typeof payload.summary === "object"
        ? payload.summary
        : null,
  };
}

export async function updateAdminInquiryStatus(
  inquiryId,
  { status, adminNote = "" } = {},
  { token = null } = {}
) {
  const cleanId = decodeURIComponent(String(inquiryId || "")).trim();
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError("Authentication required to update inquiries.", {
      status: 401,
      code: "UNAUTHORIZED",
      requiresAuth: true,
    });
  }

  return apiRequest(`/api/admin/inquiries/${encodeURIComponent(cleanId)}/status`, {
    method: "PATCH",
    body: {
      status: String(status || "").trim(),
      adminNote: String(adminNote || "").trim(),
    },
    token: activeToken,
    authRequired: true,
  });
}

export async function deleteAdminInquiry(inquiryId, { token = null } = {}) {
  const cleanId = decodeURIComponent(String(inquiryId || "")).trim();
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError("Authentication required to delete inquiries.", {
      status: 401,
      code: "UNAUTHORIZED",
      requiresAuth: true,
    });
  }

  return apiRequest(`/api/admin/inquiries/${encodeURIComponent(cleanId)}`, {
    method: "DELETE",
    token: activeToken,
    authRequired: true,
  });
}
