"use client";

import * as React from "react";
import {
  AlertCircle,
  Calendar,
  ClipboardList,
  Eye,
  RefreshCw,
} from "lucide-react";

import { useMyBookings } from "@/hooks/useMyBookings";
import {
  formatBookingDuration,
  formatDisplayDate,
  getBookingStatusBadge,
  getPaymentStatusBadge,
} from "@/lib/customerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { BookingDetailsModal } from "@/components/customer/BookingDetailsModal";
import { BookingHistoryFilters } from "@/components/customer/BookingHistoryFilters";
import { BookingHistoryPagination } from "@/components/customer/BookingHistoryPagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function RentalsTableSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden rounded-2xl">
      <div className="divide-y divide-border">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-center gap-4 p-4 sm:px-6">
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MyRentalsTable() {
  const {
    filters,
    items,
    pagination,
    error,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
  } = useMyBookings();

  const [selectedBooking, setSelectedBooking] = React.useState(null);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">My Rental History</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Keep track of your equipment bookings, rental periods and payment information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={retry}
          >
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Refresh</span>
          </Button>
          <Button href="/equipment" variant="primary" size="sm">
            New Rental
          </Button>
        </div>
      </header>

      <BookingHistoryFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={loading}
      />

      {error && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={retry}>
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      {loading ? (
        <RentalsTableSkeleton />
      ) : items.length === 0 ? (
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <ClipboardList className="size-7" />
          </span>

          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            {hasActiveFilters
              ? "No bookings match your selected filters."
              : "No Rental History Yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {hasActiveFilters
              ? "Adjust your booking status, payment status, or search keyword to view other reservations."
              : "Your equipment bookings will appear here once you make your first reservation."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasActiveFilters ? (
              <Button variant="outline" size="md" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : null}
            <Button href="/equipment" variant="primary" size="md">
              Explore Equipment
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop / Tablet Data Table */}
          <Card padding="none" className="hidden overflow-hidden rounded-2xl md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    <th scope="col" className="px-5 py-3.5">
                      Equipment Name
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Rental Start Date
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Rental End Date
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Booking Date
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Total Amount
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Payment Status
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Booking Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {items.map((rental) => {
                    const paymentBadge = getPaymentStatusBadge(
                      rental.paymentStatus
                    );
                    const bookingBadge = getBookingStatusBadge(
                      rental.bookingStatus
                    );
                    const duration = formatBookingDuration(
                      rental.startDate,
                      rental.endDate,
                      rental.durationDays
                    );

                    return (
                      <tr
                        key={
                          rental._id ||
                          `${rental.equipment?.name}-${rental.startDate}`
                        }
                        className="transition-colors hover:bg-surface-subtle/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
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
                              <p className="font-heading font-semibold text-foreground">
                                {rental.equipment?.name}
                              </p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                                {rental.equipment?.category ? (
                                  <span>{rental.equipment.category}</span>
                                ) : null}
                                {rental.bookingReference ? (
                                  <span className="font-mono text-[11px] text-muted">
                                    #{rental.bookingReference}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          {formatDisplayDate(rental.startDate)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          <div>{formatDisplayDate(rental.endDate)}</div>
                          {duration !== "—" ? (
                            <div className="text-[11px] text-muted">
                              {duration}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          {formatDisplayDate(rental.createdAt)}
                        </td>
                        <td className="px-4 py-4 font-heading font-semibold whitespace-nowrap text-primary tabular-nums">
                          {formatCurrencyBDT(rental.totalAmount)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant={paymentBadge.variant} size="sm">
                            {paymentBadge.label}
                          </Badge>
                          {rental.transactionId ? (
                            <div
                              title={rental.transactionId}
                              className="mt-1 max-w-32 truncate font-mono text-[11px] text-muted"
                            >
                              Txn: {rental.transactionId}
                            </div>
                          ) : null}
                          {rental.paidAt ? (
                            <div className="mt-0.5 text-[11px] text-text-secondary">
                              {formatDisplayDate(rental.paidAt)}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant={bookingBadge.variant} dot size="sm">
                            {bookingBadge.label}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(rental)}
                            aria-label={`View booking details for ${rental.equipment?.name}`}
                          >
                            <Eye aria-hidden="true" className="size-3.5" />
                            <span>View Details</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <BookingHistoryPagination
              pagination={pagination}
              onPageChange={setPage}
            />
          </Card>

          {/* Mobile Stacked Cards */}
          <div className="space-y-3 md:hidden">
            {items.map((rental) => {
              const paymentBadge = getPaymentStatusBadge(rental.paymentStatus);
              const bookingBadge = getBookingStatusBadge(rental.bookingStatus);
              const duration = formatBookingDuration(
                rental.startDate,
                rental.endDate,
                rental.durationDays
              );

              return (
                <Card
                  key={
                    rental._id ||
                    `${rental.equipment?.name}-${rental.startDate}-mobile`
                  }
                  padding="md"
                  className="space-y-3.5 rounded-2xl"
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
                        className="size-12 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-heading text-sm font-bold text-foreground">
                          {rental.equipment?.name}
                        </p>
                        {rental.equipment?.category ? (
                          <p className="text-xs text-text-secondary">
                            {rental.equipment.category}
                          </p>
                        ) : null}
                        {rental.bookingReference ? (
                          <p className="font-mono text-[11px] text-muted">
                            #{rental.bookingReference}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <span className="shrink-0 font-heading text-base font-bold text-primary tabular-nums">
                      {formatCurrencyBDT(rental.totalAmount)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-3 text-xs">
                    <div>
                      <p className="text-muted">Rental Period</p>
                      <p className="mt-0.5 flex items-center gap-1 font-medium text-foreground">
                        <Calendar aria-hidden="true" className="size-3 text-primary" />
                        <span>
                          {formatDisplayDate(rental.startDate)} –{" "}
                          {formatDisplayDate(rental.endDate)}
                        </span>
                      </p>
                      {duration !== "—" ? (
                        <p className="text-[11px] text-text-secondary">
                          Duration: {duration}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <p className="text-muted">Booked On</p>
                      <p className="mt-0.5 font-medium text-foreground">
                        {formatDisplayDate(rental.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={paymentBadge.variant} size="sm">
                        {paymentBadge.label}
                      </Badge>
                      <Badge variant={bookingBadge.variant} dot size="sm">
                        {bookingBadge.label}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBooking(rental)}
                    >
                      <Eye aria-hidden="true" className="size-3.5" />
                      <span>View Details</span>
                    </Button>
                  </div>
                </Card>
              );
            })}

            {pagination.totalPages > 1 ? (
              <Card padding="none" className="overflow-hidden rounded-2xl">
                <BookingHistoryPagination
                  pagination={pagination}
                  onPageChange={setPage}
                />
              </Card>
            ) : null}
          </div>
        </div>
      )}

      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
