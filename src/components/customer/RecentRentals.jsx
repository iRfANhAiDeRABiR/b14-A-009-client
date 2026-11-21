"use client";

import Link from "next/link";
import { ArrowRight, Calendar, ClipboardList, ExternalLink } from "lucide-react";

import {
  formatDisplayDate,
  getBookingStatusBadge,
  getPaymentStatusBadge,
} from "@/lib/customerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function RecentRentals({ rentals = [], loading = false }) {
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
              <Skeleton className="size-14 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="flex flex-col justify-between rounded-2xl">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="type-card-title text-foreground">
              Recent Rental Activity
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              Your latest equipment booking records.
            </p>
          </div>
          <Button
            href="/dashboard/customer/my-rentals"
            variant="outline"
            size="sm"
          >
            <span>View All Rentals</span>
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
        </div>

        {rentals.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <ClipboardList className="size-6" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
              No rentals recorded yet
            </h3>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-text-secondary">
              Browse verified equipment listings to schedule your first rental reservation.
            </p>
            <Button href="/equipment" variant="primary" size="sm" className="mt-4">
              Explore Equipment
            </Button>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {rentals.map((rental) => {
              const payment = getPaymentStatusBadge(rental.paymentStatus);
              const booking = getBookingStatusBadge(rental.bookingStatus);
              const detailsHref = rental.equipment?._id
                ? `/equipment/${encodeURIComponent(rental.equipment._id)}`
                : "";

              return (
                <li
                  key={rental._id || `${rental.equipment?.name}-${rental.startDate}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rental.equipment?.image || "/images/hero-equipment.jpg"}
                      alt={rental.equipment?.name || "Equipment"}
                      className="size-14 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm font-semibold text-foreground">
                        {rental.equipment?.name}
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-text-secondary">
                        <Calendar aria-hidden="true" className="size-3.5 text-primary" />
                        <span>
                          {formatDisplayDate(rental.startDate)} –{" "}
                          {formatDisplayDate(rental.endDate)}
                        </span>
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge variant={payment.variant} size="sm">
                          Payment: {payment.label}
                        </Badge>
                        <Badge variant={booking.variant} dot size="sm">
                          {booking.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-heading text-sm font-bold text-primary tabular-nums">
                      {formatCurrencyBDT(rental.totalAmount)}
                    </span>
                    {detailsHref ? (
                      <Link
                        href={detailsHref}
                        aria-label={`View details for ${rental.equipment?.name}`}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span>View Details</span>
                        <ExternalLink aria-hidden="true" className="size-3" />
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
