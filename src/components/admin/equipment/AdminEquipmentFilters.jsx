"use client";

import { ArrowUpDown, Filter, RotateCcw, X } from "lucide-react";

import {
  ADMIN_EQUIPMENT_SORT_OPTIONS,
  ALLOWED_EQUIPMENT_CATEGORIES,
  OWNER_EQUIPMENT_STATUS_OPTIONS,
} from "@/lib/adminUtils";
import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function AdminEquipmentFilters({
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
  if (filters.category !== "all") {
    activeChips.push({
      key: "category",
      label: `Category: ${filters.category}`,
      onRemove: () => onUpdateFilters({ category: "all" }),
    });
  }
  if (filters.status !== "all") {
    activeChips.push({
      key: "status",
      label: `Status: ${filters.status}`,
      onRemove: () => onUpdateFilters({ status: "all" }),
    });
  }
  if (filters.sort !== "newest") {
    const sortLabel =
      ADMIN_EQUIPMENT_SORT_OPTIONS.find((opt) => opt.value === filters.sort)
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
          id="admin-equipment-search"
          value={filters.search}
          onSearchChange={(search) => onUpdateFilters({ search })}
          placeholder="Search equipment or owner name..."
          ariaLabel="Search marketplace equipment"
          srLabel="Search equipment listings by equipment name or owner name"
          clearLabel="Clear equipment search"
          debounceMs={350}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
          <div className="relative">
            <label htmlFor="admin-equipment-category" className="sr-only">
              Filter by category
            </label>
            <Filter
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            />
            <select
              id="admin-equipment-category"
              value={filters.category}
              disabled={disabled}
              onChange={(e) => onUpdateFilters({ category: e.target.value })}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 lg:w-52"
            >
              <option value="all">All Categories</option>
              {ALLOWED_EQUIPMENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label htmlFor="admin-equipment-sort" className="sr-only">
              Sort equipment listings
            </label>
            <ArrowUpDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            />
            <select
              id="admin-equipment-sort"
              value={filters.sort}
              disabled={disabled}
              onChange={(e) => onUpdateFilters({ sort: e.target.value })}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 lg:w-52"
            >
              {ADMIN_EQUIPMENT_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
        <div
          role="group"
          aria-label="Filter equipment by approval status"
          className="flex flex-wrap items-center gap-2"
        >
          {OWNER_EQUIPMENT_STATUS_OPTIONS.map((option) => {
            const active = filters.status === option.value;
            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onUpdateFilters({ status: option.value })}
                className={cn(
                  "inline-flex min-h-9 cursor-pointer items-center rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters ? (
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={onClearFilters}
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            <span>Clear Filters</span>
          </Button>
        ) : null}
      </div>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 pt-1">
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
      ) : null}
    </Card>
  );
}
