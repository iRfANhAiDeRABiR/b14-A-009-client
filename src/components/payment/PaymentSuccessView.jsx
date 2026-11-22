"use client";

import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PAYMENT_VERIFICATION_STATES } from "@/lib/paymentUtils";
import { PaymentFailure } from "@/components/payment/PaymentFailure";
import { PaymentProcessing } from "@/components/payment/PaymentProcessing";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { Container } from "@/components/ui/Container";

export function PaymentSuccessView() {
  const {
    hasLookupKey,
    loading,
    verificationState,
    sessionData,
    error,
    pollAttempts,
    maxPollAttempts,
    pollingExhausted,
    isRetryingCheckout,
    retryVerification,
    handleRetryPayment,
  } = usePaymentStatus({ mode: "verify" });

  return (
    <Container className="py-12 sm:py-16">
      {verificationState === PAYMENT_VERIFICATION_STATES.VERIFYING ||
      verificationState === PAYMENT_VERIFICATION_STATES.PROCESSING ? (
        <PaymentProcessing
          isInitialCheck={
            loading && verificationState === PAYMENT_VERIFICATION_STATES.VERIFYING
          }
          sessionData={sessionData}
          pollAttempts={pollAttempts}
          maxPollAttempts={maxPollAttempts}
          pollingExhausted={pollingExhausted}
          onRefresh={retryVerification}
        />
      ) : verificationState === PAYMENT_VERIFICATION_STATES.CONFIRMED ? (
        <PaymentSuccess sessionData={sessionData} />
      ) : (
        <PaymentFailure
          isInvalidSession={
            verificationState === PAYMENT_VERIFICATION_STATES.INVALID
          }
          error={error}
          sessionData={sessionData}
          hasLookupKey={hasLookupKey}
          isRetryingCheckout={isRetryingCheckout}
          onRetryPayment={handleRetryPayment}
          onRefresh={retryVerification}
        />
      )}
    </Container>
  );
}
