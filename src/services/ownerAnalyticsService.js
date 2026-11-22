import { ApiError, apiRequest } from "@/lib/apiClient";
import {
  normalizeOwnerAnalyticsPayload,
  normalizeOwnerAnalyticsPeriod,
} from "@/lib/ownerUtils";
import { getAccessToken } from "@/lib/token-provider";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

/**
 * Fetch authoritative owner business analytics from Express:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/owner/analytics?period=3m|6m|12m
 * Never sends owner ID as proof of authorization; backend identifies owner via verified JWT.
 */
export async function getOwnerAnalytics({
  period = "6m",
  token = null,
} = {}) {
  const activeToken = token || (await getAccessToken());
  if (!activeToken) {
    throw new ApiError(
      "Authentication required to access Owner Business Analytics.",
      {
        status: 401,
        code: "UNAUTHORIZED",
        requiresAuth: true,
      }
    );
  }

  if (!API_BASE_URL) {
    throw new ApiError(
      "Owner analytics API URL (NEXT_PUBLIC_API_BASE_URL) is not configured yet.",
      {
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      }
    );
  }

  const safePeriod = normalizeOwnerAnalyticsPeriod(period);
  const payload = await apiRequest(
    `/api/owner/analytics?period=${encodeURIComponent(safePeriod)}`,
    {
      method: "GET",
      token: activeToken,
      authRequired: true,
    }
  );

  return normalizeOwnerAnalyticsPayload(payload);
}
