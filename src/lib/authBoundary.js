import { authClient, isAuthBackendConfigured } from "@/lib/auth-client";
import { buildLoginRedirectUrl } from "@/lib/authValidation";
import { getAccessToken } from "@/lib/token-provider";

export const IS_AUTH_CONFIGURED = true;

export { buildLoginRedirectUrl };

/**
 * Asynchronous auth state reader for service/non-hook callers.
 * Fails closed unless a real Better Auth session cookie is active.
 */
export async function getAuthState() {
  if (!isAuthBackendConfigured) {
    return {
      isAuthConfigured: IS_AUTH_CONFIGURED,
      isBackendConfigured: false,
      isAuthenticated: false,
      user: null,
      session: null,
      token: null,
    };
  }

  try {
    const result = await authClient.getSession();
    const user = result?.data?.user ?? null;
    const session = result?.data?.session ?? null;
    const isAuthenticated = Boolean(user && session);
    const token = isAuthenticated ? await getAccessToken() : null;

    return {
      isAuthConfigured: IS_AUTH_CONFIGURED,
      isBackendConfigured: true,
      isAuthenticated,
      user,
      session,
      token,
    };
  } catch {
    return {
      isAuthConfigured: IS_AUTH_CONFIGURED,
      isBackendConfigured: true,
      isAuthenticated: false,
      user: null,
      session: null,
      token: null,
    };
  }
}
