"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleDashboardPortal } from "@/components/auth/RoleDashboardPortal";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardHomeByRole } from "@/lib/roleNavigation";

function DashboardRedirectInner() {
  const router = useRouter();
  const { role } = useAuth();

  React.useEffect(() => {
    router.replace(getDashboardHomeByRole(role));
  }, [role, router]);

  return null;
}

export function DashboardIndexClient() {
  return (
    <ProtectedRoute>
      <DashboardRedirectInner />
    </ProtectedRoute>
  );
}

export function RoleDashboardRouteClient({ portalRole }) {
  const pathname = usePathname() || `/dashboard/${portalRole}`;

  return (
    <ProtectedRoute allowedRoles={[portalRole]}>
      <RoleDashboardPortal portalRole={portalRole} activePath={pathname} />
    </ProtectedRoute>
  );
}
