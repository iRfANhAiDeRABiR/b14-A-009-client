"use client";

import * as React from "react";
import { getAuthState } from "@/lib/authBoundary";
import { getEquipmentById } from "@/services/equipmentService";

export function useEquipmentDetails(equipmentId) {
  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${equipmentId || ""}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: null,
    item: null,
    notFound: false,
    source: "demo",
    error: null,
    auth: {
      isAuthConfigured: false,
      isAuthenticated: false,
      user: null,
      token: null,
    },
  });

  React.useEffect(() => {
    let active = true;

    async function load() {
      const auth = await getAuthState();
      const result = await getEquipmentById(equipmentId, {
        token: auth.token,
      });

      if (!active) return;

      setState({
        loadedKey: requestKey,
        item: result.item,
        notFound: result.notFound,
        source: result.source,
        error: result.error,
        auth,
      });
    }

    load();

    return () => {
      active = false;
    };
  }, [equipmentId, requestKey]);

  const loading = state.loadedKey !== requestKey;

  const retry = React.useCallback(() => {
    setRefreshTick((tick) => tick + 1);
  }, []);

  return {
    item: state.item,
    notFound: state.notFound,
    source: state.source,
    error: state.error,
    auth: state.auth,
    loading,
    retry,
  };
}
