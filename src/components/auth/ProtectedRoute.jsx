"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, ShieldAlert } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { buildLoginRedirectUrl } from "@/lib/authValidation";
import {
  getRoleLabel,
  isRoleAllowed,
} from "@/lib/roleNavigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

function DefaultProtectedSkeleton() {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label="Verifying authentication session"
      className="py-14 sm:py-20"
    >
      <Container size="md">
        <Card padding="lg" className="space-y-4 rounded-2xl">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton variant="text" className="h-9 w-64" />
          <Skeleton variant="text" className="w-full max-w-md" />
          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        </Card>
      </Container>
    </section>
  );
}

/**
 * Private route guard wired to live Better Auth session state.
 * Never redirects while session loading is pending so authenticated refreshes
 * do not flash or bounce to /login.
 */
export function ProtectedRoute({
  allowedRoles = null,
  loadingFallback = null,
  children,
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { isAuthenticated, isLoading, role, dashboardHref } = useAuth();

  const redirectUrl = React.useMemo(() => {
    if (typeof window === "undefined") {
      return buildLoginRedirectUrl(pathname);
    }
    const destination = `${pathname}${window.location.search || ""}`;
    return buildLoginRedirectUrl(destination);
  }, [pathname]);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  if (isLoading || !isAuthenticated) {
    return loadingFallback || <DefaultProtectedSkeleton />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !isRoleAllowed(role, allowedRoles)) {
    return (
      <section className="py-16 sm:py-24">
        <Container size="sm">
          <Card padding="lg" className="rounded-2xl text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex size-14 items-center justify-center rounded-xl bg-warning-bg text-warning"
            >
              <ShieldAlert className="size-7" />
            </span>

            <h1 className="type-page-title mt-5 text-foreground">
              Role access restricted
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
              Your account is signed in with the{" "}
              <span className="font-semibold text-foreground">
                {getRoleLabel(role)}
              </span>{" "}
              role and does not have permission to view this portal section.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button href={dashboardHref} variant="primary" size="md">
                <LayoutDashboard aria-hidden="true" className="size-4" />
                <span>Go to My Dashboard</span>
              </Button>
              <Button href="/" variant="outline" size="md">
                <ArrowLeft aria-hidden="true" className="size-4" />
                <span>Back to Home</span>
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    );
  }

  return children;
}
