import { Suspense } from "react";
import { AdminEventLogView } from "@/components/admin/logs/AdminEventLogView";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Event Log",
  description:
    "Inspect persistent administrative audit events across GearNest users, equipment, rentals, and support inquiries.",
};

function EventLogFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Card padding="lg" className="space-y-3 rounded-2xl">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </Card>
    </div>
  );
}

export default function AdminEventLogPage() {
  return (
    <Suspense fallback={<EventLogFallback />}>
      <AdminEventLogView />
    </Suspense>
  );
}
