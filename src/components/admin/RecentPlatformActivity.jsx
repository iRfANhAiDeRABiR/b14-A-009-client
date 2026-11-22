"use client";

import {
  Activity,
  Boxes,
  ClipboardList,
  CreditCard,
  UserPlus,
} from "lucide-react";

import { formatDisplayDate } from "@/lib/adminUtils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function getActivityIcon(category) {
  if (category === "user") return UserPlus;
  if (category === "equipment") return Boxes;
  if (category === "payment") return CreditCard;
  if (category === "booking") return ClipboardList;
  return Activity;
}

export function RecentPlatformActivity({ activities = [], loading = false }) {
  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="space-y-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <div className="mt-5 space-y-3">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 rounded-xl border border-border p-3"
            >
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const safeActivities = Array.isArray(activities) ? activities : [];

  return (
    <Card padding="lg" className="flex flex-col justify-between rounded-2xl">
      <div>
        <div>
          <h2 className="type-card-title text-foreground">
            Recent Platform Activity
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Latest user registrations, equipment submissions, bookings, and payment events.
          </p>
        </div>

        {safeActivities.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <Activity className="size-6" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
              No recent platform activity
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
              Recent platform records will appear here when returned by the admin analytics endpoint.
            </p>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-border rounded-xl border border-border bg-background">
            {safeActivities.map((item) => {
              const Icon = getActivityIcon(item.category);
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-heading font-semibold text-foreground">
                        {item.subject}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-secondary">
                        <span>{item.typeLabel}</span>
                        {item.reference ? (
                          <span className="font-mono text-[11px] text-muted">
                            #{item.reference}
                          </span>
                        ) : null}
                        {item.date ? (
                          <span className="text-muted">
                            &middot; {formatDisplayDate(item.date)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {item.statusBadge ? (
                    <Badge variant={item.statusBadge.variant} size="sm">
                      {item.statusBadge.label}
                    </Badge>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
