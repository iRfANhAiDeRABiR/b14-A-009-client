"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowUpDown,
  CreditCard,
  Download,
  Eye,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  User,
  X,
} from "lucide-react";

import { useAdminPayments } from "@/hooks/useAdminPayments";
import { downloadCsv } from "@/lib/csvExport";
import { formatDisplayDate, getPaymentStatusBadge } from "@/lib/customerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import {
  ADMIN_PAYMENT_SORT_OPTIONS,
  ADMIN_PAYMENT_STATUS_OPTIONS,
} from "@/services/adminPaymentService";
import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";
import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function formatMoney(amount, currency = "BDT") {
  if (String(currency).toUpperCase() === "BDT") {
    return formatCurrencyBDT(amount);
  }
  const numeric = Number(amount);
  return `${String(currency).toUpperCase()} ${(Number.isFinite(numeric) ? numeric : 0).toLocaleString("en-US")}`;
}

function formatTimestamp(isoOrDate) {
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

function DetailRow({ label, children, mono = false }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-text-secondary">{label}</dt>
      <dd
        className={cn(
          "mt-0.5 break-words text-sm text-foreground",
          mono && "font-mono text-xs break-all"
        )}
      >
        {children || "—"}
      </dd>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="rounded-xl border border-border bg-background p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {title}
      </h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function PaymentDetailsModal({ payment, onClose }) {
  React.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const statusBadge = getPaymentStatusBadge(payment.status);
  const booking = payment.booking;

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Payment details"
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-surface shadow-md"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Payment Details
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground tabular-nums">
              {formatMoney(payment.amount, payment.currency)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={statusBadge.variant} dot size="sm">
                {statusBadge.label}
              </Badge>
              <span className="font-mono text-[11px] text-text-secondary">
                ID {payment._id}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment details"
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          <DetailSection title="Customer">
            <DetailRow label="Name">{payment.customer?.name}</DetailRow>
            <DetailRow label="Email">{payment.customer?.email}</DetailRow>
            <DetailRow label="Phone">{payment.customer?.phone}</DetailRow>
            <DetailRow label="User ID" mono>
              {payment.customer?.id}
            </DetailRow>
          </DetailSection>

          <DetailSection title="Equipment & Owner">
            <DetailRow label="Equipment">{payment.equipment?.name}</DetailRow>
            <DetailRow label="Category">{payment.equipment?.category}</DetailRow>
            <DetailRow label="Owner">{payment.owner?.name}</DetailRow>
            <DetailRow label="Owner Email">{payment.owner?.email}</DetailRow>
          </DetailSection>

          <DetailSection title="Rental Booking">
            <DetailRow label="Rental Period">
              {booking?.startDate
                ? `${formatDisplayDate(booking.startDate)} → ${formatDisplayDate(booking.endDate)}`
                : ""}
            </DetailRow>
            <DetailRow label="Quantity / Rate">
              {booking?.quantity
                ? `${booking.quantity} unit${booking.quantity === 1 ? "" : "s"} · ${booking.rentalType || "—"}`
                : ""}
            </DetailRow>
            <DetailRow label="Booking Status">{booking?.bookingStatus}</DetailRow>
            <DetailRow label="Booking Total">
              {booking?.totalAmount
                ? formatMoney(booking.totalAmount, payment.currency)
                : ""}
            </DetailRow>
            <DetailRow label="Contact Number">{booking?.contactNumber}</DetailRow>
            <DetailRow label="Delivery Address">{booking?.deliveryAddress}</DetailRow>
            <DetailRow label="Booking ID" mono>
              {booking?.id}
            </DetailRow>
          </DetailSection>

          <DetailSection title="Transaction">
            <DetailRow label="Provider">
              <span className="capitalize">{payment.provider}</span>
            </DetailRow>
            <DetailRow label="Currency">{payment.currency}</DetailRow>
            <DetailRow label="Created">{formatTimestamp(payment.createdAt)}</DetailRow>
            <DetailRow label="Paid At">{formatTimestamp(payment.paidAt)}</DetailRow>
            <DetailRow label="Checkout Session" mono>
              {payment.stripeCheckoutSessionId}
            </DetailRow>
            <DetailRow label="Payment Intent" mono>
              {payment.stripePaymentIntentId}
            </DetailRow>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

export function AdminPaymentsView() {
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get("customerId") || "";

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
  } = useAdminPayments({ initialCustomerId });

  const [selectedPayment, setSelectedPayment] = React.useState(null);
  const closeDetails = React.useCallback(() => setSelectedPayment(null), []);
  const isAuthError = errorStatus === 401 || errorStatus === 403;

  const handleExportCsv = () => {
    downloadCsv(
      `gearnest-payments-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        { header: "Date", accessor: (r) => formatTimestamp(r.paidAt || r.createdAt) },
        { header: "Status", key: "status" },
        { header: "Amount", key: "amount" },
        { header: "Currency", key: "currency" },
        { header: "Customer", accessor: (r) => r.customer?.name },
        { header: "Customer Email", accessor: (r) => r.customer?.email },
        { header: "Owner", accessor: (r) => r.owner?.name },
        { header: "Equipment", accessor: (r) => r.equipment?.name },
        { header: "Rental Start", accessor: (r) => r.booking?.startDate?.slice(0, 10) },
        { header: "Rental End", accessor: (r) => r.booking?.endDate?.slice(0, 10) },
        { header: "Checkout Session", key: "stripeCheckoutSessionId" },
        { header: "Payment Intent", key: "stripePaymentIntentId" },
      ],
      items
    );
  };

  const customerFilterLabel =
    items[0]?.customer?.name || (filters.customerId ? "selected customer" : "");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">Payment History</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Review every customer payment with booking, equipment, owner, and
            Stripe transaction details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!loading && !error ? (
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-semibold text-primary tabular-nums">
              {pagination.totalItems}{" "}
              {pagination.totalItems === 1 ? "payment" : "payments"}
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Payments", value: summary.totalPayments },
            { label: "Paid Revenue", value: formatCurrencyBDT(summary.paidRevenue) },
            { label: "Successful Payments", value: summary.paidCount },
            {
              label: "Failed / Refunded",
              value: `${summary.failedCount} / ${summary.refundedCount}`,
            },
          ].map((stat) => (
            <Card key={stat.label} padding="md" className="rounded-2xl">
              <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
              <p className="mt-1 font-heading text-2xl font-bold text-foreground tabular-nums">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>
      ) : null}

      <Card padding="md" className="space-y-4 rounded-2xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <EquipmentSearch
            id="admin-payments-search"
            value={filters.search}
            onSearchChange={(search) => updateFilters({ search })}
            placeholder="Search customer, email, equipment or Stripe ID..."
            ariaLabel="Search payments"
            srLabel="Search payment history"
            clearLabel="Clear payment search"
            debounceMs={350}
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filter by payment status"
              value={filters.status}
              disabled={loading}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="min-h-11 cursor-pointer rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {ADMIN_PAYMENT_STATUS_OPTIONS.map((opt) => (
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
                aria-label="Sort payments"
                value={filters.sort}
                disabled={loading}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="min-h-11 cursor-pointer rounded-lg border border-border bg-surface pr-8 pl-9 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {ADMIN_PAYMENT_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filters.customerId || hasActiveFilters ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
            {filters.customerId ? (
              <span className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
                <User aria-hidden="true" className="size-3.5" />
                Showing payments for {customerFilterLabel}
                <button
                  type="button"
                  aria-label="Remove customer filter"
                  onClick={() => updateFilters({ customerId: "" })}
                  className="cursor-pointer rounded-full p-0.5 hover:bg-primary/10"
                >
                  <X className="size-3" />
                </button>
              </span>
            ) : (
              <span />
            )}

            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <RotateCcw className="size-3.5" />
                <span>Clear Filters</span>
              </Button>
            ) : null}
          </div>
        ) : null}
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
            {isAuthError ? (
              <ShieldAlert className="size-4" />
            ) : (
              <AlertCircle className="size-4" />
            )}
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
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </Card>
      ) : items.length === 0 ? (
        <Card padding="lg" className="rounded-2xl text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
            <CreditCard className="size-7" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            No payments found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            {hasActiveFilters
              ? "Adjust your search, status, or customer filters to view other payments."
              : "Customer payments will appear here once rentals are paid through Stripe Checkout."}
          </p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <th scope="col" className="px-5 py-3.5">Customer</th>
                  <th scope="col" className="px-4 py-3.5">Equipment</th>
                  <th scope="col" className="px-4 py-3.5">Amount</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-4 py-3.5">Date</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {items.map((payment) => {
                  const badge = getPaymentStatusBadge(payment.status);
                  return (
                    <tr key={payment._id} className="hover:bg-surface-subtle/60">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">
                          {payment.customer?.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {payment.customer?.email || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="line-clamp-1 max-w-[240px] font-medium text-foreground">
                          {payment.equipment?.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {payment.equipment?.category || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-heading font-semibold whitespace-nowrap text-foreground tabular-nums">
                        {formatMoney(payment.amount, payment.currency)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge variant={badge.variant} dot size="sm">
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap text-text-secondary">
                        {formatTimestamp(payment.paidAt || payment.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {payment.customer?.id && !filters.customerId ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateFilters({ customerId: payment.customer.id })
                              }
                            >
                              <User className="size-3.5" />
                              <span>Customer</span>
                            </Button>
                          ) : null}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="size-3.5" />
                            <span>View</span>
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
            itemLabel="payments"
            ariaLabel="Payment history pagination"
            className="border-t border-border bg-background px-5 py-4"
          />
        </Card>
      )}

      {selectedPayment ? (
        <PaymentDetailsModal payment={selectedPayment} onClose={closeDetails} />
      ) : null}
    </div>
  );
}
