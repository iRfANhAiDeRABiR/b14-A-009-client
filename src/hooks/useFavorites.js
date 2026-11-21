"use client";

import * as React from "react";
import { FavoriteContext } from "@/context/FavoriteProvider";
import { USER_ROLES } from "@/lib/roleNavigation";

export function useFavorites({ equipmentId, redirectPath = "/" } = {}) {
  const context = React.useContext(FavoriteContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoriteProvider.");
  }

  const targetId = equipmentId ? String(equipmentId) : "";
  const isFavorite = targetId ? context.isFavoriteItem(targetId) : false;
  const isMutating = targetId
    ? context.isMutatingItem(targetId)
    : context.isMutatingAny;

  const isNonCustomerRole = Boolean(
    context.isAuthenticated &&
      context.role &&
      context.role !== USER_ROLES.CUSTOMER
  );

  const toggleFavorite = React.useCallback(async () => {
    if (!targetId) return { ok: false };
    return context.toggleFavoriteItem(targetId, { redirectPath });
  }, [context, redirectPath, targetId]);

  return {
    favorites: context.favorites,
    favoriteIds: context.favoriteIds,
    favoritesCount: context.favoritesCount,
    favoriteStats: context.favoriteStats,
    isFavorite,
    isLoading: targetId ? context.isLoading || isMutating : context.isLoading,
    isMutating,
    isMutatingItem: context.isMutatingItem,
    canManageFavorites: context.canManageFavorites,
    isNonCustomerRole,
    errorMessage: context.error || "",
    refreshFavorites: context.refreshFavorites,
    addFavoriteItem: context.addFavoriteItem,
    removeFavoriteItem: context.removeFavoriteItem,
    toggleFavorite,
  };
}
