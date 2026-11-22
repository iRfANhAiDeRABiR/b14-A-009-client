"use client";

import { CheckCircle2, ClipboardList, Home } from "lucide-react";

import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function PaymentSuccess({ sessionData }) {
  return (
    <Card padding="lg" className="mx-auto max-w-2xl rounded-2xl">
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-2xl border border-success-border bg-success-bg text-success"
        >
          <CheckCircle2 className="size-8" />
        </span>

        <h1 className="type-page-title mt-5 text-foreground">
          Payment Successful!
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
          Your payment has been verified. Your rental booking is now updated.
        </p>
      </div>

      {sessionData ? (
        <div className="mt-6">
          <PaymentSummary sessionData={sessionData} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-5">
        <Button
          href="/dashboard/customer/my-rentals"
          variant="primary"
          size="md"
        >
          <ClipboardList aria-hidden="true" className="size-4" />
          <span>View My Rentals</span>
        </Button>

        <Button href="/" variant="outline" size="md">
          <Home aria-hidden="true" className="size-4" />
          <span>Back to Home</span>
        </Button>
      </div>
    </Card>
  );
}
