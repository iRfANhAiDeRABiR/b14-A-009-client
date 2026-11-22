"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import {
  buildOwnerEquipmentQueryString,
  computeOwnerEquipmentStats,
  DEFAULT_OWNER_EQUIPMENT_LIMIT,
  parseOwnerEquipmentFiltersFromParams,
} from "@/lib/ownerUtils";
import { getMyEquipment } from "@/services/equipmentService";

export function useOwnerEquipment() {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard/owner/my-equipment";
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const { user, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const filters = React.useMemo(
    () =>
      parseOwnerEquipmentFiltersFromParams(new URLSearchParams(searchParamsKey)),
    [searchParamsKey]
  );

  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${user?.id || user?.email || "owner"}|${searchParamsKey}|${
    token ? "auth" : "anon"
  }|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    items: [],
    stats: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    pagination: {
      currentPage: filters.page,
      limit: DEFAULT_OWNER_EQUIPMENT_LIMIT,
      totalItems: 0,
      totalPages: 0,
      serverPaginationSupported: false,
    },
    error: null,
    errorStatus: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getMyEquipment({
      search: filters.search,
      category: filters.category,
      status: filters.status,
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
          stats: result.stats,
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
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
          },
          pagination: {
            currentPage: filters.page,
            limit: DEFAULT_OWNER_EQUIPMENT_LIMIT,
            totalItems: 0,
            totalPages: 0,
            serverPaginationSupported: false,
          },
          error:
            error instanceof Error
              ? error.message
              : "Unable to load your equipment inventory.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [
    filters.category,
    filters.limit,
    filters.page,
    filters.search,
    filters.sort,
    filters.status,
    isAuthLoading,
    isAuthenticated,
    requestKey,
    token,
  ]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;

  const pushFiltersToUrl = React.useCallback(
    (nextFilters) => {
      const qs = buildOwnerEquipmentQueryString(nextFilters);
      const nextUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router]
  );

  const updateFilters = React.useCallback(
    (partial) => {
      pushFiltersToUrl({
        ...filters,
        ...partial,
        page: 1,
      });
    },
    [filters, pushFiltersToUrl]
  );

  const setPage = React.useCallback(
    (nextPage) => {
      pushFiltersToUrl({
        ...filters,
        page: Math.max(1, Number(nextPage) || 1),
      });
    },
    [filters, pushFiltersToUrl]
  );

  const clearFilters = React.useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const retry = React.useCallback(() => {
    setRefreshTick((prev) => prev + 1);
  }, []);

  const removeItemFromState = React.useCallback((deletedId) => {
    const cleanDeletedId = String(deletedId || "");
    setState((prev) => {
      const remaining = prev.items.filter(
        (entry) => String(entry._id) !== cleanDeletedId
      );
      const nextTotalItems = Math.max(
        0,
        (prev.pagination?.totalItems ?? prev.items.length) - 1
      );
      const deletedItem = prev.items.find(
        (entry) => String(entry._id) === cleanDeletedId
      );
      const deletedStatus = String(deletedItem?.status || "").toLowerCase();

      return {
        ...prev,
        items: remaining,
        stats: computeOwnerEquipmentStats(remaining, {
          totalEquipment: nextTotalItems,
          pendingCount:
            deletedStatus === "pending"
              ? Math.max(0, prev.stats.pending - 1)
              : prev.stats.pending,
          approvedCount:
            deletedStatus === "approved"
              ? Math.max(0, prev.stats.approved - 1)
              : prev.stats.approved,
          rejectedCount:
            deletedStatus === "rejected"
              ? Math.max(0, prev.stats.rejected - 1)
              : prev.stats.rejected,
        }),
        pagination: {
          ...prev.pagination,
          totalItems: nextTotalItems,
        },
      };
    });
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.category !== "all" ||
      filters.status !== "all" ||
      filters.sort !== "newest"
  );

  return {
    filters,
    items: state.items,
    stats: state.stats,
    pagination: state.pagination,
    error: state.error,
    errorStatus: state.errorStatus,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
    removeItemFromState,
  };
}
