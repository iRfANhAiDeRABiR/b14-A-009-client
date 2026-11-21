"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export function RoleDashboardShell({ portalRole, children }) {
  return (
    <ProtectedRoute
      allowedRoles={[portalRole]}
      loadingFallback={<DashboardSkeleton />}
    >
      <DashboardLayout portalRole={portalRole}>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
