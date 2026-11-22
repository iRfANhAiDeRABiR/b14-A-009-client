"use client";

import { ArrowUpDown, RotateCcw, X } from "lucide-react";

import { ADMIN_RENTAL_SORT_OPTIONS } from "@/lib/adminUtils";
import { BookingStatusFilter } from "@/components/customer/BookingStatusFilter";
import { PaymentStatusFilter } from "@/components/customer/PaymentStatusFilter";
import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function RentalFilters({
  filters,
  onUpdateFilters,
  onClearFilters,
  hasActiveFilters = false,
  disabled = false,
}) {
  const activeChips = [];
  if (filters.search) {
    activeChips.push({
      key: "search",
      label: `Search: "${filters.search}"`,
      onRemove: () => onUpdateFilters({ search: "" }),
    });
  }
  if (filters.bookingStatus !== "all") {
    activeChips.push({
      key: "bookingStatus",
      label: `Booking: ${filters.bookingStatus}`,
      onRemove: () => onUpdateFilters({ bookingStatus: "all" }),
    });
  }
  if (filters.paymentStatus !== "all") {
    activeChips.push({
      key: "paymentStatus",
      label: `Payment: ${filters.paymentStatus}`,
      onRemove: () => onUpdateFilters({ paymentStatus: "all" }),
    });
  }
  if (filters.sort !== "newest") {
    const sortLabel =
      ADMIN_RENTAL_SORT_OPTIONS.find((opt) => opt.value === filters.sort)
        ?.label || filters.sort;
    activeChips.push({
      key: "sort",
      label: `Sort: ${sortLabel}`,
      onRemove: () => onUpdateFilters({ sort: "newest" }),
    });
  }

  return (
    <Card padding="md" className="space-y-4 rounded-2xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <EquipmentSearch
          id="admin-rentals-search"
          value={filters.search}
          onSearchChange={(search) => onUpdateFilters({ search })}
          placeholder="Search by booking ID, customer, owner, or equipment..."
          ariaLabel="Search marketplace rentals"
          srLabel="Search rentals by booking ID, customer name, owner name, or equipment name"
          clearLabel="Clear rental search"
          debounceMs={350}
        />

        <div className="relative">
          <label htmlFor="admin-rentals-sort" className="sr-only">
            Sort rentals
          </label>
          <ArrowUpDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
          />
          <select
            id="admin-rentals-sort"
            value={filters.sort}
            disabled={disabled}
            onChange={(e) => onUpdateFilters({ sort: e.target.value })}
            className="min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 lg:w-64"
          >
            {ADMIN_RENTAL_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 border-t border-border pt-4 lg:grid-cols-2">
        <BookingStatusFilter
          selectedStatus={filters.bookingStatus}
          onSelectStatus={(bookingStatus) =>
            onUpdateFilters({ bookingStatus })
          }
          disabled={disabled}
        />

        <PaymentStatusFilter
          selectedStatus={filters.paymentStatus}
          onSelectStatus={(paymentStatus) =>
            onUpdateFilters({ paymentStatus })
          }
          disabled={disabled}
        />
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                disabled={disabled}
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.label}`}
                className="inline-flex min-h-7 cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-[#CCE0D1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{chip.label}</span>
                <X aria-hidden="true" className="size-3" />
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={onClearFilters}
            className="shrink-0"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            <span>Clear Filters</span>
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
