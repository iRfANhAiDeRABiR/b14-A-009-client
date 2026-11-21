import { Suspense } from "react";
import { DashboardRouteSkeleton } from "@/components/auth/AuthSkeletons";
import { RoleDashboardRouteClient } from "@/components/auth/RoleDashboardRoute";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Customer Dashboard",
};

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<DashboardRouteSkeleton />}>
      <RoleDashboardRouteClient portalRole={USER_ROLES.CUSTOMER} />
    </Suspense>
  );
}
