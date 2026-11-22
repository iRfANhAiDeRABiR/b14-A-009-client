"use client";

import * as React from "react";
import { BarChart3 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export function OwnerRentalChart({ data = [], loading = false }) {
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
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

  const maxCount =
    safeData.length > 0
      ? Math.max(
          1,
          ...safeData.map((entry) =>
            Math.max(entry.totalBookings || 0, entry.completedRentals || 0)
          )
        )
      : 1;

  return (
    <Card padding="lg" className="flex flex-col justify-between rounded-2xl">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="type-card-title text-foreground">
              Rental Performance
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Monthly total booking count vs completed rentals.
            </p>
          </div>

          <div
            aria-label="Rental chart legend"
            className="flex flex-wrap items-center gap-3 text-xs font-medium text-text-secondary"
          >
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-3 rounded-xs bg-primary"
              />
              <span>Total Bookings</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-3 rounded-xs border border-primary bg-accent"
              />
              <span>Completed Rentals</span>
            </span>
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
              No rental activity recorded yet
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
              Total booking requests and completed rental comparisons will render here once bookings accumulate.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm">
              {activeItem ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-heading font-semibold text-foreground">
                    {activeItem.month}:
                  </span>
                  <span className="text-primary tabular-nums">
                    Bookings:{" "}
                    <strong className="font-bold">
                      {activeItem.totalBookings}
                    </strong>
                  </span>
                  <span className="text-warning tabular-nums">
                    Completed:{" "}
                    <strong className="font-bold">
                      {activeItem.completedRentals}
                    </strong>
                  </span>
                </div>
              ) : null}
            </div>

            <div className="overflow-x-auto pb-1">
              <div
                role="group"
                aria-label="Monthly booking vs completed rental bars"
                className="grid min-w-[260px] grid-flow-col items-end gap-3 rounded-xl border border-border bg-background/60 px-4 pt-6 pb-3 sm:gap-4"
                style={{
                  gridTemplateColumns: `repeat(${safeData.length}, minmax(3.5rem, 1fr))`,
                }}
              >
                {safeData.map((entry, index) => {
                  const totalCount = Number(entry.totalBookings) || 0;
                  const completedCount = Number(entry.completedRentals) || 0;
                  const totalHeight =
                    totalCount === 0
                      ? 4
                      : Math.max(10, Math.round((totalCount / maxCount) * 100));
                  const completedHeight =
                    completedCount === 0
                      ? 4
                      : Math.max(
                          10,
                          Math.round((completedCount / maxCount) * 100)
                        );
                  const isSelected = activeIndex === index;

                  return (
                    <button
                      key={`${entry.month}-${index}`}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`${entry.month}: ${totalCount} total bookings, ${completedCount} completed rentals`}
                      onClick={() => setSelectedIndex(index)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className="group flex cursor-pointer flex-col items-center gap-2 focus-visible:outline-none"
                    >
                      <span className="text-[11px] font-medium text-text-secondary tabular-nums">
                        {totalCount} / {completedCount}
                      </span>

                      <div className="flex h-36 w-full max-w-14 items-end justify-center gap-1 rounded-lg bg-surface-subtle p-1.5">
                        <div
                          className={cn(
                            "w-1/2 rounded-sm transition-all duration-200",
                            totalCount === 0 ? "bg-border" : "bg-primary"
                          )}
                          style={{ height: `${totalHeight}%` }}
                        />
                        <div
                          className={cn(
                            "w-1/2 rounded-sm border transition-all duration-200",
                            completedCount === 0
                              ? "border-transparent bg-border"
                              : "border-primary/40 bg-accent"
                          )}
                          style={{ height: `${completedHeight}%` }}
                        />
                      </div>

                      <span
                        className={cn(
                          "max-w-full truncate text-xs",
                          isSelected
                            ? "font-semibold text-foreground"
                            : "font-medium text-text-secondary"
                        )}
                      >
                        {entry.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
