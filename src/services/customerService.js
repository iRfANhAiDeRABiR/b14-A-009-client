import {
  aggregateMonthlyRentals,
  computeCustomerStats,
} from "@/lib/customerUtils";
import { getMyRentals } from "@/services/bookingService";
import { getMyFavorites } from "@/services/favoriteService";

/**
 * Aggregate the authenticated customer's overview from authorized rentals and favorites.
 * Never fabricates statistics or returns demo data as customer records.
 */
export async function getCustomerDashboard({ token = null } = {}) {
  const [rentalsResult, favoritesResult] = await Promise.allSettled([
    getMyRentals({ limit: 50, token }),
    getMyFavorites({ token }),
  ]);

  const errors = [];
  let rentals = [];
  let summary = null;
  let monthlyAnalytics = null;
  let favorites = [];

  if (rentalsResult.status === "fulfilled") {
    rentals = rentalsResult.value.items || [];
    summary = rentalsResult.value.summary || null;
    monthlyAnalytics = rentalsResult.value.monthlyAnalytics || null;
  } else {
    errors.push(
      rentalsResult.reason instanceof Error
        ? rentalsResult.reason.message
        : "Unable to load rental bookings."
    );
  }

  if (favoritesResult.status === "fulfilled") {
    favorites = favoritesResult.value || [];
  } else {
    errors.push(
      favoritesResult.reason instanceof Error
        ? favoritesResult.reason.message
        : "Unable to load saved favorites."
    );
  }

  const stats = computeCustomerStats(rentals, favorites.length, summary);
  const monthlyActivity = aggregateMonthlyRentals(rentals, monthlyAnalytics);

  const recentRentals = [...rentals]
    .sort((a, b) =>
      String(b.createdAt || b.startDate).localeCompare(
        String(a.createdAt || a.startDate)
      )
    )
    .slice(0, 5);

  const favoritePreview = favorites.slice(0, 4);

  return {
    stats,
    monthlyActivity,
    recentRentals,
    favoritePreview,
    error:
      errors.length === 2
        ? errors[0]
        : errors.length === 1
          ? errors[0]
          : null,
    partialError: errors.length > 0 && errors.length < 2 ? errors[0] : null,
  };
}
