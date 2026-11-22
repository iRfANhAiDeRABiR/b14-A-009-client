import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EquipmentDetailsLoading() {
  return (
    <Container className="py-10 sm:py-14">
      <Skeleton className="h-5 w-44" />

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card padding="sm" className="rounded-2xl">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          </Card>
          <Card padding="lg" className="space-y-3 rounded-2xl">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card padding="lg" className="space-y-4 rounded-2xl">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-9 w-4/5" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </Card>
        </div>
      </div>
    </Container>
  );
}
