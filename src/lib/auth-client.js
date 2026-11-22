import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const RAW_API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();

export const AUTH_API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

export const isAuthBackendConfigured = Boolean(
  AUTH_API_BASE_URL && !AUTH_API_BASE_URL.toLowerCase().includes("your-")
);

/**
 * When NEXT_PUBLIC_API_BASE_URL is not configured in the client environment yet,
 * avoid firing doomed requests against Next.js's own origin (/api/auth/*) while
 * still failing closed on authentication mutations and token issuance.
 */
async function unconfiguredAuthFetch(input) {
  const url = typeof input === "string" ? input : input?.url || "";

  if (url.includes("/get-session")) {
    return new Response(JSON.stringify(null), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      code: "BACKEND_NOT_CONFIGURED",
      message:
        "Authentication backend URL (NEXT_PUBLIC_API_BASE_URL) is not configured. Configure and run the Express server before authenticating.",
    }),
    {
      status: 503,
      headers: { "content-type": "application/json" },
    }
  );
}

const RESOLVED_BROWSER_BASE_URL =
  typeof window !== "undefined" ? window.location.origin : AUTH_API_BASE_URL;

export const authClient = createAuthClient({
  ...(RESOLVED_BROWSER_BASE_URL ? { baseURL: RESOLVED_BROWSER_BASE_URL } : {}),
  basePath: "/api/auth",
  plugins: [jwtClient()],
  fetchOptions: {
    credentials: "include",
    ...(!isAuthBackendConfigured
      ? { customFetchImpl: unconfiguredAuthFetch }
      : {}),
  },
  ...(!isAuthBackendConfigured
    ? {
        sessionOptions: {
          refetchOnWindowFocus: false,
          refetchInterval: 0,
        },
      }
    : {}),
});
