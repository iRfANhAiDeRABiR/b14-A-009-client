"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { getCustomerDashboard } from "@/services/customerService";
import { CustomerStats } from "@/components/customer/CustomerStats";
import { FavoritePreview } from "@/components/customer/FavoritePreview";
import { MonthlyRentalChart } from "@/components/customer/MonthlyRentalChart";
import { RecentRentals } from "@/components/customer/RecentRentals";
import { Button } from "@/components/ui/Button";

export function CustomerOverview() {
  const { user, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [refreshTick, setRefreshTick] = React.useState(0);

  const requestKey = `${user?.id || user?.email || "customer"}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    stats: {
      totalRentals: 0,
      activeRentals: 0,
      completedRentals: 0,
      favoriteCount: 0,
    },
    monthlyActivity: [],
    recentRentals: [],
    favoritePreview: [],
    error: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getCustomerDashboard({ token })
      .then((result) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          stats: result.stats,
          monthlyActivity: result.monthlyActivity,
          recentRentals: result.recentRentals,
          favoritePreview: result.favoritePreview,
          error: result.error,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState((prev) => ({
          ...prev,
          loadedKey: requestKey,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load customer dashboard overview.",
        }));
      });

    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated, requestKey, token]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;
  const firstName =
    typeof user?.name === "string" && user.name.trim()
      ? user.name.trim().split(/\s+/)[0]
      : "";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">
            {firstName ? `Welcome Back, ${firstName}` : "Welcome Back"}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Manage your equipment rentals, track bookings and explore your favorite equipment.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => setRefreshTick((prev) => prev + 1)}
        >
          <RefreshCw aria-hidden="true" className="size-3.5" />
          <span>Refresh Data</span>
        </Button>
      </header>

      {state.error && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>
              {state.error} Displaying verified empty state until customer API endpoints connect.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshTick((prev) => prev + 1)}
          >
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      <CustomerStats stats={state.stats} loading={loading} />

      <MonthlyRentalChart data={state.monthlyActivity} loading={loading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentRentals rentals={state.recentRentals} loading={loading} />
        <FavoritePreview favorites={state.favoritePreview} loading={loading} />
      </div>
    </div>
  );
}
