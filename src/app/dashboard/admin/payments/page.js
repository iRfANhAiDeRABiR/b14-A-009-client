import { Suspense } from "react";
import { AdminPaymentsView } from "@/components/admin/payments/AdminPaymentsView";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Payment History",
  description:
    "Review every customer payment across GearNest with booking, equipment, and Stripe transaction details.",
};

function PaymentsFallback() {
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

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<PaymentsFallback />}>
      <AdminPaymentsView />
    </Suspense>
  );
}
