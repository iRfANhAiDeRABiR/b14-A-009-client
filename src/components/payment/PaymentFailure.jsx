"use client";

import { AlertCircle, ClipboardList, CreditCard, RefreshCw, ShieldAlert } from "lucide-react";

import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { StripeTestCardBox } from "@/components/payment/StripeTestCardBox";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function PaymentFailure({
  isInvalidSession = false,
  error = "",
  sessionData = null,
  hasLookupKey = false,
  isRetryingCheckout = false,
  onRetryPayment,
  onRefresh,
}) {
  return (
    <Card padding="lg" className="mx-auto max-w-2xl rounded-2xl">
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-2xl border border-danger-border bg-danger-bg text-danger"
        >
          {isInvalidSession ? (
            <ShieldAlert className="size-8" />
          ) : (
            <AlertCircle className="size-8" />
          )}
        </span>

        <h1 className="type-page-title mt-5 text-foreground">
          {isInvalidSession
            ? "Invalid Payment Session"
            : "Payment Could Not Be Confirmed"}
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
          {sessionData?.failureReason ||
            error ||
            (isInvalidSession
              ? "This checkout session reference is unrecognized, expired, or does not belong to your signed-in account."
              : "We could not verify a completed payment for this booking yet.")}
        </p>
      </div>

      {sessionData ? (
        <div className="mt-6 space-y-4">
          <PaymentSummary sessionData={sessionData} />
          {sessionData.canRetryPayment ? <StripeTestCardBox compact /> : null}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-5">
        {sessionData?.canRetryPayment && typeof onRetryPayment === "function" ? (
          <Button
            variant="primary"
            size="md"
            loading={isRetryingCheckout}
            onClick={onRetryPayment}
          >
            <CreditCard aria-hidden="true" className="size-4" />
            <span>Retry Payment</span>
          </Button>
        ) : null}

        {hasLookupKey && typeof onRefresh === "function" ? (
          <Button variant="outline" size="md" onClick={onRefresh}>
            <RefreshCw aria-hidden="true" className="size-4" />
            <span>Refresh Status</span>
          </Button>
        ) : null}

        <Button
          href="/dashboard/customer/my-rentals"
          variant="outline"
          size="md"
        >
          <ClipboardList aria-hidden="true" className="size-4" />
          <span>View My Rentals</span>
        </Button>

        <Button href="/equipment" variant="outline" size="md">
          Browse Equipment
        </Button>
      </div>
    </Card>
  );
}
