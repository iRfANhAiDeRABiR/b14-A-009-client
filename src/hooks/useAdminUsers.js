"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import {
  buildAdminUsersQueryString,
  DEFAULT_ADMIN_PAGE_LIMIT,
  normalizeDisplayRole,
  parseAdminUsersFiltersFromParams,
} from "@/lib/adminUtils";
import { getAdminUsers } from "@/services/adminUserService";

export function useAdminUsers() {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard/admin/users";
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const { token, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const filters = React.useMemo(
    () => parseAdminUsersFiltersFromParams(new URLSearchParams(searchParamsKey)),
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
      limit: DEFAULT_ADMIN_PAGE_LIMIT,
      totalItems: 0,
      total: 0,
      totalPages: 0,
      serverPaginationSupported: false,
    },
    summary: null,
    error: null,
    errorStatus: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getAdminUsers({
      search: filters.search,
      role: filters.role,
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
          pagination: result.pagination,
          summary: result.summary || null,
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
            limit: DEFAULT_ADMIN_PAGE_LIMIT,
            totalItems: 0,
            total: 0,
            totalPages: 0,
            serverPaginationSupported: false,
          },
          summary: null,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load registered users.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [
    filters.limit,
    filters.page,
    filters.role,
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
      const qs = buildAdminUsersQueryString(nextFilters);
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

  const applyUpdatedUserRole = React.useCallback((userId, nextRole) => {
    const cleanId = String(userId || "");
    const resolved = normalizeDisplayRole(nextRole);
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        String(item._id) === cleanId ? { ...item, role: resolved } : item
      ),
    }));
  }, []);

  const applyUpdatedUser = React.useCallback((updatedRecord) => {
    if (!updatedRecord) return;
    const cleanId = String(updatedRecord._id || updatedRecord.id || "");
    if (!cleanId) return;
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        String(item._id) === cleanId ? { ...item, ...updatedRecord } : item
      ),
    }));
  }, []);

  const removeUserFromList = React.useCallback((userId) => {
    const cleanId = String(userId || "");
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => String(item._id) !== cleanId),
    }));
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.role !== "all" ||
      filters.status !== "all" ||
      filters.sort !== "newest"
  );

  return {
    filters,
    items: state.items,
    pagination: state.pagination,
    summary: state.summary,
    error: state.error,
    errorStatus: state.errorStatus,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
    applyUpdatedUserRole,
    applyUpdatedUser,
    removeUserFromList,
  };
}
