"use client";

import { AlertCircle } from "lucide-react";

import { EQUIPMENT_FORM_LIMITS } from "@/lib/ownerUtils";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function RentalTermsForm({
  value = "",
  error = "",
  onChange,
  disabled = false,
}) {
  const length = String(value || "").length;

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="mb-5 border-b border-border pb-3.5">
        <h2 className="type-card-title text-foreground">
          6. Rental Terms &amp; Conditions
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          State operating policies, operator certification rules, fuel responsibility, or deposit conditions.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="equipment-rental-terms"
            className="flex items-center gap-1 text-sm font-medium text-foreground"
          >
            <span>Terms &amp; Conditions</span>
            <span aria-hidden="true" className="text-danger">
              *
            </span>
          </label>
          <span className="text-xs text-muted tabular-nums">
            {length} / {EQUIPMENT_FORM_LIMITS.termsMax}
          </span>
        </div>

        <textarea
          id="equipment-rental-terms"
          name="rentalTerms"
          rows={4}
          required
          maxLength={EQUIPMENT_FORM_LIMITS.termsMax}
          disabled={disabled}
          placeholder="Describe rental terms, usage rules, security requirements and other conditions..."
          value={value}
          onChange={(e) => onChange("rentalTerms", e.target.value)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby="equipment-rental-terms-hint"
          className={cn(
            "w-full rounded-lg border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors placeholder:text-muted focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70 sm:text-sm",
            error
              ? "border-danger focus:border-danger focus:ring-danger/20"
              : "border-border focus:border-primary focus:ring-primary/20"
          )}
        />

        {error ? (
          <p
            id="equipment-rental-terms-hint"
            role="alert"
            className="flex items-center gap-1.5 text-xs font-medium text-danger"
          >
            <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : (
          <p id="equipment-rental-terms-hint" className="text-xs text-text-secondary">
            Minimum {EQUIPMENT_FORM_LIMITS.termsMin} characters shown transparently to renters before checkout.
          </p>
        )}
      </div>
    </Card>
  );
}
