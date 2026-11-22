"use client";

import * as React from "react";
import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  Eye,
  MapPin,
  Pencil,
  RefreshCw,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { useAdminEquipment } from "@/hooks/useAdminEquipment";
import { formatDisplayDate } from "@/lib/adminUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import {
  approveAdminEquipment,
  deleteAdminEquipment,
  rejectAdminEquipment,
} from "@/services/adminEquipmentService";
import { AdminEquipmentEditForm } from "@/components/admin/equipment/AdminEquipmentEditForm";
import { AdminEquipmentFilters } from "@/components/admin/equipment/AdminEquipmentFilters";
import { EquipmentApprovalDialog } from "@/components/admin/equipment/EquipmentApprovalDialog";
import { EquipmentDetailsModal } from "@/components/admin/equipment/EquipmentDetailsModal";
import { EquipmentRejectionDialog } from "@/components/admin/equipment/EquipmentRejectionDialog";
import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";
import { DeleteEquipmentDialog } from "@/components/owner/DeleteEquipmentDialog";
import { EquipmentStatusBadge } from "@/components/owner/EquipmentStatusBadge";
import { OwnerEquipmentStats } from "@/components/owner/OwnerEquipmentStats";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function AdminEquipmentSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden rounded-2xl">
      <div className="divide-y divide-border">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-center gap-4 p-4 sm:px-6">
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AdminEquipmentTable() {
  const { showToast } = useToast();
  const { token, getToken } = useAuth();
  const {
    filters,
    items,
    stats,
    pagination,
    error,
    errorStatus,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
    syncDeletedItem,
  } = useAdminEquipment();

  const [detailsTarget, setDetailsTarget] = React.useState(null);
  const [approveTarget, setApproveTarget] = React.useState(null);
  const [rejectTarget, setRejectTarget] = React.useState(null);
  const [editTarget, setEditTarget] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [actionBusyId, setActionBusyId] = React.useState("");

  const isAuthError = errorStatus === 401 || errorStatus === 403;

  const resolveToken = async () =>
    token || (typeof getToken === "function" ? await getToken() : null);

  const handleConfirmApprove = async () => {
    if (!approveTarget || actionBusyId) return;

    const targetId = String(approveTarget._id);
    setActionBusyId(targetId);

    try {
      const activeToken = await resolveToken();
      const response = await approveAdminEquipment(targetId, {
        token: activeToken,
      });

      setApproveTarget(null);
      retry();

      showToast({
        title: "Equipment approved",
        description:
          typeof response?.message === "string" && response.message.trim()
            ? response.message.trim()
            : `"${approveTarget.name}" is now Approved for public marketplace listing.`,
        variant: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to approve equipment listing.";
      showToast({
        title: "Approval failed",
        description: message,
        variant: "error",
      });
    } finally {
      setActionBusyId("");
    }
  };

  const handleConfirmReject = async (rejectionReason) => {
    if (!rejectTarget || actionBusyId) return;

    const targetId = String(rejectTarget._id);
    setActionBusyId(targetId);

    try {
      const activeToken = await resolveToken();
      const response = await rejectAdminEquipment(
        targetId,
        { rejectionReason },
        { token: activeToken }
      );

      setRejectTarget(null);
      retry();

      showToast({
        title: "Equipment rejected",
        description:
          typeof response?.message === "string" && response.message.trim()
            ? response.message.trim()
            : `"${rejectTarget.name}" has been marked Rejected with moderation feedback.`,
        variant: "neutral",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to reject equipment listing.";
      showToast({
        title: "Rejection failed",
        description: message,
        variant: "error",
      });
    } finally {
      setActionBusyId("");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || actionBusyId) return;

    const targetId = String(deleteTarget._id);
    setActionBusyId(targetId);

    try {
      const activeToken = await resolveToken();
      const response = await deleteAdminEquipment(targetId, {
        token: activeToken,
      });

      syncDeletedItem(targetId);
      setDeleteTarget(null);
      retry();

      showToast({
        title: "Equipment deleted",
        description:
          typeof response?.message === "string" && response.message.trim()
            ? response.message.trim()
            : `"${deleteTarget.name}" was removed by Administrator action.`,
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
      setActionBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">
            Equipment Management
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Review equipment submissions, manage marketplace listings and maintain platform quality.
          </p>
        </div>

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
      </header>

      <OwnerEquipmentStats stats={stats} loading={loading} />

      <AdminEquipmentFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={loading}
      />

      {error && !loading ? (
        <div
          role="alert"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            isAuthError
              ? "border-danger-border bg-danger-bg text-danger"
              : "border-warning-border bg-warning-bg text-warning"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isAuthError ? (
              <ShieldAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            ) : (
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            )}
            <span>{error}</span>
          </div>

          <div className="flex items-center gap-2">
            {errorStatus === 401 ? (
              <Button
                href="/login?callbackURL=%2Fdashboard%2Fadmin%2Fequipment"
                variant="outline"
                size="sm"
              >
                Sign In
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={retry}>
              <RefreshCw aria-hidden="true" className="size-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <AdminEquipmentSkeleton />
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
              ? "No equipment matches your selected filters."
              : "No equipment found"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {hasActiveFilters
              ? "Clear or adjust your search query, category filter, or approval status filter."
              : "Owner-submitted machinery and production equipment listings will appear here for review."}
          </p>

          {hasActiveFilters ? (
            <div className="mt-6">
              <Button variant="outline" size="md" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : null}
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Moderation Table */}
          <Card
            padding="none"
            className="hidden overflow-hidden rounded-2xl md:block"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    <th scope="col" className="px-5 py-3.5">
                      Equipment
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Owner Information
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Rental Rate
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Qty &amp; Location
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Submitted
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
                    const statusNormalized = String(item.status || "").toLowerCase();
                    const isBusyRow = actionBusyId === String(item._id);

                    return (
                      <tr
                        key={item._id}
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
                            <div className="min-w-0">
                              <p className="max-w-48 truncate font-heading font-semibold text-foreground">
                                {item.name}
                              </p>
                              <p className="truncate text-xs text-text-secondary">
                                {item.category || "Uncategorized"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground">
                            {item.owner?.name || "Verified Owner"}
                          </p>
                          {item.owner?.email ? (
                            <p className="max-w-44 truncate text-xs text-text-secondary">
                              {item.owner.email}
                            </p>
                          ) : null}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="font-heading font-semibold text-primary tabular-nums">
                            {item.rentalPrice !== null
                              ? formatCurrencyBDT(item.rentalPrice)
                              : "—"}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {item.rentalType || "Daily"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground tabular-nums">
                            {item.availableQuantity}{" "}
                            {item.availableQuantity === 1 ? "unit" : "units"}
                          </p>
                          <p className="inline-flex max-w-40 items-center gap-1 truncate text-xs text-text-secondary">
                            <MapPin
                              aria-hidden="true"
                              className="size-3 shrink-0 text-primary"
                            />
                            <span className="truncate">
                              {item.location || "—"}
                            </span>
                          </p>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-xs text-text-secondary">
                          {formatDisplayDate(item.createdAt)}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <EquipmentStatusBadge status={item.status} size="sm" />
                        </td>

                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDetailsTarget(item)}
                              aria-label={`Inspect ${item.name}`}
                            >
                              <Eye aria-hidden="true" className="size-3.5" />
                              <span>View</span>
                            </Button>

                            {statusNormalized !== "approved" ? (
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={Boolean(actionBusyId)}
                                onClick={() => setApproveTarget(item)}
                                aria-label={`Approve ${item.name}`}
                              >
                                <CheckCircle2
                                  aria-hidden="true"
                                  className="size-3.5"
                                />
                                <span>Approve</span>
                              </Button>
                            ) : null}

                            {statusNormalized !== "rejected" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={Boolean(actionBusyId)}
                                onClick={() => setRejectTarget(item)}
                                aria-label={`Reject ${item.name}`}
                                className="border-warning-border text-warning hover:bg-warning-bg"
                              >
                                <XCircle aria-hidden="true" className="size-3.5" />
                                <span>Reject</span>
                              </Button>
                            ) : null}

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={Boolean(actionBusyId)}
                              onClick={() => setEditTarget(item)}
                              aria-label={`Update ${item.name}`}
                            >
                              <Pencil aria-hidden="true" className="size-3.5" />
                              <span>Update</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={Boolean(actionBusyId)}
                              loading={isBusyRow && Boolean(deleteTarget)}
                              onClick={() => setDeleteTarget(item)}
                              aria-label={`Delete ${item.name}`}
                              className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
                            >
                              <Trash2 aria-hidden="true" className="size-3.5" />
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
              ariaLabel="Admin equipment pagination"
              className="border-t border-border bg-background px-5 py-4"
            />
          </Card>

          {/* Mobile Stacked Cards */}
          <div className="space-y-3 md:hidden">
            {items.map((item) => {
              const statusNormalized = String(item.status || "").toLowerCase();

              return (
                <Card
                  key={`${item._id}-mobile`}
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
                        <p className="truncate text-xs text-text-secondary">
                          {item.category || "Uncategorized"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted">
                          Owner: {item.owner?.name || "Verified Owner"}
                        </p>
                      </div>
                    </div>

                    <EquipmentStatusBadge status={item.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-3 text-xs">
                    <div>
                      <p className="text-muted">Rental Rate</p>
                      <p className="mt-0.5 font-heading font-bold text-primary tabular-nums">
                        {item.rentalPrice !== null
                          ? `${formatCurrencyBDT(item.rentalPrice)} / ${item.rentalType}`
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Stock &amp; Location</p>
                      <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                        {item.availableQuantity} units &middot; {item.location || "—"}
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
                      <span>View</span>
                    </Button>

                    {statusNormalized !== "approved" ? (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={Boolean(actionBusyId)}
                        onClick={() => setApproveTarget(item)}
                      >
                        <CheckCircle2 aria-hidden="true" className="size-3.5" />
                        <span>Approve</span>
                      </Button>
                    ) : null}

                    {statusNormalized !== "rejected" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={Boolean(actionBusyId)}
                        onClick={() => setRejectTarget(item)}
                        className="border-warning-border text-warning hover:bg-warning-bg"
                      >
                        <XCircle aria-hidden="true" className="size-3.5" />
                        <span>Reject</span>
                      </Button>
                    ) : null}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={Boolean(actionBusyId)}
                      onClick={() => setEditTarget(item)}
                    >
                      <Pencil aria-hidden="true" className="size-3.5" />
                      <span>Update</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={Boolean(actionBusyId)}
                      onClick={() => setDeleteTarget(item)}
                      className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
                    >
                      <Trash2 aria-hidden="true" className="size-3.5" />
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
                  ariaLabel="Admin equipment pagination"
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
        onApprove={(item) => setApproveTarget(item)}
        onReject={(item) => setRejectTarget(item)}
        onEdit={(item) => setEditTarget(item)}
      />

      <EquipmentApprovalDialog
        targetItem={approveTarget}
        onClose={() => {
          if (!actionBusyId) setApproveTarget(null);
        }}
        onConfirm={handleConfirmApprove}
        isApproving={Boolean(approveTarget && actionBusyId === String(approveTarget._id))}
      />

      <EquipmentRejectionDialog
        targetItem={rejectTarget}
        onClose={() => {
          if (!actionBusyId) setRejectTarget(null);
        }}
        onConfirm={handleConfirmReject}
        isRejecting={Boolean(rejectTarget && actionBusyId === String(rejectTarget._id))}
      />

      <AdminEquipmentEditForm
        equipment={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={retry}
      />

      <DeleteEquipmentDialog
        targetItem={deleteTarget}
        onClose={() => {
          if (!actionBusyId) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={Boolean(deleteTarget && actionBusyId === String(deleteTarget._id))}
      />
    </div>
  );
}
