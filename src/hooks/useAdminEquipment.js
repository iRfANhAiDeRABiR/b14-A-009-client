"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import {
  buildAdminEquipmentQueryString,
  computeOwnerEquipmentStats,
  DEFAULT_ADMIN_PAGE_LIMIT,
  parseAdminEquipmentFiltersFromParams,
} from "@/lib/adminUtils";
import { getAdminEquipment } from "@/services/adminEquipmentService";

export function useAdminEquipment() {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard/admin/equipment";
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const { token, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const filters = React.useMemo(
    () => parseAdminEquipmentFiltersFromParams(new URLSearchParams(searchParamsKey)),
    [searchParamsKey]
  );

  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${searchParamsKey}|${token ? "auth" : "anon"}|${refreshTick}`;

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
      page: filters.page,
      limit: DEFAULT_ADMIN_PAGE_LIMIT,
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

    getAdminEquipment({
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
          stats: result.stats || {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
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
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
          },
          pagination: {
            currentPage: filters.page,
            page: filters.page,
            limit: DEFAULT_ADMIN_PAGE_LIMIT,
            totalItems: 0,
            total: 0,
            totalPages: 0,
            serverPaginationSupported: false,
          },
          error:
            error instanceof Error
              ? error.message
              : "Unable to load marketplace equipment records.",
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
      const qs = buildAdminEquipmentQueryString(nextFilters);
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

  const syncDeletedItem = React.useCallback((deletedId) => {
    const cleanId = String(deletedId || "");
    setState((prev) => {
      const nextItems = prev.items.filter((item) => String(item._id) !== cleanId);
      const nextTotal = Math.max(0, (prev.pagination.totalItems || 0) - 1);
      return {
        ...prev,
        items: nextItems,
        stats: computeOwnerEquipmentStats(nextItems, null, nextTotal),
        pagination: {
          ...prev.pagination,
          totalItems: nextTotal,
          total: nextTotal,
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
    syncDeletedItem,
  };
}
