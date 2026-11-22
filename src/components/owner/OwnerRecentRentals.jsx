"use client";

import { ArrowRight, Calendar, ClipboardList } from "lucide-react";

import {
  formatDisplayDate,
  getBookingStatusBadge,
  getPaymentStatusBadge,
} from "@/lib/ownerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function OwnerRecentRentals({ rentals = [], loading = false }) {
  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3.5 rounded-xl border border-border p-3.5"
            >
              <Skeleton className="size-11 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const safeRentals = Array.isArray(rentals) ? rentals : [];

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="type-card-title text-foreground">
            Recent Rental Activity
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Latest bookings requested against your owned equipment listings.
          </p>
        </div>

        <Button href="/dashboard/owner/rentals" variant="outline" size="sm">
          <span>View All Rentals</span>
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Button>
      </div>

      {safeRentals.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <ClipboardList className="size-6" />
          </span>
          <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
            No rental activity yet
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
            Customer reservations for your approved fleet items will appear here as soon as bookings are created.
          </p>
        </div>
      ) : (
        <>
          {/* Compact Desktop Table */}
          <div className="mt-5 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <th scope="col" className="px-4 py-3">
                    Equipment
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Customer
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Duration
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Qty
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Payment
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Booking Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {safeRentals.map((rental) => {
                  const paymentBadge = getPaymentStatusBadge(
                    rental.paymentStatus
                  );
                  const bookingBadge = getBookingStatusBadge(
                    rental.bookingStatus
                  );

                  return (
                    <tr
                      key={rental._id}
                      className="transition-colors hover:bg-surface-subtle/70"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              rental.equipment?.image ||
                              "/images/hero-equipment.jpg"
                            }
                            alt={rental.equipment?.name || "Equipment"}
                            className="size-10 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                          />
                          <p className="truncate font-heading font-semibold text-foreground">
                            {rental.equipment?.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-text-secondary">
                        {rental.customerName || "Verified Customer"}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-text-secondary">
                        <div>
                          {rental.startDate && rental.endDate
                            ? `${formatDisplayDate(rental.startDate)} – ${formatDisplayDate(rental.endDate)}`
                            : rental.durationLabel}
                        </div>
                        {rental.startDate &&
                        rental.endDate &&
                        rental.durationLabel !== "—" ? (
                          <div className="text-[11px] text-muted">
                            {rental.durationLabel}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-foreground tabular-nums">
                        {rental.quantity !== null ? rental.quantity : "—"}
                      </td>
                      <td className="px-4 py-3.5 font-heading font-semibold whitespace-nowrap text-primary tabular-nums">
                        {formatCurrencyBDT(rental.bookingAmount)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge variant={paymentBadge.variant} size="sm">
                          {paymentBadge.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge variant={bookingBadge.variant} dot size="sm">
                          {bookingBadge.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="mt-5 space-y-3 md:hidden">
            {safeRentals.map((rental) => {
              const paymentBadge = getPaymentStatusBadge(rental.paymentStatus);
              const bookingBadge = getBookingStatusBadge(rental.bookingStatus);

              return (
                <div
                  key={rental._id}
                  className="space-y-3 rounded-xl border border-border bg-background p-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          rental.equipment?.image ||
                          "/images/hero-equipment.jpg"
                        }
                        alt={rental.equipment?.name || "Equipment"}
                        className="size-11 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-heading text-sm font-semibold text-foreground">
                          {rental.equipment?.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {rental.customerName || "Verified Customer"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 font-heading text-sm font-bold text-primary tabular-nums">
                      {formatCurrencyBDT(rental.bookingAmount)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <Calendar aria-hidden="true" className="size-3.5 text-primary" />
                      <span>
                        {rental.durationLabel !== "—"
                          ? rental.durationLabel
                          : `${formatDisplayDate(rental.startDate)} – ${formatDisplayDate(rental.endDate)}`}
                      </span>
                    </span>
                    {rental.quantity !== null ? (
                      <span className="tabular-nums">
                        Qty: {rental.quantity}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-1.5 border-t border-border pt-2.5">
                    <Badge variant={paymentBadge.variant} size="sm">
                      Payment: {paymentBadge.label}
                    </Badge>
                    <Badge variant={bookingBadge.variant} dot size="sm">
                      {bookingBadge.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}
