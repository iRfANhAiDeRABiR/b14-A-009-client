import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EquipmentCatalogLoading() {
  return (
    <Container className="py-10 sm:py-14">
      <div className="space-y-3">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <Card padding="md" className="mt-8 space-y-4 rounded-2xl">
        <div className="grid gap-3 md:grid-cols-4">
          <Skeleton className="h-11 w-full rounded-lg md:col-span-2" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </Card>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <Card key={idx} padding="none" className="overflow-hidden rounded-2xl">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
