"use client";

import { Boxes, CheckCircle2, Clock, XCircle } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function OwnerEquipmentStats({ stats, loading = false }) {
  const cards = [
    {
      key: "total",
      label: "Total Equipment",
      value: stats?.total ?? 0,
      icon: Boxes,
      tone: "bg-secondary text-primary",
    },
    {
      key: "pending",
      label: "Pending Approval",
      value: stats?.pending ?? 0,
      icon: Clock,
      tone: "bg-warning-bg text-warning",
    },
    {
      key: "approved",
      label: "Approved Equipment",
      value: stats?.approved ?? 0,
      icon: CheckCircle2,
      tone: "bg-success-bg text-success",
    },
    {
      key: "rejected",
      label: "Rejected Equipment",
      value: stats?.rejected ?? 0,
      icon: XCircle,
      tone: "bg-danger-bg text-danger",
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
                <Skeleton className="h-8 w-14" />
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
          <Card key={card.key} padding="md" className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-text-secondary">
                  {card.label}
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-foreground tabular-nums">
                  {card.value}
                </p>
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
