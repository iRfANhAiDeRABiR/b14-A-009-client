import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { RoleDashboardShell } from "@/components/dashboard/RoleDashboardShell";
import { USER_ROLES } from "@/lib/roleNavigation";

export default function CustomerDashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RoleDashboardShell portalRole={USER_ROLES.CUSTOMER}>
        {children}
      </RoleDashboardShell>
    </Suspense>
  );
}
