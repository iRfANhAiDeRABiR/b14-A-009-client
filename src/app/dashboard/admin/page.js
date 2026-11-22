import { Suspense } from "react";
import { AdminAnalyticsOverview } from "@/components/admin/AdminAnalyticsOverview";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Platform Overview",
  description:
    "Monitor marketplace performance, manage platform activity and gain insights into GearNest's overall business operations.",
};

function AdminOverviewFallback() {
  return (
    <div className="space-y-6">
      <Card padding="lg" className="rounded-2xl">
        <div className="flex items-start gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7].map((card) => (
          <Card key={card} padding="md" className="rounded-2xl">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-36" />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card padding="lg" className="rounded-2xl">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="mt-6 h-56 w-full rounded-xl" />
        </Card>
        <Card padding="lg" className="rounded-2xl">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="mt-6 h-56 w-full rounded-xl" />
        </Card>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<AdminOverviewFallback />}>
      <AdminAnalyticsOverview />
    </Suspense>
  );
}
