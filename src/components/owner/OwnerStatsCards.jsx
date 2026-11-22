"use client";

import { Boxes, CheckCircle2, TrendingUp, Wallet } from "lucide-react";

import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function OwnerStatsCards({ stats, loading = false }) {
  const breakdown = stats?.equipmentStatusBreakdown || null;

  const cards = [
    {
      key: "totalListedEquipment",
      label: "Total Listed Equipment",
      value: stats?.totalListedEquipment ?? 0,
      helper: "Listings registered to your fleet",
      icon: Boxes,
      tone: "bg-secondary text-primary",
      extra: breakdown ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {breakdown.approved !== null ? (
            <Badge variant="success" size="sm">
              Approved: {breakdown.approved}
            </Badge>
          ) : null}
          {breakdown.pending !== null ? (
            <Badge variant="warning" size="sm">
              Pending: {breakdown.pending}
            </Badge>
          ) : null}
          {breakdown.rejected !== null && breakdown.rejected > 0 ? (
            <Badge variant="danger" size="sm">
              Rejected: {breakdown.rejected}
            </Badge>
          ) : null}
        </div>
      ) : null,
    },
    {
      key: "completedRentals",
      label: "Completed Rentals",
      value: stats?.completedRentals ?? 0,
      helper: "Bookings with Completed status",
      icon: CheckCircle2,
      tone: "bg-success-bg text-success",
      extra: null,
    },
    {
      key: "totalEarnings",
      label: "Total Earnings",
      value: formatCurrencyBDT(stats?.totalEarnings ?? 0),
      helper: "Verified paid settlement revenue",
      icon: Wallet,
      tone: "bg-secondary text-primary",
      extra:
        stats?.grossBookingVolume !== null &&
        stats?.grossBookingVolume !== undefined ? (
          <p className="mt-1.5 text-[11px] text-text-secondary tabular-nums">
            Gross booking volume:{" "}
            <strong className="font-semibold text-foreground">
              {formatCurrencyBDT(stats.grossBookingVolume)}
            </strong>
          </p>
        ) : null,
    },
    {
      key: "monthlyEarnings",
      label: "Monthly Earnings",
      value: formatCurrencyBDT(stats?.monthlyEarnings ?? 0),
      helper: "Eligible payments this month",
      icon: TrendingUp,
      tone: "bg-warning-bg text-warning",
      extra: null,
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.key} padding="md" className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="size-10 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.key}
            padding="md"
            className="rounded-2xl transition-all duration-200 hover:border-primary/35 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-secondary">
                  {card.label}
                </p>
                <p className="mt-2 font-heading text-2xl font-bold text-foreground tabular-nums sm:text-3xl">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-muted">{card.helper}</p>
                {card.extra}
              </div>

              <span
                aria-hidden="true"
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${card.tone}`}
              >
                <Icon className="size-5" />
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
