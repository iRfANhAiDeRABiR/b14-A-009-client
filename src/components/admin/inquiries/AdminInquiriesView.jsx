"use client";

import * as React from "react";
import {
  AlertCircle,
  Download,
  Eye,
  Mail,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { useAdminInquiries } from "@/hooks/useAdminInquiries";
import { formatDisplayDate, getInquiryStatusBadge } from "@/lib/adminUtils";
import { downloadCsv } from "@/lib/csvExport";
import {
  ADMIN_INQUIRY_STATUS_OPTIONS,
  ADMIN_INQUIRY_TYPE_OPTIONS,
  deleteAdminInquiry,
  updateAdminInquiryStatus,
} from "@/services/adminInquiryService";
import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";
import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export function AdminInquiriesView() {
  const { showToast } = useToast();
  const { token, getToken } = useAuth();
  const {
    filters,
    items,
    pagination,
    summary,
    error,
    errorStatus,
    loading,
    hasActiveFilters,
    updateFilters,
    setPage,
    clearFilters,
    retry,
  } = useAdminInquiries();

  const [activeInquiry, setActiveInquiry] = React.useState(null);
  const [adminNote, setAdminNote] = React.useState("");
  const [nextStatus, setNextStatus] = React.useState("In Progress");
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [isMutating, setIsMutating] = React.useState(false);

  const isAuthError = errorStatus === 401 || errorStatus === 403;

  const resolveToken = async () =>
    token || (typeof getToken === "function" ? await getToken() : null);

  const openInquiryModal = (inq) => {
    setActiveInquiry(inq);
    setAdminNote(inq.adminNote || "");
    setNextStatus(
      inq.status === "New" ? "In Progress" : inq.status || "Resolved"
    );
  };

  const handleSaveInquiry = async (e) => {
    e.preventDefault();
    if (!activeInquiry || isMutating) return;
    setIsMutating(true);
    try {
      const activeToken = await resolveToken();
      await updateAdminInquiryStatus(
        activeInquiry._id,
        { status: nextStatus, adminNote },
        { token: activeToken }
      );
      setActiveInquiry(null);
      retry();
      showToast({
        title: "Inquiry updated",
        description: `Marked inquiry as ${nextStatus}.`,
        variant: "success",
      });
    } catch (err) {
      showToast({
        title: "Update failed",
        description:
          err instanceof Error ? err.message : "Unable to update inquiry status.",
        variant: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isMutating) return;
    setIsMutating(true);
    try {
      const activeToken = await resolveToken();
      await deleteAdminInquiry(deleteTarget._id, { token: activeToken });
      setDeleteTarget(null);
      retry();
      showToast({
        title: "Inquiry deleted",
        description: "The support message has been removed.",
        variant: "success",
      });
    } catch (err) {
      showToast({
        title: "Delete failed",
        description:
          err instanceof Error ? err.message : "Unable to delete inquiry.",
        variant: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleExportCsv = () => {
    downloadCsv(
      `gearnest-inquiries-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        { header: "Sender", key: "name" },
        { header: "Email", key: "email" },
        { header: "Type", key: "inquiryType" },
        { header: "Subject", key: "subject" },
        { header: "Status", key: "status" },
        { header: "Message", key: "message" },
        {
          header: "Submitted",
          accessor: (row) => formatDisplayDate(row.createdAt),
        },
      ],
      items
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">Support Inquiries</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Review messages submitted through the Contact Us page, record internal follow-up notes, and resolve support tickets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            disabled={loading || items.length === 0}
            onClick={handleExportCsv}
          >
            <Download className="size-4" />
            <span>Export CSV</span>
          </Button>
          <Button variant="outline" size="md" disabled={loading} onClick={retry}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </header>

      {summary ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Inquiries", count: summary.totalAll ?? 0 },
            { label: "New / Unread", count: summary.newCount ?? 0 },
            { label: "In Progress", count: summary.inProgressCount ?? 0 },
            { label: "Resolved", count: summary.resolvedCount ?? 0 },
          ].map((stat) => (
            <Card key={stat.label} padding="md" className="rounded-2xl">
              <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
              <p className="mt-1 font-heading text-2xl font-bold text-foreground tabular-nums">
                {stat.count}
              </p>
            </Card>
          ))}
        </div>
      ) : null}

      <Card padding="md" className="space-y-4 rounded-2xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <EquipmentSearch
            id="admin-inquiries-search"
            value={filters.search}
            onSearchChange={(search) => updateFilters({ search })}
            placeholder="Search sender, email, subject or message..."
            ariaLabel="Search support inquiries"
            srLabel="Search support inquiries"
            clearLabel="Clear search"
            debounceMs={350}
          />

          <select
            aria-label="Filter by inquiry type"
            value={filters.inquiryType}
            disabled={loading}
            onChange={(e) => updateFilters({ inquiryType: e.target.value })}
            className="min-h-11 cursor-pointer rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {ADMIN_INQUIRY_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {ADMIN_INQUIRY_STATUS_OPTIONS.map((opt) => {
              const active = filters.status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={loading}
                  aria-pressed={active}
                  onClick={() => updateFilters({ status: opt.value })}
                  className={cn(
                    "min-h-9 cursor-pointer rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {hasActiveFilters ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <RotateCcw className="size-3.5" />
              <span>Clear Filters</span>
            </Button>
          ) : null}
        </div>
      </Card>

      {error && !loading ? (
        <div
          role="alert"
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            isAuthError
              ? "border-danger-border bg-danger-bg text-danger"
              : "border-warning-border bg-warning-bg text-warning"
          }`}
        >
          <div className="flex items-center gap-2">
            {isAuthError ? <ShieldAlert className="size-4" /> : <AlertCircle className="size-4" />}
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={retry}>
            Retry
          </Button>
        </div>
      ) : null}

      {loading ? (
        <Card padding="none" className="divide-y divide-border overflow-hidden rounded-2xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 p-5">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </Card>
      ) : items.length === 0 ? (
        <Card padding="lg" className="rounded-2xl text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
            <Mail className="size-7" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            No support inquiries found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            {hasActiveFilters
              ? "Try clearing filters to view other contact messages."
              : "Messages submitted by users via /contact will appear here for review."}
          </p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <th scope="col" className="px-5 py-3.5">Sender</th>
                  <th scope="col" className="px-4 py-3.5">Subject &amp; Type</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-4 py-3.5">Received</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {items.map((inq) => {
                  const badge = getInquiryStatusBadge(inq.status);
                  return (
                    <tr key={inq._id} className="hover:bg-surface-subtle/60">
                      <td className="px-5 py-4">
                        <p className="font-heading font-semibold text-foreground">
                          {inq.name}
                        </p>
                        <p className="text-xs text-text-secondary">{inq.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{inq.subject}</p>
                        <p className="text-xs text-text-secondary">{inq.inquiryType}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={badge.variant} dot size="sm">
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-text-secondary">
                        {formatDisplayDate(inq.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openInquiryModal(inq)}
                          >
                            <Eye className="size-3.5" />
                            <span>Review</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteTarget(inq)}
                            aria-label={`Delete inquiry ${inq.subject}`}
                            className="border-danger-border text-danger hover:bg-danger-bg"
                          >
                            <Trash2 className="size-3.5" />
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
            itemLabel="inquiries"
            ariaLabel="Inquiries pagination"
            className="border-t border-border bg-background px-5 py-4"
          />
        </Card>
      )}

      {activeInquiry ? (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <div
            onClick={() => !isMutating && setActiveInquiry(null)}
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-md"
          >
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="text-xs font-semibold text-primary">
                  {activeInquiry.inquiryType}
                </p>
                <h2 className="mt-0.5 font-heading text-lg font-bold text-foreground">
                  {activeInquiry.subject}
                </h2>
                <p className="text-xs text-text-secondary">
                  From {activeInquiry.name} ({activeInquiry.email})
                </p>
              </div>
              <button
                type="button"
                disabled={isMutating}
                onClick={() => setActiveInquiry(null)}
                aria-label="Close inquiry dialog"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border"
              >
                <X className="size-4" />
              </button>
            </header>

            <form onSubmit={handleSaveInquiry} className="space-y-4 p-5">
              <div className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                {activeInquiry.message}
              </div>

              <div>
                <label
                  htmlFor="inquiry-status-select"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Resolution Status
                </label>
                <select
                  id="inquiry-status-select"
                  value={nextStatus}
                  disabled={isMutating}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className="mt-1.5 min-h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="inquiry-admin-note"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Internal Admin Note
                </label>
                <textarea
                  id="inquiry-admin-note"
                  rows={3}
                  maxLength={500}
                  disabled={isMutating}
                  placeholder="Record resolution steps or follow-up details..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <footer className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isMutating}
                  onClick={() => setActiveInquiry(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={isMutating}>
                  Save Inquiry Status
                </Button>
              </footer>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isMutating && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Support Inquiry?"
        description={
          deleteTarget
            ? `Permanently delete inquiry "${deleteTarget.subject}" from ${deleteTarget.email}?`
            : ""
        }
        confirmLabel="Delete Inquiry"
        cancelLabel="Cancel"
        confirmTone="danger"
        isLoading={isMutating}
      />
    </div>
  );
}
