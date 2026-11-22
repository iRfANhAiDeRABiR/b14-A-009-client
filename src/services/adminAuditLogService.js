import { ApiError, apiRequest } from "@/lib/apiClient";
import { extractPaginationMeta } from "@/lib/adminUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

export const ADMIN_LOG_CATEGORY_OPTIONS = [
  { label: "All Events", value: "all" },
  { label: "Users", value: "user" },
  { label: "Equipment", value: "equipment" },
  { label: "Rentals", value: "rental" },
  { label: "Inquiries", value: "inquiry" },
];

export const ADMIN_LOG_SEVERITY_OPTIONS = [
  { label: "All Severities", value: "all" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Critical", value: "danger" },
];

export async function getAdminAuditLogs({
  search = "",
  category = "all",
  severity = "all",
  sort = "newest",
  page = 1,
  limit = 20,
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError(
      "Authentication required to inspect platform event logs.",
      { status: 401, code: "UNAUTHORIZED", requiresAuth: true }
    );
  }
  if (!API_BASE_URL) {
    throw new ApiError(
      "Event log endpoint (GET /api/admin/logs) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured.",
      { status: 503, code: "SERVICE_UNAVAILABLE" }
    );
  }

  const params = new URLSearchParams();
  const safePage = Number.isFinite(Number(page)) && Number(page) >= 1 ? Math.floor(Number(page)) : 1;
  const safeLimit = Number.isFinite(Number(limit)) && Number(limit) >= 1 ? Math.floor(Number(limit)) : 20;

  params.set("page", String(safePage));
  params.set("limit", String(safeLimit));
  if (String(search || "").trim()) params.set("search", String(search).trim());
  if (category && category !== "all") params.set("category", category);
  if (severity && severity !== "all") params.set("severity", severity);
  if (sort) params.set("sort", sort);

  const payload = await apiRequest(`/api/admin/logs?${params.toString()}`, {
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
