"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  Boxes,
  Eye,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { useOwnerEquipment } from "@/hooks/useOwnerEquipment";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { deleteOwnerEquipment } from "@/services/equipmentService";
import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";
import { DeleteEquipmentDialog } from "@/components/owner/DeleteEquipmentDialog";
import { EquipmentDetailsModal } from "@/components/owner/EquipmentDetailsModal";
import { EquipmentManagementFilters } from "@/components/owner/EquipmentManagementFilters";
import { EquipmentStatusBadge } from "@/components/owner/EquipmentStatusBadge";
import { OwnerEquipmentStats } from "@/components/owner/OwnerEquipmentStats";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function EquipmentTableSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden rounded-2xl">
      <div className="divide-y divide-border">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-center gap-4 p-4 sm:px-6">
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MyEquipmentTable() {
  const { showToast } = useToast();
  const { token, getToken } = useAuth();
  const {
    filters,
    items,
    stats,
    pagination,
    error,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
    removeItemFromState,
  } = useOwnerEquipment();

  const [detailsTarget, setDetailsTarget] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [deletingId, setDeletingId] = React.useState("");

  const handleConfirmDelete = async () => {
    if (!deleteTarget || deletingId) return;

    const targetId = String(deleteTarget._id);
    setDeletingId(targetId);

    try {
      const activeToken =
        token || (typeof getToken === "function" ? await getToken() : null);

      const response = await deleteOwnerEquipment(targetId, {
        token: activeToken,
      });

      removeItemFromState(targetId);
      setDeleteTarget(null);

      showToast({
        title: "Equipment deleted",
        description:
          typeof response?.message === "string" && response.message.trim()
            ? response.message.trim()
            : `"${deleteTarget.name}" has been deleted from your fleet.`,
        variant: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to delete equipment listing.";
      showToast({
        title: "Deletion failed",
        description: message,
        variant: "error",
      });
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">My Equipment</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Manage your equipment listings, update rental information and monitor approval status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            disabled={loading}
            onClick={retry}
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
          <Button
            href="/dashboard/owner/add-equipment"
            variant="primary"
            size="md"
          >
            <Plus aria-hidden="true" className="size-4" />
            <span>+ Add New Equipment</span>
          </Button>
        </div>
      </header>

      <OwnerEquipmentStats stats={stats} loading={loading} />

      <EquipmentManagementFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={loading}
      />

      {error && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={retry}>
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      {loading ? (
        <EquipmentTableSkeleton />
      ) : items.length === 0 ? (
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <Boxes className="size-7" />
          </span>

          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            {hasActiveFilters
              ? "No equipment matches your filters"
              : "No Equipment Listed Yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {hasActiveFilters
              ? "Adjust your search term, category, or approval status filter to inspect your other listings."
              : "Start growing your rental business by listing your first piece of equipment."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasActiveFilters ? (
              <Button variant="outline" size="md" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : null}
            <Button
              href="/dashboard/owner/add-equipment"
              variant="primary"
              size="md"
            >
              Add Your First Equipment
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Responsive Table */}
          <Card padding="none" className="hidden overflow-hidden rounded-2xl md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-left text-sm">
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
                      Available Qty
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Location
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {items.map((item) => {
                    const isDeletingThis = deletingId === String(item._id);
                    const isRejected =
                      String(item.status).toLowerCase() === "rejected";

                    return (
                      <tr
                        key={item._id}
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
                          {isRejected && item.rejectionReason ? (
                            <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-danger">
                              Reason: {item.rejectionReason}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          {item.category || "—"}
                        </td>
                        <td className="px-4 py-4 font-heading font-semibold whitespace-nowrap text-primary tabular-nums">
                          {item.rentalPrice !== null
                            ? formatCurrencyBDT(item.rentalPrice)
                            : "—"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          {item.rentalType || "Daily"}
                        </td>
                        <td className="px-4 py-4 font-medium whitespace-nowrap text-foreground tabular-nums">
                          {item.availableQuantity}{" "}
                          {item.availableQuantity === 1 ? "unit" : "units"}
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
                          <EquipmentStatusBadge status={item.status} />
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label={`View details for ${item.name}`}
                              onClick={() => setDetailsTarget(item)}
                            >
                              <Eye aria-hidden="true" className="size-3.5" />
                              <span>View</span>
                            </Button>

                            <Link
                              href={`/dashboard/owner/my-equipment/edit/${encodeURIComponent(
                                item._id
                              )}`}
                              aria-label={`Update ${item.name}`}
                              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Pencil aria-hidden="true" className="size-3.5" />
                              <span>Update</span>
                            </Link>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={Boolean(deletingId)}
                              loading={isDeletingThis}
                              aria-label={`Delete ${item.name}`}
                              onClick={() => setDeleteTarget(item)}
                              className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
                            >
                              {!isDeletingThis ? (
                                <Trash2
                                  aria-hidden="true"
                                  className="size-3.5"
                                />
                              ) : null}
                              <span>Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <EquipmentPagination
              pagination={pagination}
              onPageChange={setPage}
              itemLabel="equipment listings"
              ariaLabel="My equipment pagination"
              className="border-t border-border bg-background px-5 py-4"
            />
          </Card>

          {/* Mobile Stacked Cards */}
          <div className="space-y-3 md:hidden">
            {items.map((item) => {
              const isDeletingThis = deletingId === String(item._id);
              const isRejected =
                String(item.status).toLowerCase() === "rejected";

              return (
                <Card
                  key={item._id}
                  padding="md"
                  className="space-y-3.5 rounded-2xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || "/images/hero-equipment.jpg"}
                        alt={item.name}
                        className="size-14 shrink-0 rounded-xl border border-border bg-surface-subtle object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-heading text-sm font-bold text-foreground">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {item.category || "Equipment"}
                        </p>
                        {item.location ? (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-secondary">
                            <MapPin
                              aria-hidden="true"
                              className="size-3.5 text-primary"
                            />
                            <span className="truncate">{item.location}</span>
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <EquipmentStatusBadge status={item.status} />
                  </div>

                  {isRejected && item.rejectionReason ? (
                    <p className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-xs text-danger">
                      Reason: {item.rejectionReason}
                    </p>
                  ) : null}

                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-3 text-xs">
                    <div>
                      <p className="text-muted">Rental Rate</p>
                      <p className="mt-0.5 font-heading text-sm font-bold text-primary tabular-nums">
                        {item.rentalPrice !== null
                          ? `${formatCurrencyBDT(item.rentalPrice)} / ${item.rentalType}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Available Stock</p>
                      <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                        {item.availableQuantity}{" "}
                        {item.availableQuantity === 1 ? "unit" : "units"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailsTarget(item)}
                    >
                      <Eye aria-hidden="true" className="size-3.5" />
                      <span>View Details</span>
                    </Button>

                    <Link
                      href={`/dashboard/owner/my-equipment/edit/${encodeURIComponent(
                        item._id
                      )}`}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Pencil aria-hidden="true" className="size-3.5" />
                      <span>Update</span>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={Boolean(deletingId)}
                      loading={isDeletingThis}
                      onClick={() => setDeleteTarget(item)}
                      className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
                    >
                      {!isDeletingThis ? (
                        <Trash2 aria-hidden="true" className="size-3.5" />
                      ) : null}
                      <span>Delete</span>
                    </Button>
                  </div>
                </Card>
              );
            })}

            {pagination.totalPages > 1 ? (
              <Card padding="none" className="overflow-hidden rounded-2xl">
                <EquipmentPagination
                  pagination={pagination}
                  onPageChange={setPage}
                  itemLabel="equipment listings"
                  ariaLabel="My equipment pagination"
                  className="px-4 py-4"
                />
              </Card>
            ) : null}
          </div>
        </div>
      )}

      <EquipmentDetailsModal
        equipment={detailsTarget}
        onClose={() => setDetailsTarget(null)}
      />

      <DeleteEquipmentDialog
        targetItem={deleteTarget}
        onClose={() => {
          if (!deletingId) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={Boolean(deletingId)}
      />
    </div>
  );
}
