"use client";

import Link from "next/link";
import { AlertCircle, ExternalLink, MapPin, Trash2 } from "lucide-react";

import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function FavoriteEquipmentCard({
  item,
  onRequestRemove,
  isRemoving = false,
  disableActions = false,
}) {
  const showUnavailableNotice = item.isDeletedRecord || !item.isPubliclyApproved;

  return (
    <Card padding="md" className="space-y-3.5 rounded-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image || "/images/hero-equipment.jpg"}
            alt={item.name}
            className="size-16 shrink-0 rounded-xl border border-border bg-surface-subtle object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold text-foreground">
              {item.name}
            </p>
            <p className="mt-0.5 text-xs text-text-secondary">{item.category}</p>
            {item.location ? (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-secondary">
                <MapPin aria-hidden="true" className="size-3.5 text-primary" />
                <span className="truncate">{item.location}</span>
              </p>
            ) : null}
          </div>
        </div>

        <Badge variant={item.availabilityVariant} dot size="sm">
          {item.availabilityStatus}
        </Badge>
      </div>

      {showUnavailableNotice ? (
        <div className="flex items-start gap-2 rounded-lg border border-warning-border bg-warning-bg px-3 py-2 text-xs text-warning">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>
            {item.isDeletedRecord
              ? "This equipment listing was removed or deleted by its provider."
              : "This listing is currently unavailable for public rental."}
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div>
          <p className="font-heading text-base font-bold text-primary tabular-nums">
            {item.rentalPrice !== null ? formatCurrencyBDT(item.rentalPrice) : "—"}
          </p>
          {item.rentalType ? (
            <p className="text-xs text-text-secondary">
              per {String(item.rentalType).toLowerCase()}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {!showUnavailableNotice ? (
            <Link
              href={`/equipment/${encodeURIComponent(item.equipmentId)}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>View Details</span>
              <ExternalLink aria-hidden="true" className="size-3.5" />
            </Link>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            disabled={disableActions}
            loading={isRemoving}
            onClick={() => onRequestRemove(item)}
            className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
          >
            {!isRemoving ? <Trash2 aria-hidden="true" className="size-3.5" /> : null}
            <span>Remove</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
