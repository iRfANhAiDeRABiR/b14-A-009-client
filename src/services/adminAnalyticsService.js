import { ApiError, apiRequest } from "@/lib/apiClient";
import {
  normalizeAdminAnalyticsPayload,
  normalizeAdminAnalyticsPeriod,
} from "@/lib/adminUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

/**
 * Fetch authoritative platform analytics from Express:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/admin/analytics?period=3m|6m|12m
 * Never sends an Admin ID as proof of authorization; backend verifies Admin role via JWT.
 */
export async function getAdminAnalytics({
  period = "6m",
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError(
      "Authentication required to access Admin Platform Analytics.",
      {
        status: 401,
        code: "UNAUTHORIZED",
        requiresAuth: true,
      }
    );
  }

  if (!API_BASE_URL) {
    throw new ApiError(
      "Admin analytics API endpoint (GET /api/admin/analytics) is unavailable because NEXT_PUBLIC_API_BASE_URL is not configured yet.",
      {
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      }
    );
  }

  const safePeriod = normalizeAdminAnalyticsPeriod(period);
  const payload = await apiRequest(
    `/api/admin/analytics?period=${encodeURIComponent(safePeriod)}`,
    {
      method: "GET",
      token: activeToken,
      authRequired: true,
    }
  );

  return normalizeAdminAnalyticsPayload(payload);
}
