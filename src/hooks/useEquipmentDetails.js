"use client";

import * as React from "react";
import { getEquipmentById } from "@/services/equipmentService";

export function useEquipmentDetails(
  equipmentId,
  { token = null, authLoading = false } = {}
) {
  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${equipmentId || ""}|${token ? "auth" : "anon"}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: null,
    item: null,
    notFound: false,
    source: "demo",
    error: null,
  });

  React.useEffect(() => {
    if (authLoading) return;

    let active = true;

    async function load() {
      const result = await getEquipmentById(equipmentId, {
        token,
      });

      if (!active) return;

      setState({
        loadedKey: requestKey,
        item: result.item,
        notFound: result.notFound,
        source: result.source,
        error: result.error,
      });
    }

    load();

    return () => {
      active = false;
    };
  }, [authLoading, equipmentId, requestKey, token]);

  const loading = authLoading || state.loadedKey !== requestKey;

  const retry = React.useCallback(() => {
    setRefreshTick((prev) => prev + 1);
  }, []);

  return {
    ...state,
    loading,
    retry,
  };
}
