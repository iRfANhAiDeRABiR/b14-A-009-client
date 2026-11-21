import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function AuthPageSkeleton() {
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <div className="grid overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-12">
          <div className="bg-primary/90 p-8 lg:col-span-5">
            <Skeleton className="h-6 w-36 bg-white/15" />
            <Skeleton className="mt-5 h-9 w-4/5 bg-white/15" />
            <Skeleton className="mt-3 h-20 w-full bg-white/15" />
          </div>
          <div className="p-8 lg:col-span-7">
            <div className="mx-auto max-w-md space-y-4">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
