import { Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PaymentCancelView } from "@/components/payment/PaymentCancelView";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Payment Not Completed",
  description:
    "Your Stripe Checkout session was not completed. Review your booking eligibility or return to GearNest.",
};

function PaymentCancelFallback() {
  return (
    <Container className="py-12 sm:py-16">
      <Card padding="lg" className="mx-auto max-w-2xl space-y-4 rounded-2xl">
        <Skeleton className="mx-auto size-16 rounded-2xl" />
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-80 max-w-full" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </Card>
    </Container>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<PaymentCancelFallback />}>
      <ProtectedRoute loadingFallback={<PaymentCancelFallback />}>
        <PaymentCancelView />
      </ProtectedRoute>
    </Suspense>
  );
}
