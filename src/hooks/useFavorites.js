"use client";

import * as React from "react";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/services/favoriteService";
import { useToast } from "@/context/ToastContext";

export function useFavorites({ equipmentId, token = null } = {}) {
  const { showToast } = useToast();
  const [listState, setListState] = React.useState({
    loadedToken: null,
    ids: [],
    error: "",
  });
  const [isMutating, setIsMutating] = React.useState(false);
  const [mutationError, setMutationError] = React.useState("");

  React.useEffect(() => {
    let active = true;

    if (!token) return;

    getFavorites({ token }).then((result) => {
      if (!active) return;
      const ids = result.items
        .map((fav) => fav?.equipmentId || fav?.equipment?._id || fav?._id)
        .filter(Boolean)
        .map(String);

      setListState({
        loadedToken: token,
        ids: Array.from(new Set(ids)),
        error: result.error || "",
      });
    });

    return () => {
      active = false;
    };
  }, [token]);

  const isLoadingList = Boolean(token) && listState.loadedToken !== token;
  const activeIds = token ? listState.ids : [];
  const isFavorite = equipmentId
    ? activeIds.includes(String(equipmentId))
    : false;
  const errorMessage = mutationError || (token ? listState.error : "");

  const toggleFavorite = React.useCallback(async () => {
    if (!equipmentId || isMutating) return { ok: false };

    setMutationError("");
    setIsMutating(true);

    try {
      if (!token) {
        const message =
          "Sign in required to save favorites to your account.";
        setMutationError(message);
        showToast({
          title: "Authentication required",
          description:
            "Please log in to add or manage favorite equipment.",
          variant: "warning",
        });
        return { ok: false, requiresAuth: true };
      }

      if (isFavorite) {
        await removeFavorite({ equipmentId, token });
        setListState((prev) => ({
          ...prev,
          ids: prev.ids.filter((id) => id !== String(equipmentId)),
        }));
        showToast({
          title: "Removed from favorites",
          description: "This equipment was removed from your saved list.",
          variant: "neutral",
        });
        return { ok: true, favorited: false };
      } else {
        await addFavorite({ equipmentId, token });
        setListState((prev) => ({
          ...prev,
          ids: prev.ids.includes(String(equipmentId))
            ? prev.ids
            : [...prev.ids, String(equipmentId)],
        }));
        showToast({
          title: "Saved to favorites",
          description: "You can revisit this item from your Favorites list.",
          variant: "success",
        });
        return { ok: true, favorited: true };
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update favorite status.";
      setMutationError(message);
      showToast({
        title: "Could not update favorites",
        description: message,
        variant: "error",
      });
      return { ok: false, error: message };
    } finally {
      setIsMutating(false);
    }
  }, [equipmentId, isFavorite, isMutating, showToast, token]);

  return {
    isFavorite,
    isLoading: isLoadingList || isMutating,
    isMutating,
    errorMessage,
    toggleFavorite,
  };
}
