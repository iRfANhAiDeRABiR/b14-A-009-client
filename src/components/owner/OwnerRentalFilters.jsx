"use client";

import { ArrowUpDown, Boxes, RotateCcw, X } from "lucide-react";

import { OWNER_RENTAL_SORT_OPTIONS } from "@/lib/ownerUtils";
import { BookingStatusFilter } from "@/components/customer/BookingStatusFilter";
import { PaymentStatusFilter } from "@/components/customer/PaymentStatusFilter";
import { OwnerRentalSearch } from "@/components/owner/OwnerRentalSearch";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function OwnerRentalFilters({
  filters,
  equipmentOptions = [],
  onUpdateFilters,
  onClearFilters,
  hasActiveFilters = false,
  disabled = false,
}) {
  const selectedEquipment = equipmentOptions.find(
    (item) => String(item._id) === String(filters.equipmentId)
  );

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
  if (filters.equipmentId !== "all") {
    activeChips.push({
      key: "equipmentId",
      label: `Equipment: ${selectedEquipment?.name || filters.equipmentId}`,
      onRemove: () => onUpdateFilters({ equipmentId: "all" }),
    });
  }
  if (filters.sort !== "newest") {
    const sortLabel =
      OWNER_RENTAL_SORT_OPTIONS.find((opt) => opt.value === filters.sort)
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
        <OwnerRentalSearch
          value={filters.search}
          onSearchChange={(search) => onUpdateFilters({ search })}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
          <div className="relative">
            <label htmlFor="owner-rental-equipment-filter" className="sr-only">
              Filter by equipment
            </label>
            <Boxes
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            />
            <select
              id="owner-rental-equipment-filter"
              value={filters.equipmentId}
              disabled={disabled}
              onChange={(e) => onUpdateFilters({ equipmentId: e.target.value })}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 lg:w-56"
            >
              <option value="all">All Equipment</option>
              {equipmentOptions.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
              {filters.equipmentId !== "all" && !selectedEquipment ? (
                <option value={filters.equipmentId}>
                  Selected Listing ({filters.equipmentId})
                </option>
              ) : null}
            </select>
          </div>

          <div className="relative">
            <label htmlFor="owner-rental-sort" className="sr-only">
              Sort rental bookings
            </label>
            <ArrowUpDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            />
            <select
              id="owner-rental-sort"
              value={filters.sort}
              disabled={disabled}
              onChange={(e) => onUpdateFilters({ sort: e.target.value })}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 lg:w-60"
            >
              {OWNER_RENTAL_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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
                className="inline-flex min-h-7 cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-secondary px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <span>Clear All Filters</span>
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
