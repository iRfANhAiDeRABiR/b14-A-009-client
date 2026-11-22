"use client";

import * as React from "react";
import {
  AlertCircle,
  ClipboardList,
  Download,
  Eye,
  RefreshCw,
  ShieldAlert,
  Store,
  User,
} from "lucide-react";

import { useAdminRentals } from "@/hooks/useAdminRentals";
import {
  formatBookingDuration,
  formatDisplayDate,
} from "@/lib/adminUtils";
import { downloadCsv } from "@/lib/csvExport";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { AdminRentalDetailsModal } from "@/components/admin/rentals/AdminRentalDetailsModal";
import { RentalFilters } from "@/components/admin/rentals/RentalFilters";
import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";
import { OwnerRentalStatusBadge } from "@/components/owner/OwnerRentalStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function AdminRentalsSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden rounded-2xl">
      <div className="divide-y divide-border">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-center gap-4 p-4 sm:px-6">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AdminRentalsTable() {
  const {
    filters,
    items,
    pagination,
    error,
    errorStatus,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
  } = useAdminRentals();

  const [selectedRental, setSelectedRental] = React.useState(null);
  const isAuthError = errorStatus === 401 || errorStatus === 403;

  const handleExportCsv = () => {
    downloadCsv(
      `gearnest-rentals-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        { header: "Booking ID", key: "_id" },
        { header: "Equipment", accessor: (r) => r.equipment?.name || "" },
        { header: "Customer", accessor: (r) => r.customer?.name || "" },
        { header: "Owner", accessor: (r) => r.owner?.name || "" },
        { header: "Start Date", key: "startDate" },
        { header: "End Date", key: "endDate" },
        { header: "Total Amount", key: "totalAmount" },
        { header: "Payment Status", key: "paymentStatus" },
        { header: "Booking Status", key: "bookingStatus" },
      ],
      items
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">Rental Management</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Monitor all marketplace rental activities, review booking information and track payment and rental status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!loading && !error ? (
            <span
              role="status"
              aria-atomic="true"
              className="inline-flex items-center rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-semibold text-primary tabular-nums"
            >
              {pagination.totalItems}{" "}
              {pagination.totalItems === 1 ? "rental record" : "rental records"}
            </span>
          ) : null}

          <Button
            variant="outline"
            size="md"
            disabled={loading || items.length === 0}
            onClick={handleExportCsv}
          >
            <Download aria-hidden="true" className="size-4" />
            <span>Export CSV</span>
          </Button>

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
        </div>
      </header>

      <RentalFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={loading}
      />

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
              <Button
                href="/login?callbackURL=%2Fdashboard%2Fadmin%2Frentals"
                variant="outline"
                size="sm"
              >
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

      {loading ? (
        <AdminRentalsSkeleton />
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
              : "No rental records found"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {hasActiveFilters
              ? "Adjust your search query or status filters to inspect other marketplace bookings."
              : "Platform rental bookings recorded by the backend will display here."}
          </p>

          {hasActiveFilters ? (
            <div className="mt-6">
              <Button variant="outline" size="md" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : null}
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Platform Rentals Table */}
          <Card
            padding="none"
            className="hidden overflow-hidden rounded-2xl md:block"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    <th scope="col" className="px-5 py-3.5">
                      Customer Information
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Owner Information
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Equipment
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Rental Duration
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
                                alt={rental.customer.name}
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
                            <div className="min-w-0">
                              <p className="max-w-40 truncate font-heading font-semibold text-foreground">
                                {rental.customer?.name || "Verified Customer"}
                              </p>
                              {rental.customer?.email ? (
                                <p className="max-w-44 truncate text-xs text-text-secondary">
                                  {rental.customer.email}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            {rental.owner?.photoURL ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={rental.owner.photoURL}
                                alt={rental.owner.name}
                                className="size-9 shrink-0 rounded-full border border-border object-cover"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning-bg text-warning"
                              >
                                <Store className="size-4" />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="max-w-40 truncate font-medium text-foreground">
                                {rental.owner?.name || "Listing Owner"}
                              </p>
                              {rental.owner?.email ? (
                                <p className="max-w-44 truncate text-xs text-text-secondary">
                                  {rental.owner.email}
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
                              <p className="max-w-44 truncate font-heading font-semibold text-foreground">
                                {rental.equipment?.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-2 text-xs text-text-secondary">
                                {rental.quantity !== null ? (
                                  <span>
                                    {rental.quantity}{" "}
                                    {rental.quantity === 1 ? "unit" : "units"}
                                  </span>
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
                          <div className="font-medium text-foreground">
                            {formatDisplayDate(rental.startDate)} &ndash;{" "}
                            {formatDisplayDate(rental.endDate)}
                          </div>
                          <div className="text-xs text-muted">
                            {duration !== "—" ? `${duration}` : ""}
                            {rental.createdAt
                              ? `${duration !== "—" ? " · " : ""}Booked ${formatDisplayDate(rental.createdAt)}`
                              : ""}
                          </div>
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

            <EquipmentPagination
              pagination={pagination}
              onPageChange={setPage}
              itemLabel="rental records"
              ariaLabel="Admin rentals pagination"
              className="border-t border-border bg-background px-5 py-4"
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
                  className="space-y-3 rounded-2xl"
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
                      <p className="text-muted">Customer</p>
                      <p className="mt-0.5 truncate font-semibold text-foreground">
                        {rental.customer?.name || "Verified Customer"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Owner</p>
                      <p className="mt-0.5 truncate font-semibold text-foreground">
                        {rental.owner?.name || "Listing Owner"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Duration</p>
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
                      <p className="text-muted">Quantity</p>
                      <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                        {rental.quantity !== null
                          ? `${rental.quantity} ${
                              rental.quantity === 1 ? "unit" : "units"
                            }`
                          : "—"}
                      </p>
                    </div>
                  </div>

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
                <EquipmentPagination
                  pagination={pagination}
                  onPageChange={setPage}
                  itemLabel="rental records"
                  ariaLabel="Admin rentals pagination"
                  className="px-4 py-4"
                />
              </Card>
            ) : null}
          </div>
        </div>
      )}

      <AdminRentalDetailsModal
        rental={selectedRental}
        onUpdated={retry}
        onClose={() => setSelectedRental(null)}
      />
    </div>
  );
}
