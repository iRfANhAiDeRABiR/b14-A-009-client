"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ChevronRight,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useEquipment } from "@/hooks/useEquipment";
import { EquipmentEmptyState } from "@/components/equipment/EquipmentEmptyState";
import { EquipmentFilters } from "@/components/equipment/EquipmentFilters";
import { EquipmentGrid } from "@/components/equipment/EquipmentGrid";
import { EquipmentLoading } from "@/components/equipment/EquipmentLoading";
import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";
import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";
import { EquipmentSort, SORT_OPTIONS } from "@/components/equipment/EquipmentSort";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function EquipmentDirectory() {
  const {
    filters,
    items,
    pagination,
    source,
    error,
    loading,
    hasActiveFilters,
    updateFilters,
    clearAllFilters,
    setPage,
    retry,
  } = useEquipment();

  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  const catalogTopRef = React.useRef(null);

  const activeFilterChips = React.useMemo(() => {
    const chips = [];
    if (filters.search.trim()) {
      chips.push({
        key: "search",
        label: `Search: "${filters.search.trim()}"`,
        onRemove: () => updateFilters({ search: "" }),
      });
    }
    if (filters.category) {
      chips.push({
        key: "category",
        label: `Category: ${filters.category}`,
        onRemove: () => updateFilters({ category: "" }),
      });
    }
    if (filters.rentalType) {
      chips.push({
        key: "rentalType",
        label: `Type: ${filters.rentalType}`,
        onRemove: () => updateFilters({ rentalType: "" }),
      });
    }
    if (filters.minPrice !== "" || filters.maxPrice !== "") {
      const minLabel = filters.minPrice !== "" ? `৳${filters.minPrice}` : "৳0";
      const maxLabel =
        filters.maxPrice !== "" ? `৳${filters.maxPrice}` : "Any";
      chips.push({
        key: "price",
        label: `Price: ${minLabel} – ${maxLabel}`,
        onRemove: () => updateFilters({ minPrice: "", maxPrice: "" }),
      });
    }
    if (filters.availability) {
      chips.push({
        key: "availability",
        label:
          filters.availability === "available"
            ? "Availability: Available"
            : "Availability: Unavailable",
        onRemove: () => updateFilters({ availability: "" }),
      });
    }
    if (filters.sort && filters.sort !== "featured") {
      const match = SORT_OPTIONS.find((opt) => opt.value === filters.sort);
      chips.push({
        key: "sort",
        label: `Sort: ${match ? match.label : filters.sort}`,
        onRemove: () => updateFilters({ sort: "featured" }),
      });
    }
    return chips;
  }, [filters, updateFilters]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      {/* Page Header */}
      <section className="border-b border-border bg-surface py-10 sm:py-14">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-text-secondary">
              <li>
                <Link
                  href="/"
                  className="cursor-pointer transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5 text-muted" />
              </li>
              <li aria-current="page" className="font-semibold text-primary">
                All Equipment
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="type-label text-primary">GEARNEST MARKETPLACE</p>
              <h1 className="type-page-title mt-2 text-foreground">
                Find the Right Equipment for Your Next Project
              </h1>
              <p className="type-body mt-3 text-text-secondary">
                Explore quality equipment from trusted providers. Compare rental
                prices, check availability and find the perfect solution for your
                needs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!loading && source === "demo" ? (
                <Badge variant="neutral" size="md">
                  Development Demo Catalog
                </Badge>
              ) : null}
              <Badge variant="primary" dot size="md">
                {loading
                  ? "Loading inventory..."
                  : `${pagination.totalItems} ${
                      pagination.totalItems === 1 ? "Item" : "Items"
                    } Available`}
              </Badge>
            </div>
          </div>
        </Container>
      </section>

      {/* Search, Filters & Equipment Grid */}
      <section ref={catalogTopRef} className="py-10 sm:py-14">
        <Container>
          {/* Search + Sort + Mobile Filter Toggle Bar */}
          <Card padding="sm" className="rounded-xl sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <EquipmentSearch
                value={filters.search}
                onSearchChange={(nextSearch) =>
                  updateFilters({ search: nextSearch })
                }
              />

              <div className="flex items-center justify-between gap-2.5 sm:justify-end">
                <button
                  type="button"
                  aria-expanded={mobileFiltersOpen}
                  aria-controls="mobile-equipment-filters"
                  onClick={() => setMobileFiltersOpen((prev) => !prev)}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-xs transition-colors hover:border-primary/40 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                >
                  <SlidersHorizontal
                    aria-hidden="true"
                    className="size-4 text-primary"
                  />
                  <span>Filters</span>
                  {activeFilterChips.length > 0 ? (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {activeFilterChips.length}
                    </span>
                  ) : null}
                </button>

                <EquipmentSort
                  value={filters.sort}
                  onChange={(nextSort) => updateFilters({ sort: nextSort })}
                />
              </div>
            </div>

            {/* Desktop always-visible filter toolbar */}
            <div className="mt-5 hidden border-t border-border pt-5 lg:block">
              <EquipmentFilters
                filters={filters}
                onUpdateFilters={updateFilters}
                onClearAll={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Mobile & Tablet collapsible filter panel */}
            <AnimatePresence initial={false}>
              {mobileFiltersOpen ? (
                <motion.div
                  id="mobile-equipment-filters"
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, height: 0 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, height: "auto" }
                  }
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, height: 0 }
                  }
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden lg:hidden"
                >
                  <div className="mt-4 border-t border-border pt-4">
                    <EquipmentFilters
                      filters={filters}
                      onUpdateFilters={updateFilters}
                      onClearAll={clearAllFilters}
                      hasActiveFilters={hasActiveFilters}
                      onAfterApply={() => setMobileFiltersOpen(false)}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Card>

          {/* Active filter indicators + result summary */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-text-secondary">
                {loading ? (
                  "Updating equipment results..."
                ) : (
                  <>
                    <span className="font-semibold text-foreground tabular-nums">
                      {pagination.totalItems}
                    </span>{" "}
                    {pagination.totalItems === 1 ? "result" : "results"} found
                  </>
                )}
              </p>

              {activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove filter ${chip.label}`}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/20 bg-secondary/75 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{chip.label}</span>
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              ))}
            </div>

            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <RotateCcw aria-hidden="true" className="size-3.5" />
                <span>Clear All Filters</span>
              </Button>
            ) : null}
          </div>

          {/* API Error / Fallback Banner */}
          {error ? (
            <div
              role="alert"
              className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
            >
              <div className="flex items-center gap-2">
                <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
                <span>
                  Unable to reach the live equipment server ({error}). Showing
                  development fallback data.
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={retry}>
                <RefreshCw aria-hidden="true" className="size-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          ) : null}

          {/* Equipment Grid / Loading / Empty State */}
          <div className="mt-8">
            {loading ? (
              <EquipmentLoading count={9} />
            ) : items.length === 0 ? (
              <EquipmentEmptyState
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
              />
            ) : (
              <>
                <EquipmentGrid items={items} />
                <EquipmentPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
