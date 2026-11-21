"use client";

import { Calculator } from "lucide-react";
import { formatCurrencyBDT } from "@/lib/rentalPricing";

export function RentalPriceCalculator({ estimate }) {
  const {
    unitPrice,
    rentalType,
    inclusiveDays,
    billableUnits,
    unitLabel,
    quantity,
    estimatedTotal,
    isValidRange,
  } = estimate;

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calculator aria-hidden="true" className="size-4 text-primary" />
          <h3 className="font-heading text-sm font-semibold text-foreground">
            Rental Price Breakdown
          </h3>
        </div>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
          {rentalType} Rate
        </span>
      </div>

      <dl className="mt-3 space-y-2 border-t border-border pt-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-secondary">Rate per {String(rentalType).toLowerCase()}</dt>
          <dd className="font-medium text-foreground tabular-nums">
            {formatCurrencyBDT(unitPrice)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-secondary">Total rental duration</dt>
          <dd className="font-medium text-foreground tabular-nums">
            {isValidRange
              ? `${inclusiveDays} ${inclusiveDays === 1 ? "day" : "days"} (${billableUnits} ${unitLabel})`
              : "Select valid dates"}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-secondary">Required quantity</dt>
          <dd className="font-medium text-foreground tabular-nums">
            {quantity > 0 ? `${quantity} ${quantity === 1 ? "unit" : "units"}` : "—"}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5">
          <dt className="font-heading text-sm font-bold text-foreground">
            Estimated Total
          </dt>
          <dd className="font-heading text-lg font-bold text-primary tabular-nums">
            {formatCurrencyBDT(estimatedTotal)}
          </dd>
        </div>
      </dl>

      <p className="mt-2.5 text-[11px] leading-relaxed text-text-secondary">
        Frontend estimate only. Final booking amount and taxes are independently
        calculated and verified by the server before Stripe checkout.
      </p>
    </div>
  );
}
