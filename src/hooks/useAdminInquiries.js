"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAdminInquiries } from "@/services/adminInquiryService";

export function useAdminInquiries() {
  const { token, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const [filters, setFilters] = React.useState({
    search: "",
    status: "all",
    inquiryType: "all",
    sort: "newest",
    page: 1,
    limit: 10,
  });
  const [refreshTick, setRefreshTick] = React.useState(0);

  const requestKey = `${JSON.stringify(filters)}|${token ? "auth" : "anon"}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    items: [],
    pagination: {
      currentPage: 1,
      page: 1,
      limit: 10,
      totalItems: 0,
      total: 0,
      totalPages: 0,
    },
    summary: null,
    error: null,
    errorStatus: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;
    let active = true;

    getAdminInquiries({ ...filters, token })
      .then((res) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          items: res.items || [],
          pagination: res.pagination,
          summary: res.summary || null,
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
            limit: filters.limit,
            totalItems: 0,
            total: 0,
            totalPages: 0,
          },
          summary: null,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load support inquiries.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [filters, isAuthLoading, isAuthenticated, requestKey, token]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;

  const updateFilters = React.useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  }, []);

  const setPage = React.useCallback((nextPage) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Number(nextPage) || 1),
    }));
  }, []);

  const clearFilters = React.useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      inquiryType: "all",
      sort: "newest",
      page: 1,
      limit: 10,
    });
  }, []);

  const retry = React.useCallback(() => {
    setRefreshTick((prev) => prev + 1);
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status !== "all" ||
      filters.inquiryType !== "all" ||
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
    setPage,
    clearFilters,
    retry,
  };
}
