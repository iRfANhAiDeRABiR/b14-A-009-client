import { Suspense } from "react";
import { DashboardRouteSkeleton } from "@/components/auth/AuthSkeletons";
import { RoleDashboardRouteClient } from "@/components/auth/RoleDashboardRoute";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardRouteSkeleton />}>
      <RoleDashboardRouteClient portalRole={USER_ROLES.ADMIN} />
    </Suspense>
  );
}
