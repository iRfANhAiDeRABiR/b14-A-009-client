"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import {
  buildOwnerRentalsQueryString,
  DEFAULT_OWNER_RENTALS_LIMIT,
  parseOwnerRentalsFiltersFromParams,
} from "@/lib/ownerUtils";
import { getOwnerRentals } from "@/services/bookingService";
import { getMyEquipment } from "@/services/equipmentService";

export function useOwnerRentals() {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard/owner/rentals";
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const { token, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const filters = React.useMemo(
    () => parseOwnerRentalsFiltersFromParams(new URLSearchParams(searchParamsKey)),
    [searchParamsKey]
  );

  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${searchParamsKey}|${token ? "auth" : "anon"}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    items: [],
    stats: {
      totalBookings: 0,
      pendingBookings: 0,
      activeRentals: 0,
      completedRentals: 0,
      isPartialSummary: false,
    },
    pagination: {
      currentPage: filters.page,
      page: filters.page,
      limit: DEFAULT_OWNER_RENTALS_LIMIT,
      totalItems: 0,
      total: 0,
      totalPages: 0,
      serverPaginationSupported: false,
    },
    error: null,
    errorStatus: null,
  });

  const [ownerEquipmentList, setOwnerEquipmentList] = React.useState([]);

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getMyEquipment({ limit: 100, token })
      .then((res) => {
        if (!active) return;
        const options = Array.isArray(res?.items)
          ? res.items
              .filter((item) => item?._id && item?.name)
              .map((item) => ({
                _id: String(item._id),
                name: String(item.name),
                category: String(item.category || ""),
              }))
          : [];
        setOwnerEquipmentList(options);
      })
      .catch(() => {
        // Optional equipment filter list falls back cleanly to rental records returned below.
      });

    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated, token, refreshTick]);

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getOwnerRentals({
      search: filters.search,
      bookingStatus: filters.bookingStatus,
      paymentStatus: filters.paymentStatus,
      equipmentId: filters.equipmentId,
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
      token,
    })
      .then((result) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          items: result.items || [],
          stats: result.stats || {
            totalBookings: 0,
            pendingBookings: 0,
            activeRentals: 0,
            completedRentals: 0,
            isPartialSummary: false,
          },
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
          stats: {
            totalBookings: 0,
            pendingBookings: 0,
            activeRentals: 0,
            completedRentals: 0,
            isPartialSummary: false,
          },
          pagination: {
            currentPage: filters.page,
            page: filters.page,
            limit: DEFAULT_OWNER_RENTALS_LIMIT,
            totalItems: 0,
            total: 0,
            totalPages: 0,
            serverPaginationSupported: false,
          },
          error:
            error instanceof Error
              ? error.message
              : "Unable to load rental bookings for your equipment.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [
    filters.bookingStatus,
    filters.equipmentId,
    filters.limit,
    filters.page,
    filters.paymentStatus,
    filters.search,
    filters.sort,
    isAuthLoading,
    isAuthenticated,
    requestKey,
    token,
  ]);

  const equipmentOptions = React.useMemo(() => {
    const map = new Map();
    for (const eq of ownerEquipmentList) {
      if (eq?._id) {
        map.set(String(eq._id), eq);
      }
    }
    for (const rental of state.items) {
      const eq = rental?.equipment;
      if (eq?._id && eq?.name && !map.has(String(eq._id))) {
        map.set(String(eq._id), {
          _id: String(eq._id),
          name: String(eq.name),
          category: String(eq.category || ""),
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [ownerEquipmentList, state.items]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;

  const pushFiltersToUrl = React.useCallback(
    (nextFilters) => {
      const qs = buildOwnerRentalsQueryString(nextFilters);
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
      filters.paymentStatus !== "all" ||
      filters.equipmentId !== "all" ||
      filters.sort !== "newest"
  );

  return {
    filters,
    items: state.items,
    stats: state.stats,
    pagination: state.pagination,
    equipmentOptions,
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
