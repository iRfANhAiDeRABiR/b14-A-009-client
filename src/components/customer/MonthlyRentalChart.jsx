"use client";

import * as React from "react";
import { BarChart3 } from "lucide-react";

import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export function MonthlyRentalChart({ data = [], loading = false }) {
  const [metric, setMetric] = React.useState("spending");
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
        <Skeleton className="mt-6 h-56 w-full rounded-xl" />
      </Card>
    );
  }

  const safeData = Array.isArray(data) ? data : [];
  const activeIndex =
    selectedIndex !== null && safeData[selectedIndex]
      ? selectedIndex
      : safeData.length > 0
        ? safeData.length - 1
        : null;
  const activeItem = activeIndex !== null ? safeData[activeIndex] : null;

  const maxValue =
    safeData.length > 0
      ? Math.max(
          1,
          ...safeData.map((entry) =>
            metric === "spending" ? entry.totalAmount : entry.bookingsCount
          )
        )
      : 1;

  const totalSpentSum = safeData.reduce(
    (sum, item) => sum + (Number(item.totalAmount) || 0),
    0
  );
  const totalCountSum = safeData.reduce(
    (sum, item) => sum + (Number(item.bookingsCount) || 0),
    0
  );

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="type-card-title text-foreground">
            Monthly Rental Activity
          </h2>
          <p className="mt-1 text-xs text-text-secondary sm:text-sm">
            Monthly summary derived from your authenticated booking records.
          </p>
        </div>

        <div
          role="group"
          aria-label="Chart metric view"
          className="inline-flex rounded-lg border border-border bg-background p-1"
        >
          <button
            type="button"
            aria-pressed={metric === "spending"}
            onClick={() => setMetric("spending")}
            className={cn(
              "min-h-8 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              metric === "spending"
                ? "bg-primary text-primary-foreground"
                : "text-text-secondary hover:text-foreground"
            )}
          >
            Spending (BDT)
          </button>
          <button
            type="button"
            aria-pressed={metric === "count"}
            onClick={() => setMetric("count")}
            className={cn(
              "min-h-8 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              metric === "count"
                ? "bg-primary text-primary-foreground"
                : "text-text-secondary hover:text-foreground"
            )}
          >
            Rentals
          </button>
        </div>
      </div>

      {safeData.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-12 text-center">
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <BarChart3 className="size-6" />
          </span>
          <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
            No monthly rental activity yet
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary sm:text-sm">
            Once your customer bookings are recorded, monthly rental spend and reservation trends will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {/* Active bar / summary readout */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-xs sm:text-sm">
            {activeItem ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-heading font-semibold text-foreground">
                  {activeItem.label}:
                </span>
                <span className="font-semibold text-primary tabular-nums">
                  {formatCurrencyBDT(activeItem.totalAmount)}
                </span>
                <span className="text-text-secondary tabular-nums">
                  ({activeItem.bookingsCount}{" "}
                  {activeItem.bookingsCount === 1 ? "rental" : "rentals"})
                </span>
              </div>
            ) : null}

            <div className="text-xs text-text-secondary tabular-nums">
              Period total:{" "}
              <strong className="font-semibold text-foreground">
                {formatCurrencyBDT(totalSpentSum)}
              </strong>{" "}
              across {totalCountSum} {totalCountSum === 1 ? "booking" : "bookings"}
            </div>
          </div>

          {/* Responsive accessible bar chart */}
          <div className="overflow-x-auto pb-1">
            <div
              role="group"
              aria-label="Monthly rental activity bars"
              className="grid min-w-[320px] grid-flow-col items-end gap-3 rounded-xl border border-border bg-background/60 px-4 pt-6 pb-4 sm:gap-5"
              style={{
                gridTemplateColumns: `repeat(${safeData.length}, minmax(3.5rem, 1fr))`,
              }}
            >
              {safeData.map((entry, index) => {
                const rawVal =
                  metric === "spending" ? entry.totalAmount : entry.bookingsCount;
                const heightPercent = Math.max(
                  8,
                  Math.round((rawVal / maxValue) * 100)
                );
                const isSelected = activeIndex === index;
                const displayVal =
                  metric === "spending"
                    ? formatCurrencyBDT(entry.totalAmount)
                    : `${entry.bookingsCount}`;

                return (
                  <button
                    key={entry.monthKey || entry.label}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`${entry.label}: ${formatCurrencyBDT(
                      entry.totalAmount
                    )}, ${entry.bookingsCount} rentals`}
                    onClick={() => setSelectedIndex(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="group flex cursor-pointer flex-col items-center gap-2 focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "text-[11px] font-semibold tabular-nums transition-colors",
                        isSelected ? "text-primary" : "text-text-secondary"
                      )}
                    >
                      {displayVal}
                    </span>

                    <div className="flex h-40 w-full max-w-14 items-end justify-center rounded-lg bg-surface-subtle p-1">
                      <div
                        className={cn(
                          "w-full rounded-md transition-all duration-200",
                          isSelected
                            ? "bg-accent"
                            : "bg-primary group-hover:bg-primary-hover"
                        )}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span
                      className={cn(
                        "text-xs whitespace-nowrap transition-colors",
                        isSelected
                          ? "font-semibold text-foreground"
                          : "font-medium text-text-secondary"
                      )}
                    >
                      {entry.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
