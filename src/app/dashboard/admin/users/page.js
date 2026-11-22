import { Suspense } from "react";
import { AdminUsersTable } from "@/components/admin/users/AdminUsersTable";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "User Management",
  description:
    "Manage registered users, monitor account information and control platform access.",
};

function AdminUsersPageFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Card padding="md" className="space-y-4 rounded-2xl">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </Card>
      <Card padding="lg" className="space-y-3 rounded-2xl">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </Card>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<AdminUsersPageFallback />}>
      <AdminUsersTable />
    </Suspense>
  );
}
