import { Suspense } from "react";
import { EditEquipmentForm } from "@/components/owner/EditEquipmentForm";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Update Equipment",
  description:
    "Update equipment specifications, pricing, stock availability, and hosted photos on GearNest.",
};

function EditEquipmentFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card padding="lg" className="space-y-4 rounded-2xl">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
          </Card>
        </div>
        <div className="lg:col-span-5">
          <Card padding="lg" className="rounded-2xl">
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}

async function EditEquipmentLoader({ params }) {
  const { id } = await params;
  return <EditEquipmentForm equipmentId={id} />;
}

export default function OwnerEditEquipmentPage({ params }) {
  return (
    <Suspense fallback={<EditEquipmentFallback />}>
      <EditEquipmentLoader params={params} />
    </Suspense>
  );
}
