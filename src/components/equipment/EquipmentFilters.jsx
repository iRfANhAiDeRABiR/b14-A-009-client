"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { EQUIPMENT_CATEGORIES } from "@/data/equipmentCategories";
import { Button } from "@/components/ui/Button";

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

const AVAILABILITY_OPTIONS = [
  { value: "", label: "All Availability" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

const selectClassName =
  "min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const priceInputClassName =
  "min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function EquipmentFilters({
  filters,
  onUpdateFilters,
  onClearAll,
  hasActiveFilters,
  onAfterApply,
}) {
  const [minDraft, setMinDraft] = React.useState(null);
  const [maxDraft, setMaxDraft] = React.useState(null);
  const [priceError, setPriceError] = React.useState("");

  const minValue = minDraft !== null ? minDraft : filters.minPrice || "";
  const maxValue = maxDraft !== null ? maxDraft : filters.maxPrice || "";

  const handlePriceApply = (event) => {
    event.preventDefault();
    const trimmedMin = String(minValue).trim();
    const trimmedMax = String(maxValue).trim();

    if (trimmedMin !== "") {
      const parsedMin = Number(trimmedMin);
      if (Number.isNaN(parsedMin) || parsedMin < 0) {
        setPriceError("Minimum price must be a non-negative number.");
        return;
      }
    }

    if (trimmedMax !== "") {
      const parsedMax = Number(trimmedMax);
      if (Number.isNaN(parsedMax) || parsedMax < 0) {
        setPriceError("Maximum price must be a non-negative number.");
        return;
      }
    }

    if (
      trimmedMin !== "" &&
      trimmedMax !== "" &&
      Number(trimmedMin) > Number(trimmedMax)
    ) {
      setPriceError("Minimum price cannot exceed maximum price.");
      return;
    }

    setPriceError("");
    setMinDraft(null);
    setMaxDraft(null);
    onUpdateFilters({
      minPrice: trimmedMin,
      maxPrice: trimmedMax,
    });
    onAfterApply?.();
  };

  const handlePriceClear = () => {
    setMinDraft(null);
    setMaxDraft(null);
    setPriceError("");
    onUpdateFilters({ minPrice: "", maxPrice: "" });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
        {/* Category filter */}
        <div className="lg:col-span-3">
          <label
            htmlFor="filter-category"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-text-secondary uppercase"
          >
            Category
          </label>
          <select
            id="filter-category"
            name="category"
            value={filters.category}
            onChange={(event) => onUpdateFilters({ category: event.target.value })}
            className={selectClassName}
          >
            <option value="">All Categories</option>
            {EQUIPMENT_CATEGORIES.map((category) => (
              <option key={category.slug} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rental Type filter */}
        <div className="lg:col-span-2">
          <label
            htmlFor="filter-rental-type"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-text-secondary uppercase"
          >
            Rental Type
          </label>
          <select
            id="filter-rental-type"
            name="rentalType"
            value={filters.rentalType}
            onChange={(event) =>
              onUpdateFilters({ rentalType: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">All Rental Types</option>
            {RENTAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Availability filter */}
        <div className="lg:col-span-2">
          <label
            htmlFor="filter-availability"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-text-secondary uppercase"
          >
            Availability
          </label>
          <select
            id="filter-availability"
            name="availability"
            value={filters.availability}
            onChange={(event) =>
              onUpdateFilters({ availability: event.target.value })
            }
            className={selectClassName}
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price range filter */}
        <form
          onSubmit={handlePriceApply}
          className="sm:col-span-2 lg:col-span-5"
          noValidate
        >
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="block text-xs font-semibold tracking-wide text-text-secondary uppercase">
              Price Range (৳)
            </span>
            {filters.minPrice !== "" || filters.maxPrice !== "" ? (
              <button
                type="button"
                onClick={handlePriceClear}
                className="cursor-pointer text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Clear price
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <div>
                <label htmlFor="filter-min-price" className="sr-only">
                  Minimum price in Bangladeshi Taka
                </label>
                <input
                  id="filter-min-price"
                  name="minPrice"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={minValue}
                  onChange={(event) => {
                    setMinDraft(event.target.value);
                    if (priceError) setPriceError("");
                  }}
                  placeholder="Min ৳"
                  className={priceInputClassName}
                />
              </div>

              <div>
                <label htmlFor="filter-max-price" className="sr-only">
                  Maximum price in Bangladeshi Taka
                </label>
                <input
                  id="filter-max-price"
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={maxValue}
                  onChange={(event) => {
                    setMaxDraft(event.target.value);
                    if (priceError) setPriceError("");
                  }}
                  placeholder="Max ৳"
                  className={priceInputClassName}
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" size="md">
              Apply
            </Button>
          </div>
        </form>
      </div>

      {priceError ? (
        <p role="alert" className="text-xs font-medium text-danger">
          {priceError}
        </p>
      ) : null}

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMinDraft(null);
              setMaxDraft(null);
              setPriceError("");
              onClearAll();
              onAfterApply?.();
            }}
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            <span>Reset Filters</span>
          </Button>
          {onAfterApply ? (
            <Button variant="primary" size="sm" onClick={onAfterApply}>
              Done
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
