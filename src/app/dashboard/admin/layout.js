import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { RoleDashboardShell } from "@/components/dashboard/RoleDashboardShell";
import { USER_ROLES } from "@/lib/roleNavigation";

export default function AdminDashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RoleDashboardShell portalRole={USER_ROLES.ADMIN}>
        {children}
      </RoleDashboardShell>
    </Suspense>
  );
}
