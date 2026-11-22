import { Suspense } from "react";
import { MyEquipmentTable } from "@/components/owner/MyEquipmentTable";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "My Equipment",
  description:
    "Manage your equipment listings, update rental information and monitor approval status.",
};

function MyEquipmentFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((idx) => (
          <Card key={idx} padding="md" className="rounded-2xl">
            <Skeleton className="h-16 w-full" />
          </Card>
        ))}
      </div>
      <Card padding="md" className="rounded-2xl">
        <Skeleton className="h-24 w-full" />
      </Card>
    </div>
  );
}

export default function OwnerMyEquipmentPage() {
  return (
    <Suspense fallback={<MyEquipmentFallback />}>
      <MyEquipmentTable />
    </Suspense>
  );
}
