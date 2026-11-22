"use client";

import { ArrowRight, CheckCircle2, Clock, ShieldCheck, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const STATUS_META = {
  Pending: {
    color: "#D9A441",
    badgeVariant: "warning",
    icon: Clock,
  },
  Approved: {
    color: "#1E6B47",
    badgeVariant: "success",
    icon: CheckCircle2,
  },
  Rejected: {
    color: "#B42318",
    badgeVariant: "danger",
    icon: XCircle,
  },
};

export function EquipmentApprovalOverview({
  data = [],
  pendingApprovals = null,
  loading = false,
}) {
  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton className="size-36 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </Card>
    );
  }

  const safeData = Array.isArray(data) ? data : [];
  const totalCategorized = safeData.reduce(
    (sum, item) => sum + (Number(item.count) || 0),
    0
  );

  const pendingRow = safeData.find((item) => item.status === "Pending");
  const resolvedPendingCount =
    typeof pendingApprovals === "number"
      ? pendingApprovals
      : pendingRow
        ? pendingRow.count
        : null;

  // Build SVG donut ring segments (radius = 36 => circumference = 2 * pi * 36 = 226.19)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  const segments =
    totalCategorized > 0
      ? safeData
          .filter((item) => item.count > 0)
          .map((item) => {
            const fraction = item.count / totalCategorized;
            const dashLength = fraction * circumference;
            const dashOffset = -cumulativeOffset;
            cumulativeOffset += dashLength;
            return {
              ...item,
              color: STATUS_META[item.status]?.color || "#78847B",
              dashArray: `${dashLength} ${circumference}`,
              dashOffset,
              percent: Math.round(fraction * 100),
            };
          })
      : [];

  return (
    <Card padding="lg" className="flex flex-col justify-between rounded-2xl">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="type-card-title text-foreground">
              Equipment Approval Overview
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Moderation status distribution across submitted marketplace equipment.
            </p>
          </div>

          <Button
            href="/dashboard/admin/equipment"
            variant="outline"
            size="sm"
          >
            <span>Review Equipment</span>
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
        </div>

        {safeData.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <ShieldCheck className="size-6" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
              No equipment approval data available
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
              Pending, approved, and rejected equipment counts will display here once supplied by the analytics API.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            {/* Donut Chart */}
            <div className="relative flex size-40 shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                role="img"
                aria-label={`Equipment approval distribution across ${totalCategorized} categorized listings`}
                className="size-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#E5E9E3"
                  strokeWidth="12"
                />
                {segments.map((seg) => (
                  <circle
                    key={seg.status}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-heading text-2xl font-bold text-foreground tabular-nums">
                  {totalCategorized}
                </span>
                <span className="text-[11px] font-medium text-text-secondary">
                  Total Listings
                </span>
              </div>
            </div>

            {/* Breakdown List + Pending Callout */}
            <div className="w-full min-w-0 flex-1 space-y-2.5">
              {resolvedPendingCount !== null ? (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-warning-border bg-warning-bg px-3.5 py-2.5 text-xs">
                  <span className="font-semibold text-warning">
                    Waiting for Review
                  </span>
                  <span className="font-heading text-sm font-bold text-warning tabular-nums">
                    {resolvedPendingCount} Pending
                  </span>
                </div>
              ) : null}

              {safeData.map((entry) => {
                const meta = STATUS_META[entry.status] || STATUS_META.Pending;
                const Icon = meta.icon;
                const pct =
                  totalCategorized > 0
                    ? Math.round((entry.count / totalCategorized) * 100)
                    : 0;

                return (
                  <div
                    key={entry.status}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        aria-hidden="true"
                        className="size-4 shrink-0"
                        style={{ color: meta.color }}
                      />
                      <Badge variant={meta.badgeVariant} size="sm">
                        {entry.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs tabular-nums">
                      <span className="font-heading text-sm font-bold text-foreground">
                        {entry.count}
                      </span>
                      <span className="text-muted">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
