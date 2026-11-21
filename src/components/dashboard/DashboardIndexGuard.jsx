"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardHomeByRole } from "@/lib/roleNavigation";

export function DashboardRoleRedirectClient() {
  const router = useRouter();
  const { role } = useAuth();

  React.useEffect(() => {
    if (role) {
      router.replace(getDashboardHomeByRole(role));
    }
  }, [role, router]);

  return <DashboardSkeleton />;
}

export function DashboardIndexGuard() {
  return (
    <ProtectedRoute loadingFallback={<DashboardSkeleton />}>
      <DashboardRoleRedirectClient />
    </ProtectedRoute>
  );
}
