import { Suspense } from "react";

import { EquipmentDetails } from "@/components/equipment/EquipmentDetails";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Equipment Details",
  description:
    "Inspect full equipment specifications, owner details, rental terms, favorites, and reservation calculator on GearNest.",
};

function EquipmentDetailsFallback() {
  return (
    <section className="py-12">
      <Container>
        <Skeleton variant="text" className="mb-6 w-48" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </Container>
    </section>
  );
}

async function EquipmentDetailsLoader({ params }) {
  const { id } = await params;
  return <EquipmentDetails equipmentId={id} />;
}

export default function EquipmentDetailsPage({ params }) {
  return (
    <Suspense fallback={<EquipmentDetailsFallback />}>
      <EquipmentDetailsLoader params={params} />
    </Suspense>
  );
}
