import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading GearNest dashboard"
      className="flex min-h-dvh bg-background"
    >
      {/* Desktop Sidebar Skeleton */}
      <aside
        aria-hidden="true"
        className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface p-5 lg:flex xl:w-72"
      >
        <div className="flex items-center gap-3 pb-6">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-6 w-28" />
        </div>
        <Skeleton className="mb-6 h-7 w-32 rounded-full" />

        <div className="space-y-2.5">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="mt-auto border-t border-border pt-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </aside>

      {/* Main Column Skeleton */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          aria-hidden="true"
          className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:h-20 sm:px-6 lg:px-8"
        >
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
            <Skeleton className="hidden h-9 w-24 rounded-lg sm:block" />
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <Card padding="lg" className="space-y-4 rounded-2xl">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton variant="text" className="h-9 w-72 max-w-full" />
              <Skeleton variant="text" className="w-full max-w-lg" />
              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-28 w-full rounded-xl" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
