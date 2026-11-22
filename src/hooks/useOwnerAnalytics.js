"use client";

import * as React from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  DEFAULT_OWNER_PERIOD,
  normalizeOwnerAnalyticsPayload,
  normalizeOwnerAnalyticsPeriod,
} from "@/lib/ownerUtils";
import { getOwnerAnalytics } from "@/services/ownerAnalyticsService";

const EMPTY_ANALYTICS = normalizeOwnerAnalyticsPayload({});

export function useOwnerAnalytics(initialPeriod = DEFAULT_OWNER_PERIOD) {
  const { user, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [period, setPeriodState] = React.useState(() =>
    normalizeOwnerAnalyticsPeriod(initialPeriod)
  );
  const [refreshTick, setRefreshTick] = React.useState(0);

  const requestKey = `${user?.id || user?.email || "owner"}|${period}|${
    token ? "auth" : "anon"
  }|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    data: EMPTY_ANALYTICS,
    error: null,
    errorStatus: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getOwnerAnalytics({ period, token })
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
          data: EMPTY_ANALYTICS,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load owner analytics data.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated, period, requestKey, token]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;

  const setPeriod = React.useCallback((nextPeriod) => {
    setPeriodState(normalizeOwnerAnalyticsPeriod(nextPeriod));
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
