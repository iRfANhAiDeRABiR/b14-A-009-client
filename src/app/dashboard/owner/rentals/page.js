import { Suspense } from "react";
import { OwnerRentalTable } from "@/components/owner/OwnerRentalTable";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "My Equipment Rentals",
  description:
    "Monitor customer bookings, track rental activity and keep your equipment rental business organized.",
};

function OwnerRentalsPageFallback() {
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((card) => (
          <Card key={card} padding="md" className="rounded-2xl">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-8 w-16" />
          </Card>
        ))}
      </div>

      <Card padding="md" className="space-y-4 rounded-2xl">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </Card>

      <Card padding="lg" className="space-y-3 rounded-2xl">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </Card>
    </div>
  );
}

export default function OwnerRentalsPage() {
  return (
    <Suspense fallback={<OwnerRentalsPageFallback />}>
      <OwnerRentalTable />
    </Suspense>
  );
}
