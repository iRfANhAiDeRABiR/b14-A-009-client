"use client";

import { CheckCircle2, ClipboardList, Clock, PlayCircle } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function formatCount(value) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en-US").format(Math.max(0, Math.floor(num)));
}

export function OwnerRentalOverview({ stats, loading = false }) {
  const cards = [
    {
      key: "totalBookings",
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      helper: "Bookings placed on your equipment",
      icon: ClipboardList,
      tone: "bg-secondary text-primary",
    },
    {
      key: "pendingBookings",
      label: "Pending Bookings",
      value: stats?.pendingBookings ?? 0,
      helper: "Bookings marked Pending by backend",
      icon: Clock,
      tone: "bg-warning-bg text-warning",
    },
    {
      key: "activeRentals",
      label: "Active Rentals",
      value: stats?.activeRentals ?? 0,
      helper: "Rentals marked Active on site",
      icon: PlayCircle,
      tone: "bg-success-bg text-success",
    },
    {
      key: "completedRentals",
      label: "Completed Rentals",
      value: stats?.completedRentals ?? 0,
      helper: "Rentals marked Completed",
      icon: CheckCircle2,
      tone: "border border-success-border/70 bg-surface-subtle text-success",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.key} padding="md" className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="size-10 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <section aria-label="Rental overview summary" className="space-y-2">
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
                  <p className="mt-2 font-heading text-3xl font-bold text-foreground tabular-nums">
                    {formatCount(card.value)}
                  </p>
                  <p className="mt-1 text-xs text-muted">{card.helper}</p>
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

      {stats?.isPartialSummary ? (
        <p className="text-xs text-text-secondary">
          Showing status counts across the bookings loaded on this view while awaiting a full-fleet summary object from the API.
        </p>
      ) : null}
    </section>
  );
}
