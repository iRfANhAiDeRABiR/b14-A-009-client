"use client";

import * as React from "react";
import { Wallet } from "lucide-react";

import { OWNER_PERIOD_OPTIONS } from "@/lib/ownerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export function OwnerEarningsChart({
  data = [],
  period = "6m",
  onPeriodChange,
  loading = false,
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-56 rounded-lg" />
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

  const maxEarnings =
    safeData.length > 0
      ? Math.max(1, ...safeData.map((item) => Number(item.earnings) || 0))
      : 1;

  const periodTotalEarnings = safeData.reduce(
    (sum, item) => sum + (Number(item.earnings) || 0),
    0
  );

  return (
    <Card padding="lg" className="flex flex-col justify-between rounded-2xl">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="type-card-title text-foreground">
              Monthly Earnings Overview
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Authoritative settled revenue in BDT by month.
            </p>
          </div>

          <div
            role="group"
            aria-label="Earnings reporting period"
            className="inline-flex flex-wrap rounded-lg border border-border bg-background p-1"
          >
            {OWNER_PERIOD_OPTIONS.map((option) => {
              const active = period === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedIndex(null);
                    onPeriodChange?.(option.value);
                  }}
                  className={cn(
                    "min-h-8 cursor-pointer rounded-md px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-text-secondary hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {safeData.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-12 text-center">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <Wallet className="size-6" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
              No earnings data for this period
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
              Monthly earnings figures will display here once verified paid bookings are recorded by the backend.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm">
              {activeItem ? (
                <div className="flex items-center gap-2">
                  <span className="font-heading font-semibold text-foreground">
                    {activeItem.month}:
                  </span>
                  <span className="font-bold text-primary tabular-nums">
                    {formatCurrencyBDT(activeItem.earnings)}
                  </span>
                </div>
              ) : null}

              <span className="text-xs text-text-secondary tabular-nums">
                Period total:{" "}
                <strong className="font-semibold text-foreground">
                  {formatCurrencyBDT(periodTotalEarnings)}
                </strong>
              </span>
            </div>

            <div className="flex gap-3">
              {/* Y-Axis BDT Scale Labels */}
              <div
                aria-hidden="true"
                className="flex h-44 shrink-0 flex-col justify-between pt-5 pb-7 text-right text-[11px] font-medium text-muted tabular-nums"
              >
                <span>{formatCurrencyBDT(maxEarnings)}</span>
                <span>{formatCurrencyBDT(Math.round(maxEarnings / 2))}</span>
                <span>৳0</span>
              </div>

              <div className="min-w-0 flex-1 overflow-x-auto pb-1">
                <div
                  role="group"
                  aria-label="Monthly earnings bars in BDT"
                  className="grid min-w-[260px] grid-flow-col items-end gap-2.5 rounded-xl border border-border bg-background/60 px-3 pt-5 pb-3 sm:gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${safeData.length}, minmax(3.25rem, 1fr))`,
                  }}
                >
                  {safeData.map((entry, index) => {
                    const numericEarnings = Number(entry.earnings) || 0;
                    const heightPercent =
                      numericEarnings === 0
                        ? 4
                        : Math.max(10, Math.round((numericEarnings / maxEarnings) * 100));
                    const isSelected = activeIndex === index;

                    return (
                      <button
                        key={`${entry.month}-${index}`}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={`${entry.month}: ${formatCurrencyBDT(
                          numericEarnings
                        )}`}
                        onClick={() => setSelectedIndex(index)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className="group flex cursor-pointer flex-col items-center gap-1.5 focus-visible:outline-none"
                      >
                        <span
                          className={cn(
                            "text-[11px] font-semibold tabular-nums",
                            isSelected ? "text-primary" : "text-text-secondary"
                          )}
                        >
                          {formatCurrencyBDT(numericEarnings)}
                        </span>

                        <div className="flex h-36 w-full max-w-12 items-end justify-center rounded-lg bg-surface-subtle p-1">
                          <div
                            className={cn(
                              "w-full rounded-md transition-all duration-200",
                              numericEarnings === 0
                                ? "bg-border"
                                : isSelected
                                  ? "bg-accent"
                                  : "bg-primary group-hover:bg-primary-hover"
                            )}
                            style={{ height: `${heightPercent}%` }}
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
          </div>
        )}
      </div>
    </Card>
  );
}
