"use client";

import {
  Boxes,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Clock,
  Users,
  Wallet,
} from "lucide-react";

import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function formatIntegerMetric(value) {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("en-US").format(Math.floor(num));
}

function formatCurrencyMetric(value) {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  return formatCurrencyBDT(num);
}

export function AdminStatsCards({ metrics, loading = false }) {
  const cards = [
    {
      key: "totalUsers",
      label: "Total Users",
      value: formatIntegerMetric(metrics?.totalUsers),
      isAvailable: metrics?.totalUsers !== null && metrics?.totalUsers !== undefined,
      helper: "Registered platform accounts",
      icon: Users,
      tone: "bg-secondary text-primary",
    },
    {
      key: "totalEquipment",
      label: "Total Equipment",
      value: formatIntegerMetric(metrics?.totalEquipment),
      isAvailable:
        metrics?.totalEquipment !== null && metrics?.totalEquipment !== undefined,
      helper: "Equipment records across fleet",
      icon: Boxes,
      tone: "bg-secondary text-primary",
    },
    {
      key: "totalBookings",
      label: "Total Bookings",
      value: formatIntegerMetric(metrics?.totalBookings),
      isAvailable:
        metrics?.totalBookings !== null && metrics?.totalBookings !== undefined,
      helper: "All platform rental requests",
      icon: ClipboardList,
      tone: "bg-surface-subtle text-foreground",
    },
    {
      key: "pendingApprovals",
      label: "Pending Approvals",
      value: formatIntegerMetric(metrics?.pendingApprovals),
      isAvailable:
        metrics?.pendingApprovals !== null &&
        metrics?.pendingApprovals !== undefined,
      helper: "Listings awaiting moderation",
      icon: Clock,
      tone: "bg-warning-bg text-warning",
    },
    {
      key: "completedRentals",
      label: "Completed Rentals",
      value: formatIntegerMetric(metrics?.completedRentals),
      isAvailable:
        metrics?.completedRentals !== null &&
        metrics?.completedRentals !== undefined,
      helper: "Bookings marked Completed",
      icon: CheckCircle2,
      tone: "bg-success-bg text-success",
    },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      value: formatCurrencyMetric(metrics?.totalRevenue),
      isAvailable:
        metrics?.totalRevenue !== null && metrics?.totalRevenue !== undefined,
      helper: "Verified payments settlement",
      icon: Wallet,
      tone: "bg-primary text-primary-foreground",
    },
    {
      key: "monthlyBookings",
      label: "Monthly Bookings",
      value: formatIntegerMetric(metrics?.monthlyBookings),
      isAvailable:
        metrics?.monthlyBookings !== null &&
        metrics?.monthlyBookings !== undefined,
      helper: "Created this calendar month",
      icon: CalendarCheck2,
      tone: "bg-secondary text-primary",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.key} padding="md" className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
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
    <section aria-label="Platform key metrics">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  <p
                    className={`mt-2 font-heading text-2xl font-bold tabular-nums sm:text-3xl ${
                      card.isAvailable ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {card.isAvailable
                      ? card.helper
                      : "Awaiting analytics API response"}
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
    </section>
  );
}
