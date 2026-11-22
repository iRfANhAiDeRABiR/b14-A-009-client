"use client";

import * as React from "react";
import { Bell, Calendar, RefreshCw, ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const noopSubscribe = () => () => {};
let cachedFormattedDate = "";

function getClientFormattedDate() {
  if (!cachedFormattedDate) {
    cachedFormattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date());
  }
  return cachedFormattedDate;
}

export function AdminDashboardHeader({
  loading = false,
  pendingApprovals = null,
  onRefresh = null,
}) {
  const { user, roleLabel, roleBadgeVariant } = useAuth();
  const formattedDate = React.useSyncExternalStore(
    noopSubscribe,
    getClientFormattedDate,
    () => ""
  );

  const adminName = user?.name || user?.email || "Administrator";
  const hasPendingQueue =
    typeof pendingApprovals === "number" && pendingApprovals > 0;

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          {user?.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.image}
              alt={`${adminName} avatar`}
              className="size-14 shrink-0 rounded-full border border-border bg-surface-subtle object-cover sm:size-16"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-16"
            >
              <ShieldCheck className="size-7" />
            </span>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={roleBadgeVariant || "success"} dot size="sm">
                {roleLabel || "Admin"} Portal
              </Badge>

              {formattedDate ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                  <Calendar
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                  />
                  <span>{formattedDate}</span>
                </span>
              ) : null}

              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-text-secondary">
                <Bell aria-hidden="true" className="size-3 text-primary" />
                <span>Signed in: {adminName}</span>
              </span>

              {!loading && hasPendingQueue ? (
                <span
                  role="status"
                  aria-atomic="true"
                  className="inline-flex items-center rounded-full border border-warning-border bg-warning-bg px-2.5 py-0.5 text-xs font-semibold text-warning tabular-nums"
                >
                  {pendingApprovals} pending listing{" "}
                  {pendingApprovals === 1 ? "approval" : "approvals"}
                </span>
              ) : null}
            </div>

            <h1 className="type-page-title mt-3 text-foreground">
              Platform Overview
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
              Monitor marketplace performance, manage platform activity and gain insights into GearNest&apos;s overall business operations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 lg:shrink-0">
          {typeof onRefresh === "function" ? (
            <Button
              variant="outline"
              size="md"
              disabled={loading}
              onClick={onRefresh}
            >
              <RefreshCw
                aria-hidden="true"
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          ) : null}

          <Button
            href="/dashboard/admin/equipment"
            variant="primary"
            size="md"
          >
            <ShieldCheck aria-hidden="true" className="size-4" />
            <span>Review Equipment</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
