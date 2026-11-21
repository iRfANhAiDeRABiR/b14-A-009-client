import { Suspense } from "react";
import { DashboardRouteSkeleton } from "@/components/auth/AuthSkeletons";
import { DashboardIndexClient } from "@/components/auth/RoleDashboardRoute";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardIndexPage() {
  return (
    <Suspense fallback={<DashboardRouteSkeleton />}>
      <DashboardIndexClient />
    </Suspense>
  );
}
