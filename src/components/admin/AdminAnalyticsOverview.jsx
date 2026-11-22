"use client";

import { AlertCircle, RefreshCw, ShieldAlert } from "lucide-react";

import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { AdminBookingChart } from "@/components/admin/AdminBookingChart";
import { AdminDashboardHeader } from "@/components/admin/AdminDashboardHeader";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { AdminRevenueChart } from "@/components/admin/AdminRevenueChart";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { EquipmentApprovalOverview } from "@/components/admin/EquipmentApprovalOverview";
import { RecentPlatformActivity } from "@/components/admin/RecentPlatformActivity";
import { Button } from "@/components/ui/Button";

export function AdminAnalyticsOverview() {
  const { period, setPeriod, data, loading, error, errorStatus, retry } =
    useAdminAnalytics();

  const isAuthError = errorStatus === 401 || errorStatus === 403;

  return (
    <div className="space-y-6">
      <AdminDashboardHeader
        loading={loading}
        pendingApprovals={data.metrics.pendingApprovals}
        onRefresh={retry}
      />

      {error && !loading ? (
        <div
          role="alert"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            isAuthError
              ? "border-danger-border bg-danger-bg text-danger"
              : "border-warning-border bg-warning-bg text-warning"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isAuthError ? (
              <ShieldAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            ) : (
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            )}
            <span>
              {error} Unavailable metrics are shown explicitly without fabricated values until{" "}
              <code className="font-mono text-xs">GET /api/admin/analytics</code>{" "}
              responds.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {errorStatus === 401 ? (
              <Button
                href="/login?callbackURL=%2Fdashboard%2Fadmin"
                variant="outline"
                size="sm"
              >
                Sign In
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={retry}>
              <RefreshCw aria-hidden="true" className="size-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      ) : null}

      <AdminStatsCards metrics={data.metrics} loading={loading} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminBookingChart
          data={data.monthlyBookingData}
          period={period}
          onPeriodChange={setPeriod}
          loading={loading}
        />

        <AdminRevenueChart
          data={data.monthlyRevenueData}
          loading={loading}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <EquipmentApprovalOverview
          data={data.equipmentApprovalData}
          pendingApprovals={data.metrics.pendingApprovals}
          loading={loading}
        />

        <RecentPlatformActivity
          activities={data.recentActivity}
          loading={loading}
        />
      </div>

      <AdminQuickActions />
    </div>
  );
}
