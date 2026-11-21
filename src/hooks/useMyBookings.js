"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import {
  buildBookingsQueryString,
  DEFAULT_BOOKINGS_LIMIT,
  parseBookingsFiltersFromParams,
} from "@/lib/customerUtils";
import { getMyBookings } from "@/services/bookingService";

export function useMyBookings() {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard/customer/my-rentals";
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const { token, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const filters = React.useMemo(
    () => parseBookingsFiltersFromParams(new URLSearchParams(searchParamsKey)),
    [searchParamsKey]
  );

  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${searchParamsKey}|${token ? "auth" : "anon"}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    items: [],
    pagination: {
      currentPage: filters.page,
      page: filters.page,
      limit: DEFAULT_BOOKINGS_LIMIT,
      totalItems: 0,
      total: 0,
      totalPages: 0,
      serverPaginationSupported: false,
    },
    error: null,
    errorStatus: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getMyBookings({
      bookingStatus: filters.bookingStatus,
      paymentStatus: filters.paymentStatus,
      search: filters.search,
      page: filters.page,
      limit: filters.limit,
      token,
    })
      .then((result) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          items: result.items || [],
          pagination: result.pagination,
          error: null,
          errorStatus: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          items: [],
          pagination: {
            currentPage: filters.page,
            page: filters.page,
            limit: DEFAULT_BOOKINGS_LIMIT,
            totalItems: 0,
            total: 0,
            totalPages: 0,
            serverPaginationSupported: false,
          },
          error:
            error instanceof Error
              ? error.message
              : "Unable to load your rental booking history.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [
    filters.bookingStatus,
    filters.limit,
    filters.page,
    filters.paymentStatus,
    filters.search,
    isAuthLoading,
    isAuthenticated,
    requestKey,
    token,
  ]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;

  const pushFiltersToUrl = React.useCallback(
    (nextFilters) => {
      const qs = buildBookingsQueryString(nextFilters);
      const nextUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router]
  );

  const updateFilters = React.useCallback(
    (partial) => {
      const next = {
        ...filters,
        ...partial,
        page: 1,
      };
      pushFiltersToUrl(next);
    },
    [filters, pushFiltersToUrl]
  );

  const setPage = React.useCallback(
    (nextPage) => {
      const safePage = Math.max(1, Number(nextPage) || 1);
      pushFiltersToUrl({ ...filters, page: safePage });
    },
    [filters, pushFiltersToUrl]
  );

  const clearFilters = React.useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const retry = React.useCallback(() => {
    setRefreshTick((prev) => prev + 1);
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.bookingStatus !== "all" ||
      filters.paymentStatus !== "all"
  );

  return {
    filters,
    items: state.items,
    pagination: state.pagination,
    error: state.error,
    errorStatus: state.errorStatus,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
  };
}
