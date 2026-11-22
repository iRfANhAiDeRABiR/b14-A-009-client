"use client";

import * as React from "react";
import { TrendingUp, Wallet } from "lucide-react";

import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function formatShortMonth(label) {
  const clean = String(label || "").trim();
  if (!clean) return "—";
  return clean.length > 6 ? clean.slice(0, 3) : clean;
}

export function AdminRevenueChart({ data = [], loading = false }) {
  const [chartType, setChartType] = React.useState("bar");
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" />
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

  const maxRevenue =
    safeData.length > 0
      ? Math.max(1, ...safeData.map((entry) => Number(entry.revenue) || 0))
      : 1;

  const periodTotalRevenue = safeData.reduce(
    (sum, item) => sum + (Number(item.revenue) || 0),
    0
  );

  // Build SVG line coordinates on a 100x48 normalized viewport for trend mode
  const linePoints =
    safeData.length > 0
      ? safeData.map((entry, idx) => {
          const x =
            safeData.length === 1
              ? 50
              : Math.round((idx / (safeData.length - 1)) * 88 + 6);
          const ratio = (Number(entry.revenue) || 0) / maxRevenue;
          const y = Math.round(42 - ratio * 34);
          return { x, y, entry, idx };
        })
      : [];

  const polylineStr = linePoints.map((pt) => `${pt.x},${pt.y}`).join(" ");

  return (
    <Card padding="lg" className="flex flex-col justify-between rounded-2xl">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="type-card-title text-foreground">
              Platform Revenue Overview
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Collected payment settlements in BDT by month (excludes failed or pending transactions).
            </p>
          </div>

          <div
            role="group"
            aria-label="Revenue chart visualization mode"
            className="inline-flex rounded-lg border border-border bg-background p-1"
          >
            <button
              type="button"
              aria-pressed={chartType === "bar"}
              onClick={() => setChartType("bar")}
              className={cn(
                "min-h-8 cursor-pointer rounded-md px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                chartType === "bar"
                  ? "bg-primary text-primary-foreground"
                  : "text-text-secondary hover:text-foreground"
              )}
            >
              Bar View
            </button>
            <button
              type="button"
              aria-pressed={chartType === "line"}
              onClick={() => setChartType("line")}
              className={cn(
                "inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-md px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                chartType === "line"
                  ? "bg-primary text-primary-foreground"
                  : "text-text-secondary hover:text-foreground"
              )}
            >
              <TrendingUp aria-hidden="true" className="size-3.5" />
              <span>Trend</span>
            </button>
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
              No revenue data available
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
              Monthly settled revenue figures will appear here once verified payment records are aggregated by the backend.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {/* Active Month Tooltip Readout */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm">
              {activeItem ? (
                <div className="flex items-center gap-2">
                  <span className="font-heading font-semibold text-foreground">
                    {activeItem.month}:
                  </span>
                  <span className="font-bold text-primary tabular-nums">
                    {formatCurrencyBDT(activeItem.revenue)}
                  </span>
                </div>
              ) : null}

              <span className="text-xs text-text-secondary tabular-nums">
                Period revenue:{" "}
                <strong className="font-semibold text-foreground">
                  {formatCurrencyBDT(periodTotalRevenue)}
                </strong>
              </span>
            </div>

            {chartType === "line" ? (
              <div className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
                <div className="flex gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-36 shrink-0 flex-col justify-between text-right text-[11px] font-medium text-muted tabular-nums"
                  >
                    <span>{formatCurrencyBDT(maxRevenue)}</span>
                    <span>{formatCurrencyBDT(Math.round(maxRevenue / 2))}</span>
                    <span>৳0</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <svg
                      viewBox="0 0 100 48"
                      role="img"
                      aria-label="Platform monthly revenue trend chart"
                      className="h-36 w-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="4"
                        y1="8"
                        x2="96"
                        y2="8"
                        stroke="#E5E9E3"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="4"
                        y1="25"
                        x2="96"
                        y2="25"
                        stroke="#E5E9E3"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="4"
                        y1="42"
                        x2="96"
                        y2="42"
                        stroke="#E5E9E3"
                        strokeWidth="0.6"
                      />
                      {linePoints.length > 1 ? (
                        <polyline
                          fill="none"
                          stroke="#193D34"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polylineStr}
                        />
                      ) : null}
                      {linePoints.map((pt) => {
                        const isSelected = activeIndex === pt.idx;
                        return (
                          <circle
                            key={`${pt.entry.month}-${pt.idx}`}
                            cx={pt.x}
                            cy={pt.y}
                            r={isSelected ? "2.6" : "1.8"}
                            fill={isSelected ? "#D9A441" : "#193D34"}
                            stroke="#FFFFFF"
                            strokeWidth="0.8"
                            className="cursor-pointer"
                            onClick={() => setSelectedIndex(pt.idx)}
                            onMouseEnter={() => setSelectedIndex(pt.idx)}
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5">
                  {safeData.map((entry, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <button
                        key={`${entry.month}-btn-${idx}`}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedIndex(idx)}
                        className={cn(
                          "cursor-pointer rounded-md px-2 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? "bg-secondary font-semibold text-primary"
                            : "text-text-secondary hover:text-foreground"
                        )}
                      >
                        {formatShortMonth(entry.month)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-44 shrink-0 flex-col justify-between pt-5 pb-7 text-right text-[11px] font-medium text-muted tabular-nums"
                >
                  <span>{formatCurrencyBDT(maxRevenue)}</span>
                  <span>{formatCurrencyBDT(Math.round(maxRevenue / 2))}</span>
                  <span>৳0</span>
                </div>

                <div className="min-w-0 flex-1 overflow-x-auto pb-1">
                  <div
                    role="group"
                    aria-label="Platform monthly revenue bars in BDT"
                    className="grid min-w-[260px] grid-flow-col items-end gap-2.5 rounded-xl border border-border bg-background/60 px-3 pt-5 pb-3 sm:gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${safeData.length}, minmax(3.25rem, 1fr))`,
                    }}
                  >
                    {safeData.map((entry, index) => {
                      const amount = Number(entry.revenue) || 0;
                      const heightPercent =
                        amount === 0
                          ? 4
                          : Math.max(10, Math.round((amount / maxRevenue) * 100));
                      const isSelected = activeIndex === index;

                      return (
                        <button
                          key={`${entry.month}-${index}`}
                          type="button"
                          aria-pressed={isSelected}
                          aria-label={`${entry.month}: ${formatCurrencyBDT(amount)}`}
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
                            {formatCurrencyBDT(amount)}
                          </span>

                          <div className="flex h-36 w-full max-w-12 items-end justify-center rounded-lg bg-surface-subtle p-1">
                            <div
                              className={cn(
                                "w-full rounded-md transition-all duration-200",
                                amount === 0
                                  ? "bg-border"
                                  : isSelected
                                    ? "bg-accent"
                                    : "bg-primary group-hover:bg-primary-hover"
                              )}
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>

                          <span
                            title={entry.month}
                            className={cn(
                              "max-w-full truncate text-xs",
                              isSelected
                                ? "font-semibold text-foreground"
                                : "font-medium text-text-secondary"
                            )}
                          >
                            {formatShortMonth(entry.month)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
