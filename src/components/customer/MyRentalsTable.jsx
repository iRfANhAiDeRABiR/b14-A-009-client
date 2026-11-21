"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  formatDisplayDate,
  getBookingStatusBadge,
  getPaymentStatusBadge,
} from "@/lib/customerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { getMyRentals } from "@/services/bookingService";
import { RentalFilters } from "@/components/customer/RentalFilters";
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
  const { token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [refreshTick, setRefreshTick] = React.useState(0);

  const requestKey = `${statusFilter}|${page}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    error: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getMyRentals({
      status: statusFilter,
      page,
      limit: 10,
      token,
    })
      .then((result) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          items: result.items || [],
          pagination: result.pagination || {
            page,
            limit: 10,
            total: (result.items || []).length,
            totalPages: 1,
          },
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState((prev) => ({
          ...prev,
          loadedKey: requestKey,
          items: [],
          error:
            error instanceof Error
              ? error.message
              : "Unable to load your rental bookings.",
        }));
      });

    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated, page, requestKey, statusFilter, token]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;

  const handleSelectFilter = (nextStatus) => {
    setStatusFilter(nextStatus);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">My Rentals</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Track and manage all your equipment rental bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => setRefreshTick((prev) => prev + 1)}
          >
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Refresh</span>
          </Button>
          <Button href="/equipment" variant="primary" size="sm">
            New Rental
          </Button>
        </div>
      </header>

      <RentalFilters
        selectedStatus={statusFilter}
        onSelectStatus={handleSelectFilter}
        disabled={loading}
      />

      {state.error && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{state.error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshTick((prev) => prev + 1)}
          >
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      {loading ? (
        <RentalsTableSkeleton />
      ) : state.items.length === 0 ? (
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <ClipboardList className="size-7" />
          </span>
          <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
            {statusFilter === "all"
              ? "No rentals recorded yet"
              : `No ${statusFilter} bookings found`}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-text-secondary">
            {statusFilter === "all"
              ? "When you reserve equipment from GearNest, your payment and rental status updates will appear here."
              : "Try switching back to All Bookings or browse available equipment for a new rental."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {statusFilter !== "all" ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => handleSelectFilter("all")}
              >
                Show All Bookings
              </Button>
            ) : null}
            <Button href="/equipment" variant="primary" size="md">
              Explore Equipment
            </Button>
          </div>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
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
                {state.items.map((rental) => {
                  const paymentBadge = getPaymentStatusBadge(
                    rental.paymentStatus
                  );
                  const bookingBadge = getBookingStatusBadge(
                    rental.bookingStatus
                  );
                  const detailsHref = rental.equipment?._id
                    ? `/equipment/${encodeURIComponent(rental.equipment._id)}`
                    : "";

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
                            {rental.equipment?.category ? (
                              <p className="text-xs text-text-secondary">
                                {rental.equipment.category}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                        {formatDisplayDate(rental.startDate)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                        {formatDisplayDate(rental.endDate)}
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
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={bookingBadge.variant} dot size="sm">
                          {bookingBadge.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {detailsHref ? (
                          <Link
                            href={detailsHref}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span>View Details</span>
                            <ExternalLink
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          </Link>
                        ) : (
                          <span className="text-xs text-muted">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {state.pagination.totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-5 py-3 text-xs text-text-secondary">
              <span>
                Page{" "}
                <strong className="font-semibold text-foreground">
                  {state.pagination.page}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-foreground">
                  {state.pagination.totalPages}
                </strong>{" "}
                ({state.pagination.total} bookings)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= state.pagination.totalPages}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(state.pagination.totalPages, p + 1)
                    )
                  }
                >
                  <span>Next</span>
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}
