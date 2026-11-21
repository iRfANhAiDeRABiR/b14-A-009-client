"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Heart,
  MapPin,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { useFavorites } from "@/hooks/useFavorites";
import { filterAndSortFavorites } from "@/lib/customerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { FavoriteEmptyState } from "@/components/customer/FavoriteEmptyState";
import { FavoriteEquipmentCard } from "@/components/customer/FavoriteEquipmentCard";
import { FavoriteFilters } from "@/components/customer/FavoriteFilters";
import { RemoveFavoriteDialog } from "@/components/customer/RemoveFavoriteDialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function FavoritesSummaryCards({ stats, loading }) {
  const cards = [
    {
      key: "total",
      label: "Total Saved Favorites",
      value: stats?.total ?? 0,
      icon: Heart,
      tone: "bg-secondary text-primary",
    },
    {
      key: "available",
      label: "Available Items",
      value: stats?.available ?? 0,
      icon: CheckCircle2,
      tone: "bg-success-bg text-success",
    },
    {
      key: "unavailable",
      label: "Unavailable Items",
      value: stats?.unavailable ?? 0,
      icon: AlertCircle,
      tone: "bg-warning-bg text-warning",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.key} padding="md" className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-14" />
              </div>
              <Skeleton className="size-10 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key} padding="md" className="rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-text-secondary">
                  {card.label}
                </p>
                <p className="mt-2 font-heading text-3xl font-bold text-foreground tabular-nums">
                  {card.value}
                </p>
              </div>
              <span
                aria-hidden="true"
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${card.tone}`}
              >
                <Icon className="size-5" />
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
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
  const {
    favorites,
    favoriteStats,
    isLoading,
    errorMessage,
    isMutating,
    isMutatingItem,
    refreshFavorites,
    removeFavoriteItem,
  } = useFavorites();

  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState("recent");
  const [confirmTarget, setConfirmTarget] = React.useState(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const loading = isLoading || isRefreshing;

  const availableCategories = React.useMemo(
    () =>
      Array.from(
        new Set(favorites.map((item) => item.category).filter(Boolean))
      ),
    [favorites]
  );

  const filteredItems = React.useMemo(
    () =>
      filterAndSortFavorites(favorites, {
        search,
        category,
        sort,
      }),
    [category, favorites, search, sort]
  );

  const hasActiveFilters = Boolean(
    search.trim() || category !== "all" || sort !== "recent"
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("recent");
  };

  const handleRefresh = async () => {
    if (loading) return;
    setIsRefreshing(true);
    try {
      await refreshFavorites();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!confirmTarget) return;

    const result = await removeFavoriteItem(confirmTarget.equipmentId, {
      equipmentName: confirmTarget.name,
      redirectPath: "/dashboard/customer/favorites",
    });

    if (result?.ok) {
      setConfirmTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">
            My Favorite Equipment
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Keep your preferred equipment close and find it whenever your next project needs it.
          </p>
          <p className="mt-1 text-xs text-muted">
            Your saved equipment is organized here for easy access.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleRefresh}
        >
          <RefreshCw
            aria-hidden="true"
            className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </Button>
      </header>

      <FavoritesSummaryCards stats={favoriteStats} loading={loading} />

      <FavoriteFilters
        search={search}
        category={category}
        sort={sort}
        availableCategories={availableCategories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={loading}
      />

      {errorMessage && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      {loading ? (
        <FavoritesSkeleton />
      ) : favorites.length === 0 ? (
        <FavoriteEmptyState isFiltered={false} />
      ) : filteredItems.length === 0 ? (
        <FavoriteEmptyState isFiltered onClearFilters={clearFilters} />
      ) : (
        <>
          {/* Desktop & Tablet Table */}
          <Card padding="none" className="hidden overflow-hidden rounded-2xl md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    <th scope="col" className="px-5 py-3.5">
                      Image
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Equipment Name
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
                      Availability Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {filteredItems.map((item) => {
                    const isRemovingThis = isMutatingItem(item.equipmentId);
                    const showUnavailableNotice =
                      item.isDeletedRecord || !item.isPubliclyApproved;

                    return (
                      <tr
                        key={item.equipmentId}
                        className="transition-colors hover:bg-surface-subtle/70"
                      >
                        <td className="px-5 py-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || "/images/hero-equipment.jpg"}
                            alt={item.name}
                            className="size-12 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-heading font-semibold text-foreground">
                            {item.name}
                          </p>
                          {showUnavailableNotice ? (
                            <p className="mt-0.5 text-xs text-warning">
                              {item.isDeletedRecord
                                ? "Removed by owner or deleted"
                                : "Currently unlisted for public booking"}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          {item.category}
                        </td>
                        <td className="px-4 py-4 font-heading font-semibold whitespace-nowrap text-primary tabular-nums">
                          {item.rentalPrice !== null
                            ? formatCurrencyBDT(item.rentalPrice)
                            : "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          {item.rentalType || "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          {item.location ? (
                            <span className="inline-flex items-center gap-1">
                              <MapPin
                                aria-hidden="true"
                                className="size-3.5 text-primary"
                              />
                              <span>{item.location}</span>
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge
                            variant={item.availabilityVariant}
                            dot
                            size="sm"
                          >
                            {item.availabilityStatus}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            {!showUnavailableNotice ? (
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
                            ) : (
                              <span className="px-2 text-xs text-muted">
                                Unavailable
                              </span>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isMutating}
                              loading={isRemovingThis}
                              aria-label={`Remove ${item.name} from favorites`}
                              onClick={() => setConfirmTarget(item)}
                              className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
                            >
                              {!isRemovingThis ? (
                                <Trash2
                                  aria-hidden="true"
                                  className="size-3.5"
                                />
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

          {/* Mobile Card Layout */}
          <div className="space-y-3 md:hidden">
            {filteredItems.map((item) => (
              <FavoriteEquipmentCard
                key={item.equipmentId}
                item={item}
                onRequestRemove={setConfirmTarget}
                isRemoving={isMutatingItem(item.equipmentId)}
                disableActions={isMutating}
              />
            ))}
          </div>
        </>
      )}

      <RemoveFavoriteDialog
        targetItem={confirmTarget}
        onClose={() => {
          if (!isMutating) setConfirmTarget(null);
        }}
        onConfirm={handleConfirmRemove}
        isRemoving={Boolean(
          confirmTarget && isMutatingItem(confirmTarget.equipmentId)
        )}
      />
    </div>
  );
}
