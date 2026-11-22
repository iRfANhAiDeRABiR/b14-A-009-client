"use client";

import * as React from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  DEFAULT_ADMIN_PERIOD,
  normalizeAdminAnalyticsPeriod,
  UNAVAILABLE_ADMIN_ANALYTICS,
} from "@/lib/adminUtils";
import { getAdminAnalytics } from "@/services/adminAnalyticsService";

export function useAdminAnalytics(initialPeriod = DEFAULT_ADMIN_PERIOD) {
  const { user, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [period, setPeriodState] = React.useState(() =>
    normalizeAdminAnalyticsPeriod(initialPeriod)
  );
  const [refreshTick, setRefreshTick] = React.useState(0);

  const requestKey = `${user?.id || user?.email || "admin"}|${period}|${
    token ? "auth" : "anon"
  }|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    data: UNAVAILABLE_ADMIN_ANALYTICS,
    error: null,
    errorStatus: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getAdminAnalytics({ period, token })
      .then((normalized) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          data: normalized,
          error: null,
          errorStatus: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          data: UNAVAILABLE_ADMIN_ANALYTICS,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load platform analytics from the backend API.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated, period, requestKey, token]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;

  const setPeriod = React.useCallback((nextPeriod) => {
    setPeriodState(normalizeAdminAnalyticsPeriod(nextPeriod));
  }, []);

  const retry = React.useCallback(() => {
    setRefreshTick((prev) => prev + 1);
  }, []);

  return {
    period,
    setPeriod,
    data: state.data,
    loading,
    error: state.error,
    errorStatus: state.errorStatus,
    retry,
  };
}
