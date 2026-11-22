"use client";

import { ArrowRight, Boxes, PlusCircle } from "lucide-react";

import { getApprovalStatusBadge } from "@/lib/ownerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function getAvailabilityBadgeVariant(label, qty) {
  if (qty !== null && qty <= 0) return "danger";
  const lower = String(label || "").toLowerCase();
  if (lower.includes("unavailable")) return "danger";
  if (lower.includes("limited")) return "warning";
  if (lower.includes("available")) return "success";
  return "neutral";
}

export function OwnerEquipmentPerformance({
  items = [],
  loading = false,
}) {
  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3.5 rounded-xl border border-border p-3.5"
            >
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const safeItems = Array.isArray(items) ? items : [];
  const hasRentalsMetric = safeItems.some((item) => item.rentalsCount !== null);
  const hasEarningsMetric = safeItems.some(
    (item) => item.earningsGenerated !== null
  );

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="type-card-title text-foreground">
            Your Equipment Performance
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Listing status, availability, and verified booking metrics returned for your fleet.
          </p>
        </div>

        <Button href="/dashboard/owner/my-equipment" variant="outline" size="sm">
          <span>Manage My Equipment</span>
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Button>
      </div>

      {safeItems.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <Boxes className="size-6" />
          </span>
          <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
            No equipment performance data yet
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-text-secondary">
            Add approved equipment listings to monitor fleet demand, rental counts, and earnings breakdown.
          </p>
          <Button
            href="/dashboard/owner/add-equipment"
            variant="primary"
            size="sm"
            className="mt-4"
          >
            <PlusCircle aria-hidden="true" className="size-3.5" />
            <span>Add New Equipment</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-5 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <th scope="col" className="px-4 py-3">
                    Equipment
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Rate
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Approval
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Availability
                  </th>
                  {hasRentalsMetric ? (
                    <th scope="col" className="px-4 py-3 text-right">
                      Rentals
                    </th>
                  ) : null}
                  {hasEarningsMetric ? (
                    <th scope="col" className="px-4 py-3 text-right">
                      Earnings
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {safeItems.map((item) => {
                  const approval = getApprovalStatusBadge(item.approvalStatus);
                  const availVariant = getAvailabilityBadgeVariant(
                    item.availabilityStatus,
                    item.availableQuantity
                  );

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-surface-subtle/70"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image || "/images/hero-equipment.jpg"}
                            alt={item.name}
                            className="size-10 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-heading font-semibold text-foreground">
                              {item.name}
                            </p>
                            {item.category ? (
                              <p className="text-xs text-text-secondary">
                                {item.category}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-heading font-semibold whitespace-nowrap text-primary tabular-nums">
                        {item.rentalPrice !== null
                          ? `${formatCurrencyBDT(item.rentalPrice)} / ${item.rentalType}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {item.approvalStatus ? (
                          <Badge variant={approval.variant} size="sm">
                            {approval.label}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {item.availabilityStatus ? (
                          <Badge variant={availVariant} dot size="sm">
                            {item.availabilityStatus}
                            {item.availableQuantity !== null
                              ? ` (${item.availableQuantity})`
                              : ""}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                      {hasRentalsMetric ? (
                        <td className="px-4 py-3.5 text-right font-semibold whitespace-nowrap text-foreground tabular-nums">
                          {item.rentalsCount !== null ? item.rentalsCount : "—"}
                        </td>
                      ) : null}
                      {hasEarningsMetric ? (
                        <td className="px-4 py-3.5 text-right font-heading font-bold whitespace-nowrap text-primary tabular-nums">
                          {item.earningsGenerated !== null
                            ? formatCurrencyBDT(item.earningsGenerated)
                            : "—"}
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mt-5 space-y-3 md:hidden">
            {safeItems.map((item) => {
              const approval = getApprovalStatusBadge(item.approvalStatus);
              const availVariant = getAvailabilityBadgeVariant(
                item.availabilityStatus,
                item.availableQuantity
              );

              return (
                <div
                  key={item._id}
                  className="space-y-3 rounded-xl border border-border bg-background p-3.5"
                >
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || "/images/hero-equipment.jpg"}
                      alt={item.name}
                      className="size-12 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      {item.category ? (
                        <p className="text-xs text-text-secondary">
                          {item.category}
                        </p>
                      ) : null}
                      {item.rentalPrice !== null ? (
                        <p className="mt-1 font-heading text-sm font-bold text-primary tabular-nums">
                          {formatCurrencyBDT(item.rentalPrice)} / {item.rentalType}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {item.approvalStatus ? (
                        <Badge variant={approval.variant} size="sm">
                          {approval.label}
                        </Badge>
                      ) : null}
                      {item.availabilityStatus ? (
                        <Badge variant={availVariant} dot size="sm">
                          {item.availabilityStatus}
                        </Badge>
                      ) : null}
                    </div>

                    {item.rentalsCount !== null ||
                    item.earningsGenerated !== null ? (
                      <div className="flex items-center gap-3 tabular-nums">
                        {item.rentalsCount !== null ? (
                          <span className="text-text-secondary">
                            Rentals:{" "}
                            <strong className="text-foreground">
                              {item.rentalsCount}
                            </strong>
                          </span>
                        ) : null}
                        {item.earningsGenerated !== null ? (
                          <span className="font-semibold text-primary">
                            {formatCurrencyBDT(item.earningsGenerated)}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}
