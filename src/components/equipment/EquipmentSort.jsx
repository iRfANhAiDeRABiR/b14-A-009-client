"use client";

import { ArrowUpDown } from "lucide-react";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Recently Added" },
];

export function EquipmentSort({ value = "featured", onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="equipment-sort-select"
        className="inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap text-text-secondary"
      >
        <ArrowUpDown aria-hidden="true" className="size-4 text-primary" />
        <span className="hidden sm:inline">Sort by</span>
      </label>

      <select
        id="equipment-sort-select"
        name="sort"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Sort equipment listings"
        className="min-h-11 cursor-pointer rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
