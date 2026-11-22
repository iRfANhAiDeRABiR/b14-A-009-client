import { Suspense } from "react";
import { AdminEquipmentTable } from "@/components/admin/equipment/AdminEquipmentTable";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Equipment Management",
  description:
    "Review equipment submissions, manage marketplace listings and maintain platform quality.",
};

function AdminEquipmentPageFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
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
    </div>
  );
}

export default function AdminEquipmentPage() {
  return (
    <Suspense fallback={<AdminEquipmentPageFallback />}>
      <AdminEquipmentTable />
    </Suspense>
  );
}
