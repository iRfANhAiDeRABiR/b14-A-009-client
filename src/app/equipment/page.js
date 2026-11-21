import { Suspense } from "react";

import { EquipmentDirectory } from "@/components/equipment/EquipmentDirectory";
import { EquipmentLoading } from "@/components/equipment/EquipmentLoading";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "All Equipment",
  description:
    "Browse approved construction, photography, agriculture, vehicle, electronics, and event rental equipment on GearNest.",
};

function EquipmentPageSkeleton() {
  return (
    <section className="py-12">
      <Container>
        <div className="mb-8 max-w-2xl space-y-3">
          <div className="h-4 w-44 animate-pulse rounded bg-border/80" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-border/80" />
          <div className="h-5 w-full animate-pulse rounded bg-border/80" />
        </div>
        <EquipmentLoading count={9} />
      </Container>
    </section>
  );
}

export default function EquipmentPage() {
  return (
    <Suspense fallback={<EquipmentPageSkeleton />}>
      <EquipmentDirectory />
    </Suspense>
  );
}
