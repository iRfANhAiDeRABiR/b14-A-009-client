/**
 * Authentication integration boundary for private routes and protected API actions.
 *
 * Better Auth will be wired here in Client Commit 08. Until then, this module
 * strictly fails closed: no fake logged-in users, no mock tokens, and no
 * unauthenticated bypass for favorites or booking creation.
 */

export const IS_AUTH_CONFIGURED = false;

export function buildLoginRedirectUrl(destinationPath = "/") {
  const safePath =
    typeof destinationPath === "string" && destinationPath.startsWith("/")
      ? destinationPath
      : "/";

  if (safePath.startsWith("/login")) {
    return "/login";
  }

  return `/login?redirectTo=${encodeURIComponent(safePath)}`;
}

export async function getAuthState() {
  return {
    isAuthConfigured: IS_AUTH_CONFIGURED,
    isAuthenticated: false,
    user: null,
    token: null,
  };
}
