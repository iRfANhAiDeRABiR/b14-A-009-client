"use client";

import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PAYMENT_VERIFICATION_STATES } from "@/lib/paymentUtils";
import { PaymentPending } from "@/components/payment/PaymentPending";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { Container } from "@/components/ui/Container";

export function PaymentCancelView() {
  const {
    loading,
    verificationState,
    sessionData,
    isRetryingCheckout,
    handleRetryPayment,
  } = usePaymentStatus({ mode: "cancel" });

  return (
    <Container className="py-12 sm:py-16">
      {verificationState === PAYMENT_VERIFICATION_STATES.CONFIRMED &&
      sessionData ? (
        <PaymentSuccess sessionData={sessionData} />
      ) : (
        <PaymentPending
          sessionData={sessionData}
          loading={loading}
          isRetryingCheckout={isRetryingCheckout}
          onRetryPayment={handleRetryPayment}
        />
      )}
    </Container>
  );
}
