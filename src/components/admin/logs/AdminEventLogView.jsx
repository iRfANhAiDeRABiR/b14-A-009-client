"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowUpDown,
  Download,
  Eye,
  RefreshCw,
  RotateCcw,
  ScrollText,
  ShieldAlert,
  X,
} from "lucide-react";

import { useAdminLogs } from "@/hooks/useAdminLogs";
import { formatDisplayDate, getLogSeverityBadge } from "@/lib/adminUtils";
import { downloadCsv } from "@/lib/csvExport";
import {
  ADMIN_LOG_CATEGORY_OPTIONS,
  ADMIN_LOG_SEVERITY_OPTIONS,
} from "@/services/adminAuditLogService";
import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";
import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function formatEventTimestamp(isoOrDate) {
  if (!isoOrDate) return "—";
  const parsed = new Date(isoOrDate);
  if (Number.isNaN(parsed.getTime())) return String(isoOrDate);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function AdminEventLogView() {
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
  } = useAdminLogs();

  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const isAuthError = errorStatus === 401 || errorStatus === 403;

  const handleExportCsv = () => {
    downloadCsv(
      `gearnest-event-log-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        { header: "Timestamp", accessor: (r) => formatEventTimestamp(r.createdAt) },
        { header: "Category", key: "category" },
        { header: "Severity", key: "severity" },
        { header: "Action", key: "action" },
        { header: "Summary", key: "summary" },
        { header: "Actor", accessor: (r) => r.actor?.email || r.actor?.name || "" },
        { header: "Target", accessor: (r) => r.target?.label || r.target?.id || "" },
      ],
      items
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">Platform Event Log</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Track administrative governance actions, user status updates, listing moderation, and support inquiry resolutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!loading && !error ? (
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-semibold text-primary tabular-nums">
              {pagination.totalItems}{" "}
              {pagination.totalItems === 1 ? "event" : "events"}
            </span>
          ) : null}

          <Button
            variant="outline"
            size="md"
            disabled={loading || items.length === 0}
            onClick={handleExportCsv}
          >
            <Download aria-hidden="true" className="size-4" />
            <span>Export CSV</span>
          </Button>

          <Button variant="outline" size="md" disabled={loading} onClick={retry}>
            <RefreshCw
              aria-hidden="true"
              className={`size-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </header>

      {summary ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Total Recorded", count: summary.totalAll ?? 0 },
            { label: "User Governance", count: summary.user ?? 0 },
            { label: "Equipment Audits", count: summary.equipment ?? 0 },
            { label: "Rental Notes", count: summary.rental ?? 0 },
            { label: "Support Inquiries", count: summary.inquiry ?? 0 },
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
            id="admin-logs-search"
            value={filters.search}
            onSearchChange={(search) => updateFilters({ search })}
            placeholder="Search by action, actor email, target or summary..."
            ariaLabel="Search event logs"
            srLabel="Search platform audit logs"
            clearLabel="Clear event log search"
            debounceMs={350}
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filter by severity"
              value={filters.severity}
              disabled={loading}
              onChange={(e) => updateFilters({ severity: e.target.value })}
              className="min-h-11 cursor-pointer rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {ADMIN_LOG_SEVERITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="relative">
              <ArrowUpDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
              />
              <select
                aria-label="Sort event logs"
                value={filters.sort}
                disabled={loading}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="min-h-11 cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Newest Events First</option>
                <option value="oldest">Oldest Events First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter logs by category">
            {ADMIN_LOG_CATEGORY_OPTIONS.map((opt) => {
              const active = filters.category === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={loading}
                  aria-pressed={active}
                  onClick={() => updateFilters({ category: opt.value })}
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
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-72" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </Card>
      ) : items.length === 0 ? (
        <Card padding="lg" className="rounded-2xl text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
            <ScrollText className="size-7" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            No event log entries found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            {hasActiveFilters
              ? "Adjust your search or category filters to view other events."
              : "Administrative governance actions across users, equipment, rentals, and inquiries will be recorded here automatically."}
          </p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <th scope="col" className="px-5 py-3.5">Event / Summary</th>
                  <th scope="col" className="px-4 py-3.5">Category</th>
                  <th scope="col" className="px-4 py-3.5">Severity</th>
                  <th scope="col" className="px-4 py-3.5">Actor</th>
                  <th scope="col" className="px-4 py-3.5">Timestamp</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {items.map((log) => {
                  const sevBadge = getLogSeverityBadge(log.severity);
                  return (
                    <tr key={log._id} className="hover:bg-surface-subtle/60">
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs font-semibold text-primary">
                          {log.action}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-sm text-foreground">
                          {log.summary || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 capitalize text-text-secondary">
                        {log.category}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge variant={sevBadge.variant} dot size="sm">
                          {sevBadge.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <p className="font-medium text-foreground">
                          {log.actor?.name || "System"}
                        </p>
                        {log.actor?.email ? (
                          <p className="text-text-secondary">{log.actor.email}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-text-secondary">
                        {formatEventTimestamp(log.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEvent(log)}
                        >
                          <Eye className="size-3.5" />
                          <span>Inspect</span>
                        </Button>
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
            itemLabel="events"
            ariaLabel="Event log pagination"
            className="border-t border-border bg-background px-5 py-4"
          />
        </Card>
      )}

      {selectedEvent ? (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-md"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
              <div>
                <p className="font-mono text-xs font-semibold text-primary">
                  {selectedEvent.action}
                </p>
                <h2 className="mt-0.5 font-heading text-base font-bold text-foreground">
                  Audit Event Details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close event details"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border"
              >
                <X className="size-4" />
              </button>
            </div>

            <dl className="mt-4 space-y-3 text-xs sm:text-sm">
              <div>
                <dt className="text-text-secondary">Summary</dt>
                <dd className="mt-0.5 font-medium text-foreground">
                  {selectedEvent.summary}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-text-secondary">Actor</dt>
                  <dd className="mt-0.5 text-foreground">
                    {selectedEvent.actor?.name}{" "}
                    {selectedEvent.actor?.email
                      ? `(${selectedEvent.actor.email})`
                      : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-secondary">Recorded At</dt>
                  <dd className="mt-0.5 text-foreground">
                    {formatDisplayDate(selectedEvent.createdAt)}
                  </dd>
                </div>
              </div>
              <div>
                <dt className="text-text-secondary">Target Entity</dt>
                <dd className="mt-0.5 font-mono text-xs text-foreground">
                  {selectedEvent.target?.type}: {selectedEvent.target?.label || selectedEvent.target?.id || "—"}
                </dd>
              </div>
              {selectedEvent.metadata &&
              Object.keys(selectedEvent.metadata).length > 0 ? (
                <div>
                  <dt className="text-text-secondary">Metadata</dt>
                  <dd className="mt-1 overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground">
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      ) : null}
    </div>
  );
}
