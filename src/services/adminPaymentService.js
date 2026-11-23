import { ApiError, apiRequest } from "@/lib/apiClient";
import { extractPaginationMeta } from "@/lib/adminUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

export const ADMIN_PAYMENT_STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Paid", value: "Paid" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
];

export const ADMIN_PAYMENT_SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Amount: High to Low", value: "amount_high" },
  { label: "Amount: Low to High", value: "amount_low" },
];

const EMPTY_SUMMARY = {
  totalPayments: 0,
  paidCount: 0,
  paidRevenue: 0,
  pendingCount: 0,
  failedCount: 0,
  refundedCount: 0,
  refundedAmount: 0,
};

/**
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/admin/payments
 * Platform-wide payment history across every customer with booking, equipment, and Stripe details.
 */
export async function getAdminPayments({
  search = "",
  status = "all",
  sort = "newest",
  customerId = "",
  page = 1,
  limit = 15,
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError("Authentication required to inspect payment history.", {
      status: 401,
      code: "UNAUTHORIZED",
      requiresAuth: true,
    });
  }
  if (!API_BASE_URL) {
    throw new ApiError(
      "Payment history endpoint (GET /api/admin/payments) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured.",
      { status: 503, code: "SERVICE_UNAVAILABLE" }
    );
  }

  const safePage =
    Number.isFinite(Number(page)) && Number(page) >= 1
      ? Math.floor(Number(page))
      : 1;
  const safeLimit =
    Number.isFinite(Number(limit)) && Number(limit) >= 1
      ? Math.floor(Number(limit))
      : 15;

  const params = new URLSearchParams();
  params.set("page", String(safePage));
  params.set("limit", String(safeLimit));
  if (String(search || "").trim()) params.set("search", String(search).trim());
  if (status && status !== "all") params.set("status", status);
  if (sort) params.set("sort", sort);
  if (String(customerId || "").trim()) {
    params.set("customerId", String(customerId).trim());
  }

  const payload = await apiRequest(`/api/admin/payments?${params.toString()}`, {
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
        ? { ...EMPTY_SUMMARY, ...payload.summary }
        : { ...EMPTY_SUMMARY },
  };
}
