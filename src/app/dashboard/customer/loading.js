import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function PortalWorkspaceLoadingSkeleton({ cardCount = 4 }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading workspace content"
      className="space-y-6"
    >
      <Card padding="lg" className="rounded-2xl">
        <div className="space-y-2.5">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cardCount }, (_, idx) => (
          <Card key={idx} padding="md" className="rounded-2xl">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-36" />
          </Card>
        ))}
      </div>

      <Card padding="lg" className="space-y-3 rounded-2xl">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </Card>
    </div>
  );
}

export default function CustomerWorkspaceLoading() {
  return <PortalWorkspaceLoadingSkeleton cardCount={4} />;
}
