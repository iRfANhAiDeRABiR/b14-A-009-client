import { Suspense } from "react";
import { AdminInquiriesView } from "@/components/admin/inquiries/AdminInquiriesView";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Support Inquiries",
  description:
    "Manage customer and owner support messages submitted through the GearNest contact form.",
};

function InquiriesFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Card padding="lg" className="space-y-3 rounded-2xl">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </Card>
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={<InquiriesFallback />}>
      <AdminInquiriesView />
    </Suspense>
  );
}
