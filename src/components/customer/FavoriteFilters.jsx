"use client";

import { ArrowUpDown, Filter, RotateCcw } from "lucide-react";

import { EQUIPMENT_CATEGORIES } from "@/data/equipmentCategories";
import { FAVORITE_SORT_OPTIONS } from "@/lib/customerUtils";
import { FavoriteSearch } from "@/components/customer/FavoriteSearch";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function FavoriteFilters({
  search = "",
  category = "all",
  sort = "recent",
  availableCategories = [],
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters = false,
  disabled = false,
}) {
  const categoryOptions = Array.from(
    new Set([
      ...EQUIPMENT_CATEGORIES.map((cat) => cat.name),
      ...availableCategories.filter(
        (cat) => cat && cat !== "Removed Listing" && cat !== "Equipment"
      ),
    ])
  );

  return (
    <Card padding="md" className="space-y-3.5 rounded-2xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <FavoriteSearch value={search} onSearchChange={onSearchChange} />

        <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
          <div className="relative">
            <label htmlFor="favorites-category-filter" className="sr-only">
              Filter by category
            </label>
            <Filter
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            />
            <select
              id="favorites-category-filter"
              value={category}
              disabled={disabled}
              onChange={(event) => onCategoryChange(event.target.value)}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 lg:w-52"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label htmlFor="favorites-sort-select" className="sr-only">
              Sort saved favorites
            </label>
            <ArrowUpDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            />
            <select
              id="favorites-sort-select"
              value={sort}
              disabled={disabled}
              onChange={(event) => onSortChange(event.target.value)}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 lg:w-56"
            >
              {FAVORITE_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
      </div>
    </Card>
  );
}
