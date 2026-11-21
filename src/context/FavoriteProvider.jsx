"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { buildLoginRedirectUrl } from "@/lib/authValidation";
import { computeFavoriteStats } from "@/lib/customerUtils";
import { USER_ROLES } from "@/lib/roleNavigation";
import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "@/services/favoriteService";

export const FavoriteContext = React.createContext(null);

export function FavoriteProvider({ children }) {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    user,
    role,
    token,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const isCustomer = isAuthenticated && role === USER_ROLES.CUSTOMER;
  const sessionKey = isCustomer
    ? `${user?.id || user?.email || "customer"}|${token ? "jwt" : "cookie"}`
    : "";

  const fetchKey = sessionKey || "";

  const [state, setState] = React.useState({
    loadedKey: "",
    items: [],
    error: "",
  });

  const [mutatingIds, setMutatingIds] = React.useState({});
  const mutatingRef = React.useRef(new Set());

  React.useEffect(() => {
    if (isAuthLoading || !fetchKey || !token) {
      return undefined;
    }

    let active = true;

    getMyFavorites({ token })
      .then((items) => {
        if (!active) return;
        setState({
          loadedKey: fetchKey,
          items: items || [],
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          loadedKey: fetchKey,
          items: [],
          error:
            error instanceof Error
              ? error.message
              : "Unable to load saved favorites from server.",
        });
      });

    return () => {
      active = false;
    };
  }, [fetchKey, isAuthLoading, token]);

  const favorites = React.useMemo(
    () => (isCustomer ? state.items : []),
    [isCustomer, state.items]
  );
  const error = isCustomer ? state.error : "";
  const isLoading = Boolean(
    isAuthLoading || (isCustomer && token && state.loadedKey !== fetchKey)
  );

  const favoriteIds = React.useMemo(
    () => new Set(favorites.map((item) => String(item.equipmentId))),
    [favorites]
  );

  const favoriteStats = React.useMemo(
    () => computeFavoriteStats(favorites),
    [favorites]
  );

  const refreshFavorites = React.useCallback(async () => {
    if (!isCustomer || !token) return [];
    try {
      const items = await getMyFavorites({ token });
      setState({
        loadedKey: fetchKey,
        items: items || [],
        error: "",
      });
      return items || [];
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load saved favorites from server.";
      setState((prev) => ({
        ...prev,
        loadedKey: fetchKey,
        error: message,
      }));
      return [];
    }
  }, [fetchKey, isCustomer, token]);

  const setItemMutating = (equipmentId, active) => {
    const id = String(equipmentId);
    if (active) {
      mutatingRef.current.add(id);
    } else {
      mutatingRef.current.delete(id);
    }
    setMutatingIds((prev) => {
      if (active) return { ...prev, [id]: true };
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const ensureCustomerAccess = React.useCallback(
    (redirectPath = "/") => {
      if (!isAuthenticated || !token) {
        showToast({
          title: "Authentication required",
          description: "Please sign in with a Customer account to manage favorites.",
          variant: "warning",
        });
        if (redirectPath) {
          router.push(buildLoginRedirectUrl(redirectPath));
        }
        return { allowed: false, requiresAuth: true };
      }

      if (role !== USER_ROLES.CUSTOMER) {
        showToast({
          title: "Customer permission required",
          description:
            "Favorites are restricted to Customer accounts.",
          variant: "warning",
        });
        return { allowed: false, forbidden: true };
      }

      return { allowed: true };
    },
    [isAuthenticated, role, router, showToast, token]
  );

  const addFavoriteItem = React.useCallback(
    async (equipmentId, { redirectPath = "/" } = {}) => {
      const id = String(equipmentId || "");
      if (!id) return { ok: false };

      const access = ensureCustomerAccess(redirectPath);
      if (!access.allowed) return { ok: false, ...access };

      if (mutatingRef.current.has(id) || favoriteIds.has(id)) {
        return { ok: true, favorited: true, deduplicated: true };
      }

      setItemMutating(id, true);

      try {
        await addFavorite({ equipmentId: id, token });
        // Re-sync from server so overview preview, count, and table reflect exact MongoDB state.
        await refreshFavorites().catch(() => null);

        showToast({
          title: "Saved to favorites",
          description: "Equipment added to your saved favorites list.",
          variant: "success",
        });
        return { ok: true, favorited: true };
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to save equipment to favorites.";
        showToast({
          title: "Could not save favorite",
          description: message,
          variant: "error",
        });
        return { ok: false, error: message };
      } finally {
        setItemMutating(id, false);
      }
    },
    [ensureCustomerAccess, favoriteIds, refreshFavorites, showToast, token]
  );

  const removeFavoriteItem = React.useCallback(
    async (equipmentId, { equipmentName = "", redirectPath = "/" } = {}) => {
      const id = String(equipmentId || "");
      if (!id) return { ok: false };

      const access = ensureCustomerAccess(redirectPath);
      if (!access.allowed) return { ok: false, ...access };

      if (mutatingRef.current.has(id)) {
        return { ok: false, inProgress: true };
      }

      setItemMutating(id, true);

      try {
        await removeFavorite({ equipmentId: id, token });
        setState((prev) => ({
          ...prev,
          items: prev.items.filter((entry) => String(entry.equipmentId) !== id),
        }));

        showToast({
          title: "Removed from favorites",
          description: equipmentName
            ? `${equipmentName} was removed from your saved favorites.`
            : "Equipment was removed from your saved list.",
          variant: "success",
        });
        return { ok: true, favorited: false };
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to remove favorite right now.";
        showToast({
          title: "Removal failed",
          description: message,
          variant: "error",
        });
        return { ok: false, error: message };
      } finally {
        setItemMutating(id, false);
      }
    },
    [ensureCustomerAccess, showToast, token]
  );

  const toggleFavoriteItem = React.useCallback(
    async (equipmentId, { equipmentName = "", redirectPath = "/" } = {}) => {
      const id = String(equipmentId || "");
      if (!id) return { ok: false };

      if (favoriteIds.has(id)) {
        return removeFavoriteItem(id, { equipmentName, redirectPath });
      }
      return addFavoriteItem(id, { redirectPath });
    },
    [addFavoriteItem, favoriteIds, removeFavoriteItem]
  );

  const value = React.useMemo(
    () => ({
      favorites,
      favoriteIds,
      favoritesCount: favoriteStats.total,
      favoriteStats,
      isLoading,
      error,
      canManageFavorites: isCustomer,
      isAuthenticated,
      role,
      mutatingIds,
      isMutatingAny: Object.keys(mutatingIds).length > 0,
      isMutatingItem: (id) => Boolean(mutatingIds[String(id || "")]),
      isFavoriteItem: (id) => favoriteIds.has(String(id || "")),
      refreshFavorites,
      addFavoriteItem,
      removeFavoriteItem,
      toggleFavoriteItem,
    }),
    [
      addFavoriteItem,
      error,
      favoriteIds,
      favoriteStats,
      favorites,
      isAuthenticated,
      isCustomer,
      isLoading,
      mutatingIds,
      refreshFavorites,
      removeFavoriteItem,
      role,
      toggleFavoriteItem,
    ]
  );

  return (
    <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>
  );
}
