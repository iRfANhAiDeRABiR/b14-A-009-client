"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import {
  aggregateMonthlyRentals,
  computeCustomerStats,
} from "@/lib/customerUtils";
import { getMyBookings } from "@/services/bookingService";
import { CustomerStats } from "@/components/customer/CustomerStats";
import { FavoritePreview } from "@/components/customer/FavoritePreview";
import { MonthlyRentalChart } from "@/components/customer/MonthlyRentalChart";
import { RecentRentals } from "@/components/customer/RecentRentals";
import { Button } from "@/components/ui/Button";

export function CustomerOverview() {
  const { user, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const {
    favorites,
    favoritesCount,
    isLoading: favoritesLoading,
    errorMessage: favoritesError,
    refreshFavorites,
  } = useFavorites();

  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${user?.id || user?.email || "customer"}|${refreshTick}`;

  const [rentalState, setRentalState] = React.useState({
    loadedKey: "",
    rentals: [],
    summary: null,
    monthlyAnalytics: null,
    error: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getMyBookings({ limit: 50, token })
      .then((result) => {
        if (!active) return;
        setRentalState({
          loadedKey: requestKey,
          rentals: result.items || [],
          summary: result.summary || null,
          monthlyAnalytics: result.monthlyAnalytics || null,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setRentalState({
          loadedKey: requestKey,
          rentals: [],
          summary: null,
          monthlyAnalytics: null,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load rental bookings.",
        });
      });

    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated, requestKey, token]);

  const rentalsLoading = isAuthLoading || rentalState.loadedKey !== requestKey;
  const loading = rentalsLoading || favoritesLoading;

  const stats = React.useMemo(
    () =>
      computeCustomerStats(
        rentalState.rentals,
        favoritesCount,
        rentalState.summary
      ),
    [favoritesCount, rentalState.rentals, rentalState.summary]
  );

  const monthlyActivity = React.useMemo(
    () =>
      aggregateMonthlyRentals(
        rentalState.rentals,
        rentalState.monthlyAnalytics
      ),
    [rentalState.monthlyAnalytics, rentalState.rentals]
  );

  const recentRentals = React.useMemo(
    () =>
      [...rentalState.rentals]
        .sort((a, b) =>
          String(b.createdAt || b.startDate).localeCompare(
            String(a.createdAt || a.startDate)
          )
        )
        .slice(0, 5),
    [rentalState.rentals]
  );

  const favoritePreview = React.useMemo(
    () => favorites.slice(0, 4),
    [favorites]
  );

  const combinedError = rentalState.error || favoritesError || null;

  const firstName =
    typeof user?.name === "string" && user.name.trim()
      ? user.name.trim().split(/\s+/)[0]
      : "";

  const handleRefreshAll = () => {
    setRefreshTick((prev) => prev + 1);
    refreshFavorites().catch(() => null);
  };

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
          onClick={handleRefreshAll}
        >
          <RefreshCw aria-hidden="true" className="size-3.5" />
          <span>Refresh Data</span>
        </Button>
      </header>

      {combinedError && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>
              {combinedError} Displaying verified empty state until customer API endpoints connect.
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefreshAll}>
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      <CustomerStats stats={stats} loading={loading} />

      <MonthlyRentalChart data={monthlyActivity} loading={rentalsLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentRentals rentals={recentRentals} loading={rentalsLoading} />
        <FavoritePreview
          favorites={favoritePreview}
          loading={favoritesLoading}
        />
      </div>
    </div>
  );
}
