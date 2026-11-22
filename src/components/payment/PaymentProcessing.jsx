"use client";

import { Clock, Loader2, RefreshCw } from "lucide-react";

import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function PaymentProcessing({
  isInitialCheck = true,
  sessionData = null,
  pollAttempts = 0,
  maxPollAttempts = 5,
  pollingExhausted = false,
  onRefresh,
}) {
  return (
    <Card padding="lg" className="mx-auto max-w-2xl rounded-2xl">
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-2xl border border-warning-border bg-warning-bg text-warning"
        >
          {isInitialCheck ? (
            <Loader2 className="size-8 animate-spin" />
          ) : (
            <Clock className="size-8" />
          )}
        </span>

        <h1 className="type-page-title mt-5 text-foreground">
          Payment Processing
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
          {isInitialCheck
            ? "Verifying your Stripe Checkout session with our backend payment server..."
            : "Your payment is being confirmed."}
        </p>

        {!isInitialCheck ? (
          <p className="mt-2 max-w-md text-xs leading-relaxed text-text-secondary">
            {pollingExhausted
              ? "Webhook confirmation is taking slightly longer than usual. Use Refresh Status or check My Rentals shortly — we will only mark your booking Paid after Stripe webhook verification."
              : `Stripe webhook confirmation may take a few seconds (${pollAttempts + 1} of ${maxPollAttempts} checks).`}
          </p>
        ) : null}
      </div>

      {sessionData ? (
        <div className="mt-6">
          <PaymentSummary sessionData={sessionData} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-5">
        {typeof onRefresh === "function" ? (
          <Button
            variant="primary"
            size="md"
            disabled={isInitialCheck}
            onClick={onRefresh}
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-4 ${isInitialCheck ? "animate-spin" : ""}`}
            />
            <span>Refresh Status</span>
          </Button>
        ) : null}

        <Button
          href="/dashboard/customer/my-rentals"
          variant="outline"
          size="md"
        >
          View My Rentals
        </Button>
      </div>
    </Card>
  );
}
