"use client";

import * as React from "react";
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

export function AuthProvider({ children }) {
  const sessionState = authClient.useSession();

  const rawUser = sessionState.data?.user ?? null;
  const session = sessionState.data?.session ?? null;
  const isAuthenticated = Boolean(rawUser && session);
  const isLoading = Boolean(sessionState.isPending);
  const isRefetching = Boolean(sessionState.isRefetching);

  const sessionIdentityKey = isAuthenticated
    ? String(session?.id || rawUser?.id || rawUser?.email || "active")
    : "";

  const [tokenState, setTokenState] = React.useState({
    sessionKey: "",
    token: null,
  });

  React.useEffect(() => {
    let active = true;

    if (!sessionIdentityKey) {
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
  }, [sessionIdentityKey]);

  const token =
    sessionIdentityKey && tokenState.sessionKey === sessionIdentityKey
      ? tokenState.token
      : null;

  const role = React.useMemo(
    () => (rawUser ? normalizeUserRole(rawUser.role) : null),
    [rawUser]
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

  const login = React.useCallback(async (credentials) => {
    const result = await loginWithEmail(credentials);
    if (typeof sessionState.refetch === "function") {
      await sessionState.refetch().catch(() => null);
    }
    return result;
  }, [sessionState]);

  const register = React.useCallback(async (payload) => {
    const result = await registerWithEmail(payload);
    if (typeof sessionState.refetch === "function") {
      await sessionState.refetch().catch(() => null);
    }
    return result;
  }, [sessionState]);

  const startGoogleLogin = React.useCallback(async (options) => {
    return loginWithGoogle(options);
  }, []);

  const logout = React.useCallback(async () => {
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
    const data = await refreshAuthSession();
    if (typeof sessionState.refetch === "function") {
      await sessionState.refetch().catch(() => null);
    }
    return data;
  }, [sessionState]);

  const value = React.useMemo(
    () => ({
      user,
      session,
      role,
      roleLabel,
      roleBadgeVariant,
      dashboardHref,
      roleNavLinks,
      token,
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
    }),
    [
      dashboardHref,
      getToken,
      isAuthenticated,
      isLoading,
      isRefetching,
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
