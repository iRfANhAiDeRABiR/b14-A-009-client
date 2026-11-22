"use client";

import * as React from "react";
import {
  AlertCircle,
  Boxes,
  Calendar,
  ClipboardList,
  Eye,
  RefreshCw,
  ShieldAlert,
  User,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useOwnerRentals } from "@/hooks/useOwnerRentals";
import {
  formatBookingDuration,
  formatDisplayDate,
} from "@/lib/ownerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { OwnerRentalDetailsModal } from "@/components/owner/OwnerRentalDetailsModal";
import { OwnerRentalFilters } from "@/components/owner/OwnerRentalFilters";
import { OwnerRentalOverview } from "@/components/owner/OwnerRentalOverview";
import { OwnerRentalPagination } from "@/components/owner/OwnerRentalPagination";
import { OwnerRentalStatusBadge } from "@/components/owner/OwnerRentalStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const noopSubscribe = () => () => {};
let cachedFormattedDate = "";

function getClientFormattedDate() {
  if (!cachedFormattedDate) {
    cachedFormattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date());
  }
  return cachedFormattedDate;
}

function RentalsTableSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden rounded-2xl">
      <div className="divide-y divide-border">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-center gap-4 p-4 sm:px-6">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
            <Skeleton className="hidden h-6 w-20 rounded-full md:block" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function OwnerRentalTable() {
  const { user, roleLabel, roleBadgeVariant } = useAuth();
  const {
    filters,
    items,
    stats,
    pagination,
    equipmentOptions,
    error,
    errorStatus,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
  } = useOwnerRentals();

  const [selectedRental, setSelectedRental] = React.useState(null);

  const formattedDate = React.useSyncExternalStore(
    noopSubscribe,
    getClientFormattedDate,
    () => ""
  );

  const ownerName = user?.name || user?.email || "Equipment Owner";
  const isAuthError = errorStatus === 401 || errorStatus === 403;

  return (
    <div className="space-y-6">
      {/* Professional Owner Rentals Header */}
      <Card padding="lg" className="rounded-2xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            {user?.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.image}
                alt={`${ownerName} avatar`}
                className="size-14 shrink-0 rounded-full border border-border bg-surface-subtle object-cover sm:size-16"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-16"
              >
                <User className="size-7" />
              </span>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={roleBadgeVariant || "warning"} dot size="sm">
                  {roleLabel || "Owner"} Portal
                </Badge>

                {formattedDate ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                    <Calendar
                      aria-hidden="true"
                      className="size-3.5 text-primary"
                    />
                    <span>{formattedDate}</span>
                  </span>
                ) : null}

                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-text-secondary">
                  <User aria-hidden="true" className="size-3 text-primary" />
                  <span>Owner: {ownerName}</span>
                </span>

                {!loading && !error ? (
                  <span
                    role="status"
                    aria-atomic="true"
                    className="inline-flex items-center rounded-full border border-primary/20 bg-secondary px-2.5 py-0.5 text-xs font-medium text-primary tabular-nums"
                  >
                    {pagination.totalItems}{" "}
                    {pagination.totalItems === 1
                      ? "matching booking"
                      : "matching bookings"}
                  </span>
                ) : null}
              </div>

              <h1 className="type-page-title mt-3 text-foreground">
                My Equipment Rentals
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                Monitor customer bookings, track rental activity and keep your equipment rental business organized.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 lg:shrink-0">
            <Button
              variant="outline"
              size="md"
              disabled={loading}
              onClick={retry}
            >
              <RefreshCw
                aria-hidden="true"
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>

            <Button
              href="/dashboard/owner/my-equipment"
              variant="primary"
              size="md"
            >
              <Boxes aria-hidden="true" className="size-4" />
              <span>Manage My Equipment</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Four Rental Summary Cards */}
      <OwnerRentalOverview stats={stats} loading={loading} />

      {/* Search, Status, Equipment & Sort Controls */}
      <OwnerRentalFilters
        filters={filters}
        equipmentOptions={equipmentOptions}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={loading}
      />

      {/* Error Banner (401 / 403 / 503 / Network) */}
      {error && !loading ? (
        <div
          role="alert"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            isAuthError
              ? "border-danger-border bg-danger-bg text-danger"
              : "border-warning-border bg-warning-bg text-warning"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isAuthError ? (
              <ShieldAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            ) : (
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            )}
            <span>{error}</span>
          </div>

          <div className="flex items-center gap-2">
            {errorStatus === 401 ? (
              <Button href="/login?callbackURL=%2Fdashboard%2Fowner%2Frentals" variant="outline" size="sm">
                Sign In
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={retry}>
              <RefreshCw aria-hidden="true" className="size-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      ) : null}

      {/* Main Content Area: Loading / Empty / Data Table & Mobile Cards */}
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
              ? "No rentals match your selected filters."
              : "No Rental Bookings Yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {hasActiveFilters
              ? "Adjust your customer or equipment search, booking status, payment status, or equipment filter to inspect other records."
              : "Rental bookings for your equipment will appear here when customers start booking."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasActiveFilters ? (
              <Button variant="outline" size="md" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : null}
            <Button
              href="/dashboard/owner/my-equipment"
              variant="primary"
              size="md"
            >
              <Boxes aria-hidden="true" className="size-4" />
              <span>Manage My Equipment</span>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Responsive Data Table */}
          <Card
            padding="none"
            className="hidden overflow-hidden rounded-2xl md:block"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    <th scope="col" className="px-5 py-3.5">
                      Customer Information
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Equipment Information
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Rental Duration
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Required Quantity
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Booking Amount
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
                    const duration = formatBookingDuration(
                      rental.startDate,
                      rental.endDate,
                      rental.durationDays
                    );

                    return (
                      <tr
                        key={
                          rental._id ||
                          `${rental.equipment?._id}-${rental.startDate}-${rental.customer?.name}`
                        }
                        className="transition-colors hover:bg-surface-subtle/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {rental.customer?.photoURL ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={rental.customer.photoURL}
                                alt={rental.customer.name || "Customer avatar"}
                                className="size-10 shrink-0 rounded-full border border-border bg-surface-subtle object-cover"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
                              >
                                <User className="size-4" />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-heading font-semibold text-foreground">
                                {rental.customer?.name || "Verified Customer"}
                              </p>
                              {rental.customer?.email ? (
                                <p className="truncate text-xs text-text-secondary">
                                  {rental.customer.email}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
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
                              <p className="truncate font-heading font-semibold text-foreground">
                                {rental.equipment?.name}
                              </p>
                              {rental.equipment?.category ? (
                                <p className="truncate text-xs text-text-secondary">
                                  {rental.equipment.category}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          <div className="font-medium text-foreground">
                            {formatDisplayDate(rental.startDate)} &ndash;{" "}
                            {formatDisplayDate(rental.endDate)}
                          </div>
                          {duration !== "—" ? (
                            <div className="text-xs text-muted">{duration}</div>
                          ) : null}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap font-medium text-foreground tabular-nums">
                          {rental.quantity !== null
                            ? `${rental.quantity} ${
                                rental.quantity === 1 ? "unit" : "units"
                              }`
                            : "—"}
                        </td>

                        <td className="px-4 py-4 font-heading font-semibold whitespace-nowrap text-primary tabular-nums">
                          {formatCurrencyBDT(rental.totalAmount)}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <OwnerRentalStatusBadge
                            kind="payment"
                            status={rental.paymentStatus}
                            size="sm"
                          />
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <OwnerRentalStatusBadge
                            kind="booking"
                            status={rental.bookingStatus}
                            size="sm"
                          />
                        </td>

                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRental(rental)}
                            aria-label={`View rental details for ${rental.equipment?.name}`}
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

            <OwnerRentalPagination
              pagination={pagination}
              onPageChange={setPage}
            />
          </Card>

          {/* Mobile Stacked Cards */}
          <div className="space-y-3 md:hidden">
            {items.map((rental) => {
              const duration = formatBookingDuration(
                rental.startDate,
                rental.endDate,
                rental.durationDays
              );

              return (
                <Card
                  key={
                    rental._id ||
                    `${rental.equipment?._id}-${rental.startDate}-mobile`
                  }
                  padding="md"
                  className="space-y-3.5 rounded-2xl"
                >
                  {/* Equipment & Total */}
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
                          <p className="truncate text-xs text-text-secondary">
                            {rental.equipment.category}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <span className="shrink-0 font-heading text-base font-bold text-primary tabular-nums">
                      {formatCurrencyBDT(rental.totalAmount)}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-2.5">
                    {rental.customer?.photoURL ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={rental.customer.photoURL}
                        alt={rental.customer.name || "Customer avatar"}
                        className="size-9 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
                      >
                        <User className="size-4" />
                      </span>
                    )}
                    <div className="min-w-0 text-xs">
                      <p className="truncate font-semibold text-foreground">
                        {rental.customer?.name || "Verified Customer"}
                      </p>
                      {rental.customer?.email ? (
                        <p className="truncate text-text-secondary">
                          {rental.customer.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Duration & Quantity */}
                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-3 text-xs">
                    <div>
                      <p className="text-muted">Rental Duration</p>
                      <p className="mt-0.5 font-medium text-foreground">
                        {formatDisplayDate(rental.startDate)} &ndash;{" "}
                        {formatDisplayDate(rental.endDate)}
                      </p>
                      {duration !== "—" ? (
                        <p className="text-[11px] text-text-secondary">
                          {duration}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-muted">Required Quantity</p>
                      <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                        {rental.quantity !== null
                          ? `${rental.quantity} ${
                              rental.quantity === 1 ? "unit" : "units"
                            }`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Distinct Payment Status & Booking Status + Action */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <OwnerRentalStatusBadge
                        kind="payment"
                        status={rental.paymentStatus}
                        size="sm"
                      />
                      <OwnerRentalStatusBadge
                        kind="booking"
                        status={rental.bookingStatus}
                        size="sm"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRental(rental)}
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
                <OwnerRentalPagination
                  pagination={pagination}
                  onPageChange={setPage}
                />
              </Card>
            ) : null}
          </div>
        </div>
      )}

      <OwnerRentalDetailsModal
        rental={selectedRental}
        onClose={() => setSelectedRental(null)}
      />
    </div>
  );
}
