"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getEquipment } from "@/services/equipmentService";

export const DEFAULT_LIMIT = 9;

function parseFiltersFromSearchParams(searchParams) {
  const rawPage = Number(searchParams.get("page"));

  return {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    rentalType: searchParams.get("rentalType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    availability: searchParams.get("availability") || "",
    sort: searchParams.get("sort") || "featured",
    page: Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1,
    limit: DEFAULT_LIMIT,
  };
}

function buildQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.category) params.set("category", filters.category);
  if (filters.rentalType) params.set("rentalType", filters.rentalType);
  if (filters.minPrice !== "") params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== "") params.set("maxPrice", String(filters.maxPrice));
  if (filters.availability) params.set("availability", filters.availability);
  if (filters.sort && filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }
  if (filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
}

export function useEquipment() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const filters = React.useMemo(
    () => parseFiltersFromSearchParams(new URLSearchParams(searchParamsKey)),
    [searchParamsKey]
  );

  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${searchParamsKey}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: null,
    items: [],
    pagination: {
      currentPage: filters.page,
      limit: DEFAULT_LIMIT,
      totalItems: 0,
      totalPages: 0,
    },
    source: "demo",
    error: null,
  });

  React.useEffect(() => {
    let active = true;

    getEquipment(filters).then((result) => {
      if (!active) return;
      setState({
        loadedKey: requestKey,
        items: result.items,
        pagination: result.pagination,
        source: result.source,
        error: result.error,
      });
    });

    return () => {
      active = false;
    };
  }, [filters, requestKey]);

  const loading = state.loadedKey !== requestKey;

  const updateFilters = React.useCallback(
    (patch, { resetPage = true } = {}) => {
      const nextFilters = {
        ...filters,
        ...patch,
        page: resetPage ? 1 : patch.page ?? filters.page,
      };
      const nextQuery = buildQueryString(nextFilters);
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    },
    [filters, pathname, router]
  );

  const clearAllFilters = React.useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const setPage = React.useCallback(
    (nextPage) => {
      updateFilters({ page: Math.max(1, nextPage) }, { resetPage: false });
    },
    [updateFilters]
  );

  const retry = React.useCallback(() => {
    setRefreshTick((tick) => tick + 1);
  }, []);

  const hasActiveFilters = Boolean(
    filters.search.trim() ||
      filters.category ||
      filters.rentalType ||
      filters.minPrice !== "" ||
      filters.maxPrice !== "" ||
      filters.availability ||
      (filters.sort && filters.sort !== "featured")
  );

  return {
    filters,
    items: state.items,
    pagination: state.pagination,
    source: state.source,
    error: state.error,
    loading,
    hasActiveFilters,
    updateFilters,
    clearAllFilters,
    setPage,
    retry,
  };
}
