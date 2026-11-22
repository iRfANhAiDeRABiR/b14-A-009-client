"use client";

import { Eye, Factory, MapPin, ShieldAlert, Wrench } from "lucide-react";

import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function EquipmentLivePreview({
  values,
  previewImageSrc = "",
}) {
  const numericPrice = Number(values.rentalPrice);
  const formattedPrice =
    Number.isFinite(numericPrice) && numericPrice > 0
      ? formatCurrencyBDT(numericPrice)
      : "৳0";

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Eye aria-hidden="true" className="size-4 text-primary" />
          <h2 className="type-card-title text-foreground">Listing Preview</h2>
        </div>
        <Badge variant="warning" size="sm">
          Draft Preview
        </Badge>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="relative aspect-[16/10] w-full bg-surface-subtle">
          {previewImageSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previewImageSrc}
              alt={values.name || "Listing preview image"}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center px-4 text-center text-xs text-muted">
              Uploaded equipment photo will appear here
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <Badge variant="warning" size="sm" className="bg-surface/95">
              Pending Approval
            </Badge>
            {values.category ? (
              <Badge variant="primary" size="sm" className="bg-surface/95">
                {values.category}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              {values.name?.trim() || "Your Equipment Name"}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-text-secondary">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" />
              <span>{values.location?.trim() || "Equipment Location"}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface p-2.5 text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Factory aria-hidden="true" className="size-3.5 text-primary" />
              <span className="truncate">
                {values.brand?.trim() || "Brand"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Wrench aria-hidden="true" className="size-3.5 text-primary" />
              <span className="truncate">
                {values.model?.trim() || "Model"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <div>
              <p className="font-heading text-lg font-bold text-primary tabular-nums">
                {formattedPrice}
              </p>
              <p className="text-[11px] text-text-secondary">
                per {String(values.rentalType || "Daily").toLowerCase()}
              </p>
            </div>

            {values.condition?.trim() ? (
              <Badge variant="neutral" size="sm">
                {values.condition.trim()}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-text-secondary">
        <ShieldAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-warning" />
        <span>
          This preview reflects your current inputs only and does not publish or save a record until submitted and approved by an admin.
        </span>
      </p>
    </Card>
  );
}
