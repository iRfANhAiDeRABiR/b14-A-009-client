"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { useOwnerAnalytics } from "@/hooks/useOwnerAnalytics";
import { OwnerDashboardHeader } from "@/components/owner/OwnerDashboardHeader";
import { OwnerEarningsChart } from "@/components/owner/OwnerEarningsChart";
import { OwnerEquipmentPerformance } from "@/components/owner/OwnerEquipmentPerformance";
import { OwnerQuickActions } from "@/components/owner/OwnerQuickActions";
import { OwnerRecentRentals } from "@/components/owner/OwnerRecentRentals";
import { OwnerRentalChart } from "@/components/owner/OwnerRentalChart";
import { OwnerStatsCards } from "@/components/owner/OwnerStatsCards";
import { Button } from "@/components/ui/Button";

export function OwnerAnalyticsOverview() {
  const { period, setPeriod, data, loading, error, retry } =
    useOwnerAnalytics();

  return (
    <div className="space-y-6">
      <OwnerDashboardHeader loading={loading} onRefresh={retry} />

      {error && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>
              {error} Showing authentic zero/empty analytics until{" "}
              <code className="font-mono text-xs">GET /api/owner/analytics</code>{" "}
              is connected.
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={retry}>
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      <OwnerStatsCards stats={data.stats} loading={loading} />

      <div className="grid gap-6 xl:grid-cols-2">
        <OwnerEarningsChart
          data={data.monthlyEarningsData}
          period={period}
          onPeriodChange={setPeriod}
          loading={loading}
        />
        <OwnerRentalChart
          data={data.monthlyRentalData}
          loading={loading}
        />
      </div>

      <OwnerEquipmentPerformance
        items={data.equipmentPerformance}
        loading={loading}
      />

      <OwnerRecentRentals rentals={data.recentRentals} loading={loading} />

      <OwnerQuickActions />
    </div>
  );
}
