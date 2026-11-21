"use client";

import * as React from "react";
import { subscribeAuthFailures } from "@/lib/apiClient";
import { authClient, isAuthBackendConfigured } from "@/lib/auth-client";
import {
  getDashboardHomeByRole,
  getRoleBadgeVariant,
  getRoleLabel,
  getRoleNavLinks,
  normalizeUserRole,
} from "@/lib/roleNavigation";
import {
  clearAccessTokenCache,
  getAccessToken,
} from "@/lib/token-provider";
import {
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  refreshSession as refreshAuthSession,
  registerWithEmail,
} from "@/services/authService";

export const AuthContext = React.createContext(null);

export const AUTH_STATUS = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  EXPIRED: "expired",
  ERROR: "error",
};

export function AuthProvider({ children }) {
  const sessionState = authClient.useSession();

  const rawUser = sessionState.data?.user ?? null;
  const session = sessionState.data?.session ?? null;
  const hasActiveSession = Boolean(rawUser && session);
  const isLoading = Boolean(sessionState.isPending);
  const isRefetching = Boolean(sessionState.isRefetching);

  const [expiredSessionKey, setExpiredSessionKey] = React.useState("");
  const [tokenState, setTokenState] = React.useState({
    sessionKey: "",
    token: null,
  });

  const sessionIdentityKey = hasActiveSession
    ? String(session?.id || rawUser?.id || rawUser?.email || "active")
    : "";
  const sessionExpiresAt = session?.expiresAt ?? null;

  const isSessionExpired = Boolean(
    expiredSessionKey &&
      (expiredSessionKey === sessionIdentityKey || expiredSessionKey === "forced")
  );
  const isAuthenticated = hasActiveSession && !isSessionExpired;

  // Watch session expiration boundary automatically while session stays open.
  React.useEffect(() => {
    if (!hasActiveSession || !sessionExpiresAt) {
      return undefined;
    }

    const expMs = new Date(sessionExpiresAt).getTime();
    if (!Number.isFinite(expMs)) return undefined;

    const remainingMs = expMs - Date.now();
    if (remainingMs > 2_147_483_647) return undefined;

    const timer = setTimeout(() => {
      clearAccessTokenCache();
      setExpiredSessionKey(sessionIdentityKey || "forced");
    }, Math.max(0, remainingMs + 250));

    return () => clearTimeout(timer);
  }, [hasActiveSession, sessionExpiresAt, sessionIdentityKey]);

  // Listen to 401 session-expired signals from protected Express API requests.
  React.useEffect(() => {
    return subscribeAuthFailures((event) => {
      if (event?.type === "session_expired") {
        setTokenState({ sessionKey: "", token: null });
        setExpiredSessionKey("forced");
        if (typeof sessionState.refetch === "function") {
          sessionState.refetch().catch(() => null);
        }
      }
    });
  }, [sessionState]);

  React.useEffect(() => {
    let active = true;

    if (!sessionIdentityKey || isSessionExpired) {
      clearAccessTokenCache();
      return () => {
        active = false;
      };
    }

    getAccessToken().then((freshToken) => {
      if (!active) return;
      setTokenState({
        sessionKey: sessionIdentityKey,
        token: freshToken,
      });
    });

    return () => {
      active = false;
    };
  }, [isSessionExpired, sessionIdentityKey]);

  const authStatus = React.useMemo(() => {
    if (isLoading) return AUTH_STATUS.LOADING;
    if (isSessionExpired) return AUTH_STATUS.EXPIRED;
    if (isAuthenticated) return AUTH_STATUS.AUTHENTICATED;
    if (sessionState.error) return AUTH_STATUS.ERROR;
    return AUTH_STATUS.UNAUTHENTICATED;
  }, [isAuthenticated, isLoading, isSessionExpired, sessionState.error]);

  const token =
    isAuthenticated &&
    sessionIdentityKey &&
    tokenState.sessionKey === sessionIdentityKey
      ? tokenState.token
      : null;

  const role = React.useMemo(
    () => (rawUser && isAuthenticated ? normalizeUserRole(rawUser.role) : null),
    [isAuthenticated, rawUser]
  );

  const user = React.useMemo(() => {
    if (!rawUser || !isAuthenticated) return null;
    return {
      ...rawUser,
      role,
    };
  }, [isAuthenticated, rawUser, role]);

  const roleLabel = role ? getRoleLabel(role) : null;
  const roleBadgeVariant = role ? getRoleBadgeVariant(role) : "neutral";
  const dashboardHref = role ? getDashboardHomeByRole(role) : "/dashboard";
  const roleNavLinks = React.useMemo(
    () => (role ? getRoleNavLinks(role) : []),
    [role]
  );

  const getToken = React.useCallback(
    async ({ forceRefresh = false } = {}) => {
      if (!isAuthenticated || !sessionIdentityKey) {
        clearAccessTokenCache();
        return null;
      }

      const nextToken = await getAccessToken({ forceRefresh });
      setTokenState({
        sessionKey: sessionIdentityKey,
        token: nextToken,
      });
      return nextToken;
    },
    [isAuthenticated, sessionIdentityKey]
  );

  const login = React.useCallback(
    async (credentials) => {
      setExpiredSessionKey("");
      const result = await loginWithEmail(credentials);
      if (typeof sessionState.refetch === "function") {
        await sessionState.refetch().catch(() => null);
      }
      return result;
    },
    [sessionState]
  );

  const register = React.useCallback(
    async (payload) => {
      setExpiredSessionKey("");
      const result = await registerWithEmail(payload);
      if (typeof sessionState.refetch === "function") {
        await sessionState.refetch().catch(() => null);
      }
      return result;
    },
    [sessionState]
  );

  const startGoogleLogin = React.useCallback(async (options) => {
    setExpiredSessionKey("");
    return loginWithGoogle(options);
  }, []);

  const logout = React.useCallback(async () => {
    setExpiredSessionKey("");
    try {
      await logoutUser();
    } finally {
      setTokenState({ sessionKey: "", token: null });
      if (typeof sessionState.refetch === "function") {
        await sessionState.refetch().catch(() => null);
      }
    }
  }, [sessionState]);

  const refresh = React.useCallback(async () => {
    setExpiredSessionKey("");
    const data = await refreshAuthSession();
    if (typeof sessionState.refetch === "function") {
      await sessionState.refetch().catch(() => null);
    }
    return data;
  }, [sessionState]);

  const value = React.useMemo(
    () => ({
      user,
      session: isAuthenticated ? session : null,
      role,
      roleLabel,
      roleBadgeVariant,
      dashboardHref,
      roleNavLinks,
      token,
      authStatus,
      isSessionExpired,
      isAuthenticated,
      isLoading,
      isRefetching,
      isAuthConfigured: true,
      isBackendConfigured: isAuthBackendConfigured,
      error: sessionState.error || null,
      getToken,
      login,
      register,
      loginWithGoogle: startGoogleLogin,
      logout,
      refreshSession: refresh,
      retrySession: refresh,
    }),
    [
      authStatus,
      dashboardHref,
      getToken,
      isAuthenticated,
      isLoading,
      isRefetching,
      isSessionExpired,
      login,
      logout,
      refresh,
      register,
      role,
      roleBadgeVariant,
      roleLabel,
      roleNavLinks,
      session,
      sessionState.error,
      startGoogleLogin,
      token,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
