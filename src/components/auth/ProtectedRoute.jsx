"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { AUTH_STATUS } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { buildLoginRedirectUrl } from "@/lib/authValidation";
import { getRoleLabel, isRoleAllowed } from "@/lib/roleNavigation";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { SessionErrorState } from "@/components/auth/SessionStatusState";
import { Unauthorized403State } from "@/components/auth/Unauthorized403State";

/**
 * Private route & role boundary wired to live Better Auth session verification.
 * Never trusts cookie presence alone and never redirects during initial session loading.
 */
export function ProtectedRoute({
  allowedRoles = null,
  loadingFallback = null,
  children,
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { showToast } = useToast();
  const {
    authStatus,
    isAuthenticated,
    isLoading,
    role,
    dashboardHref,
    error,
    retrySession,
    logout,
  } = useAuth();

  const notifiedForbiddenRef = React.useRef("");
  const notifiedExpiredRef = React.useRef(false);

  const destinationPath = React.useMemo(() => {
    if (typeof window === "undefined") {
      return pathname;
    }
    return `${pathname}${window.location.search || ""}`;
  }, [pathname]);

  const unauthenticatedLoginUrl = React.useMemo(
    () => buildLoginRedirectUrl(destinationPath),
    [destinationPath]
  );

  const expiredLoginUrl = React.useMemo(
    () => buildLoginRedirectUrl(destinationPath, { reason: "session_expired" }),
    [destinationPath]
  );

  const isRoleAuthorized =
    !Array.isArray(allowedRoles) ||
    allowedRoles.length === 0 ||
    isRoleAllowed(role, allowedRoles);

  React.useEffect(() => {
    if (isLoading) return;

    if (authStatus === AUTH_STATUS.EXPIRED) {
      if (!notifiedExpiredRef.current) {
        notifiedExpiredRef.current = true;
        showToast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "warning",
        });
      }
      router.replace(expiredLoginUrl);
      return;
    }

    if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
      router.replace(unauthenticatedLoginUrl);
    }
  }, [
    authStatus,
    expiredLoginUrl,
    isLoading,
    router,
    showToast,
    unauthenticatedLoginUrl,
  ]);

  React.useEffect(() => {
    if (isLoading || !isAuthenticated || isRoleAuthorized) {
      notifiedForbiddenRef.current = "";
      return;
    }

    const forbiddenKey = `${role}|${pathname}`;
    if (notifiedForbiddenRef.current !== forbiddenKey) {
      notifiedForbiddenRef.current = forbiddenKey;
      showToast({
        title: "Access restricted (403)",
        description: `Signed in as ${getRoleLabel(role)}. This section belongs to another role.`,
        variant: "warning",
      });
    }
  }, [isAuthenticated, isLoading, isRoleAuthorized, pathname, role, showToast]);

  if (isLoading) {
    return loadingFallback || <DashboardSkeleton />;
  }

  if (authStatus === AUTH_STATUS.ERROR && !isAuthenticated) {
    return (
      <SessionErrorState
        errorDetail={error?.message || ""}
        onRetry={retrySession}
        loginHref={unauthenticatedLoginUrl}
      />
    );
  }

  if (!isAuthenticated) {
    return loadingFallback || <DashboardSkeleton />;
  }

  if (!isRoleAuthorized) {
    return (
      <Unauthorized403State
        currentRole={role}
        allowedRoles={allowedRoles}
        dashboardHref={dashboardHref}
        onLogout={async () => {
          await logout();
          router.replace(unauthenticatedLoginUrl);
        }}
      />
    );
  }

  return children;
}
