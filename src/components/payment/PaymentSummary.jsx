"use client";

import { Calendar, CreditCard, Package, Receipt } from "lucide-react";

import { getBookingStatusBadge } from "@/lib/customerUtils";
import { formatBookingDuration, formatDisplayDate } from "@/lib/paymentUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { PaymentStatusBadge } from "@/components/payment/PaymentStatusBadge";
import { Badge } from "@/components/ui/Badge";

export function PaymentSummary({ sessionData }) {
  if (!sessionData) return null;

  const duration =
    sessionData.durationLabel ||
    formatBookingDuration(
      sessionData.startDate,
      sessionData.endDate,
      sessionData.durationDays
    );

  const bookingBadge = sessionData.bookingStatus
    ? getBookingStatusBadge(sessionData.bookingStatus)
    : null;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4 sm:p-5">
      {sessionData.equipmentName ? (
        <div className="flex items-center gap-3.5 border-b border-border pb-4">
          {sessionData.equipmentImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={sessionData.equipmentImage}
              alt={sessionData.equipmentName}
              className="size-14 shrink-0 rounded-xl border border-border bg-surface-subtle object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <Package className="size-6" />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-text-secondary">
              Reserved Equipment
            </p>
            <h3 className="truncate font-heading text-base font-bold text-foreground">
              {sessionData.equipmentName}
            </h3>
          </div>
        </div>
      ) : null}

      <dl className="grid gap-3.5 text-xs sm:grid-cols-2 sm:text-sm">
        {sessionData.bookingReference ? (
          <div>
            <dt className="flex items-center gap-1.5 text-text-secondary">
              <Receipt aria-hidden="true" className="size-3.5 text-primary" />
              <span>Booking Reference</span>
            </dt>
            <dd className="mt-0.5 break-all font-mono text-xs font-semibold text-foreground">
              #{sessionData.bookingReference}
            </dd>
          </div>
        ) : null}

        {sessionData.startDate || sessionData.endDate ? (
          <div>
            <dt className="flex items-center gap-1.5 text-text-secondary">
              <Calendar aria-hidden="true" className="size-3.5 text-primary" />
              <span>Rental Dates</span>
            </dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {formatDisplayDate(sessionData.startDate)} &ndash;{" "}
              {formatDisplayDate(sessionData.endDate)}
              {duration && duration !== "—" ? (
                <span className="ml-1.5 text-xs text-text-secondary">
                  ({duration})
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}

        {sessionData.quantity !== null ? (
          <div>
            <dt className="text-text-secondary">Quantity</dt>
            <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
              {sessionData.quantity}{" "}
              {sessionData.quantity === 1 ? "unit" : "units"}
            </dd>
          </div>
        ) : null}

        {sessionData.totalAmount !== null ? (
          <div>
            <dt className="text-text-secondary">Total Amount</dt>
            <dd className="mt-0.5 font-heading text-base font-bold text-primary tabular-nums">
              {formatCurrencyBDT(sessionData.totalAmount)}
            </dd>
          </div>
        ) : null}

        <div>
          <dt className="flex items-center gap-1.5 text-text-secondary">
            <CreditCard aria-hidden="true" className="size-3.5 text-primary" />
            <span>Payment Status</span>
          </dt>
          <dd className="mt-1">
            <PaymentStatusBadge status={sessionData.paymentStatus} size="sm" />
          </dd>
        </div>

        {bookingBadge ? (
          <div>
            <dt className="text-text-secondary">Booking Status</dt>
            <dd className="mt-1">
              <Badge variant={bookingBadge.variant} dot size="sm">
                {bookingBadge.label}
              </Badge>
            </dd>
          </div>
        ) : null}

        {sessionData.transactionId ? (
          <div className="sm:col-span-2">
            <dt className="text-text-secondary">Transaction Reference</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
              {sessionData.transactionId}
            </dd>
          </div>
        ) : null}

        {sessionData.paidAt ? (
          <div>
            <dt className="text-text-secondary">Payment Date</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {formatDisplayDate(sessionData.paidAt)}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
