"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ExternalLink,
  Heart,
  MapPin,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import {
  getMyFavorites,
  removeFavorite,
} from "@/services/favoriteService";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";

function getAvailabilityBadgeVariant(statusLabel) {
  const lower = String(statusLabel || "").toLowerCase();
  if (lower.includes("unavailable") || lower === "out of stock") return "danger";
  if (lower.includes("limited")) return "warning";
  if (lower.includes("available")) return "success";
  return "neutral";
}

function FavoritesSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden rounded-2xl">
      <div className="divide-y divide-border">
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex items-center gap-4 p-4 sm:px-6">
            <Skeleton className="size-14 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function FavoritesTable() {
  const { showToast } = useToast();
  const { token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [refreshTick, setRefreshTick] = React.useState(0);

  const requestKey = `${token ? "auth" : "pending"}|${refreshTick}`;

  const [state, setState] = React.useState({
    loadedKey: "",
    items: [],
    error: null,
  });

  const [confirmTarget, setConfirmTarget] = React.useState(null);
  const [removingId, setRemovingId] = React.useState("");

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getMyFavorites({ token })
      .then((items) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          items: items || [],
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          loadedKey: requestKey,
          items: [],
          error:
            error instanceof Error
              ? error.message
              : "Unable to load favorite equipment.",
        });
      });

    return () => {
      active = false;
    };
  }, [isAuthLoading, isAuthenticated, requestKey, token]);

  const loading = isAuthLoading || state.loadedKey !== requestKey;

  const handleConfirmRemove = async () => {
    if (!confirmTarget || removingId) return;

    const targetId = confirmTarget.equipmentId;
    setRemovingId(targetId);

    try {
      await removeFavorite({ equipmentId: targetId, token });

      setState((prev) => ({
        ...prev,
        items: prev.items.filter((entry) => entry.equipmentId !== targetId),
      }));

      showToast({
        title: "Removed from favorites",
        description: `${confirmTarget.name} was removed from your saved equipment.`,
        variant: "success",
      });
      setConfirmTarget(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to remove favorite right now.";
      showToast({
        title: "Removal failed",
        description: message,
        variant: "error",
      });
    } finally {
      setRemovingId("");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="type-page-title text-foreground">My Favorites</h1>
            {!loading ? (
              <Badge variant="primary" size="md">
                {state.items.length} saved
              </Badge>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Your saved equipment, all in one place.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => setRefreshTick((prev) => prev + 1)}
        >
          <RefreshCw aria-hidden="true" className="size-3.5" />
          <span>Refresh</span>
        </Button>
      </header>

      {state.error && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{state.error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshTick((prev) => prev + 1)}
          >
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      {loading ? (
        <FavoritesSkeleton />
      ) : state.items.length === 0 ? (
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <Heart className="size-7" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            No Favorites Yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            Save equipment you like and find it here whenever you need it.
          </p>
          <div className="mt-6 flex justify-center">
            <Button href="/equipment" variant="primary" size="md">
              Explore Equipment
            </Button>
          </div>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <th scope="col" className="px-5 py-3.5">
                    Equipment
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Rental Price
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Rental Type
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Availability
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {state.items.map((item) => {
                  const badgeVariant = getAvailabilityBadgeVariant(
                    item.availabilityStatus
                  );
                  const isRemovingThis = removingId === item.equipmentId;

                  return (
                    <tr
                      key={item.equipmentId}
                      className="transition-colors hover:bg-surface-subtle/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || "/images/hero-equipment.jpg"}
                            alt={item.name}
                            className="size-12 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                          />
                          <p className="font-heading font-semibold text-foreground">
                            {item.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                        {item.category}
                      </td>
                      <td className="px-4 py-4 font-heading font-semibold whitespace-nowrap text-primary tabular-nums">
                        {formatCurrencyBDT(item.rentalPrice)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                        {item.rentalType}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                        <span className="inline-flex items-center gap-1">
                          <MapPin
                            aria-hidden="true"
                            className="size-3.5 text-primary"
                          />
                          <span>{item.location}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={badgeVariant} dot size="sm">
                          {item.availabilityStatus}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Link
                            href={`/equipment/${encodeURIComponent(
                              item.equipmentId
                            )}`}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span>View Details</span>
                            <ExternalLink
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          </Link>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={Boolean(removingId)}
                            loading={isRemovingThis}
                            aria-label={`Remove ${item.name} from favorites`}
                            onClick={() => setConfirmTarget(item)}
                            className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
                          >
                            {!isRemovingThis ? (
                              <Trash2 aria-hidden="true" className="size-3.5" />
                            ) : null}
                            <span>Remove</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmTarget)}
        onClose={() => {
          if (!removingId) setConfirmTarget(null);
        }}
        onConfirm={handleConfirmRemove}
        title="Remove equipment from favorites?"
        description={
          confirmTarget
            ? `Remove "${confirmTarget.name}" from your saved favorites list?`
            : ""
        }
        confirmLabel="Remove Favorite"
        cancelLabel="Keep Saved"
        isLoading={Boolean(removingId)}
      />
    </div>
  );
}
