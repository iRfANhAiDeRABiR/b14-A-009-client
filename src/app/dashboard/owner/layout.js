import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { RoleDashboardShell } from "@/components/dashboard/RoleDashboardShell";
import { USER_ROLES } from "@/lib/roleNavigation";

export default function OwnerDashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RoleDashboardShell portalRole={USER_ROLES.OWNER}>
        {children}
      </RoleDashboardShell>
    </Suspense>
  );
}
