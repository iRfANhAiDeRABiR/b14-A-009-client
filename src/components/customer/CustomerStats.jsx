"use client";

import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Heart,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function CustomerStats({ stats, loading = false }) {
  const cards = [
    {
      key: "totalRentals",
      label: "Total Rentals",
      value: stats?.totalRentals ?? 0,
      helper: "All submitted reservations",
      icon: ClipboardList,
      tone: "bg-secondary text-primary",
    },
    {
      key: "activeRentals",
      label: "Active Rentals",
      value: stats?.activeRentals ?? 0,
      helper: "Currently on hire",
      icon: Clock,
      tone: "bg-warning-bg text-warning",
    },
    {
      key: "completedRentals",
      label: "Completed Rentals",
      value: stats?.completedRentals ?? 0,
      helper: "Returned & closed bookings",
      icon: CheckCircle2,
      tone: "bg-success-bg text-success",
    },
    {
      key: "favoriteCount",
      label: "Favorite Equipment",
      value: stats?.favoriteCount ?? 0,
      helper: "Saved in your shortlist",
      icon: Heart,
      tone: "bg-danger-bg text-danger",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => (
          <Card key={item.key} padding="md" className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-16" />
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
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.key} padding="md" className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-text-secondary">
                  {item.label}
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-foreground tabular-nums">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-muted">{item.helper}</p>
              </div>
              <span
                aria-hidden="true"
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}
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
