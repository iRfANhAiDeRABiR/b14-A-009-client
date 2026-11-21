"use client";

import { RotateCcw } from "lucide-react";

import { BookingSearch } from "@/components/customer/BookingSearch";
import { BookingStatusFilter } from "@/components/customer/BookingStatusFilter";
import { PaymentStatusFilter } from "@/components/customer/PaymentStatusFilter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function BookingHistoryFilters({
  filters,
  onUpdateFilters,
  onClearFilters,
  hasActiveFilters = false,
  disabled = false,
}) {
  return (
    <Card padding="md" className="space-y-4 rounded-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BookingSearch
          value={filters.search}
          onSearchChange={(search) => onUpdateFilters({ search })}
        />

        {hasActiveFilters ? (
          <Button
            variant="outline"
            size="md"
            disabled={disabled}
            onClick={onClearFilters}
            className="shrink-0"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            <span>Clear Filters</span>
          </Button>
        ) : null}
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
    </Card>
  );
}
