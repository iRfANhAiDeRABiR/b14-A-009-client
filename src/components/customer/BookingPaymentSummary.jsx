"use client";

import { CreditCard } from "lucide-react";

import {
  formatDisplayDate,
  getPaymentStatusBadge,
} from "@/lib/customerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Badge } from "@/components/ui/Badge";

export function BookingPaymentSummary({ booking }) {
  if (!booking) return null;

  const paymentBadge = getPaymentStatusBadge(booking.paymentStatus);

  return (
    <section
      aria-labelledby="payment-summary-heading"
      className="rounded-xl border border-border bg-background p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <CreditCard aria-hidden="true" className="size-4 text-primary" />
          <h3
            id="payment-summary-heading"
            className="font-heading text-sm font-semibold text-foreground"
          >
            Payment Information
          </h3>
        </div>
        <Badge variant={paymentBadge.variant} size="sm">
          {paymentBadge.label}
        </Badge>
      </div>

      <dl className="mt-3 grid gap-2.5 text-xs sm:grid-cols-2 sm:text-sm">
        {booking.rentalPrice !== null ? (
          <div>
            <dt className="text-text-secondary">Unit Rental Rate</dt>
            <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
              {formatCurrencyBDT(booking.rentalPrice)}
              {booking.rentalType ? ` / ${booking.rentalType}` : ""}
            </dd>
          </div>
        ) : null}

        <div>
          <dt className="text-text-secondary">Total Rental Amount</dt>
          <dd className="mt-0.5 font-heading text-base font-bold text-primary tabular-nums">
            {formatCurrencyBDT(booking.totalAmount)}
          </dd>
        </div>

        {booking.transactionId ? (
          <div className="sm:col-span-2">
            <dt className="text-text-secondary">Transaction Reference</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
              {booking.transactionId}
            </dd>
          </div>
        ) : null}

        {booking.paidAt ? (
          <div>
            <dt className="text-text-secondary">Payment Date</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {formatDisplayDate(booking.paidAt)}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
