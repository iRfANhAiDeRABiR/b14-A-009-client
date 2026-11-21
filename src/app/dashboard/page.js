import { Suspense } from "react";
import { DashboardIndexGuard } from "@/components/dashboard/DashboardIndexGuard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export const metadata = {
  title: "Dashboard",
  description: "GearNest role-aware account workspace router.",
};

export default function DashboardIndexPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardIndexGuard />
    </Suspense>
  );
}
