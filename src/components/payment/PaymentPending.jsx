"use client";

import { ArrowLeft, ClipboardList, CreditCard, XCircle } from "lucide-react";

import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { StripeTestCardBox } from "@/components/payment/StripeTestCardBox";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function PaymentPending({
  sessionData = null,
  loading = false,
  isRetryingCheckout = false,
  onRetryPayment,
}) {
  const equipmentHref = sessionData?.equipmentId
    ? `/equipment/${encodeURIComponent(sessionData.equipmentId)}`
    : "/equipment";

  const canLaunchRetry = Boolean(
    sessionData?.canRetryPayment &&
      sessionData?.bookingId &&
      typeof onRetryPayment === "function"
  );

  return (
    <Card padding="lg" className="mx-auto max-w-2xl rounded-2xl">
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-2xl border border-warning-border bg-warning-bg text-warning"
        >
          <XCircle className="size-8" />
        </span>

        <h1 className="type-page-title mt-5 text-foreground">
          Payment Not Completed
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
          Your checkout session was cancelled or the payment was not completed. You can return to your booking and try again if it is still eligible.
        </p>

        <p className="mt-2 max-w-md text-xs text-muted">
          Leaving Stripe Checkout does not mark your reservation as Cancelled on its own; booking eligibility and expiration remain governed by the backend.
        </p>
      </div>

      {sessionData ? (
        <div className="mt-6 space-y-4">
          {!loading ? <PaymentSummary sessionData={sessionData} /> : null}
          <StripeTestCardBox compact />
        </div>
      ) : (
        <div className="mt-6">
          <StripeTestCardBox compact />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-5">
        {canLaunchRetry ? (
          <Button
            variant="primary"
            size="md"
            loading={isRetryingCheckout}
            onClick={onRetryPayment}
          >
            <CreditCard aria-hidden="true" className="size-4" />
            <span>Retry Payment</span>
          </Button>
        ) : (
          <Button href={equipmentHref} variant="primary" size="md">
            <CreditCard aria-hidden="true" className="size-4" />
            <span>Retry Payment</span>
          </Button>
        )}

        <Button
          href="/dashboard/customer/my-rentals"
          variant="outline"
          size="md"
        >
          <ClipboardList aria-hidden="true" className="size-4" />
          <span>View My Rentals</span>
        </Button>

        <Button href={equipmentHref} variant="outline" size="md">
          <ArrowLeft aria-hidden="true" className="size-4" />
          <span>Return to Equipment</span>
        </Button>
      </div>
    </Card>
  );
}
