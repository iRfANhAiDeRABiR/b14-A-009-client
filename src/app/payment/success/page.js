import { Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PaymentSuccessView } from "@/components/payment/PaymentSuccessView";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Payment Verification",
  description:
    "Verify your Stripe Checkout transaction and inspect updated rental payment status on GearNest.",
};

function PaymentStatusFallback() {
  return (
    <Container className="py-12 sm:py-16">
      <Card padding="lg" className="mx-auto max-w-2xl space-y-4 rounded-2xl">
        <Skeleton className="mx-auto size-16 rounded-2xl" />
        <Skeleton className="mx-auto h-8 w-56" />
        <Skeleton className="mx-auto h-4 w-80 max-w-full" />
        <Skeleton className="h-36 w-full rounded-xl" />
      </Card>
    </Container>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentStatusFallback />}>
      <ProtectedRoute loadingFallback={<PaymentStatusFallback />}>
        <PaymentSuccessView />
      </ProtectedRoute>
    </Suspense>
  );
}
