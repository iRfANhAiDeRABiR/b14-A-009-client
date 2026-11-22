"use client";

import { AlertCircle, Hash } from "lucide-react";

import { ALLOWED_RENTAL_TYPES } from "@/lib/ownerUtils";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function EquipmentRentalInfo({
  values,
  errors,
  onChange,
  disabled = false,
}) {
  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="mb-5 border-b border-border pb-3.5">
        <h2 className="type-card-title text-foreground">
          2. Rental Information
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Set pricing in Bangladeshi Taka (৳), billing unit, and rentable stock count.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          id="equipment-price"
          name="rentalPrice"
          type="number"
          inputMode="decimal"
          min="1"
          step="any"
          label="Rental Price (BDT)"
          placeholder="Enter rental price"
          required
          disabled={disabled}
          value={values.rentalPrice}
          onChange={(e) => onChange("rentalPrice", e.target.value)}
          error={errors.rentalPrice}
          helperText="Rate in Bangladeshi Taka (৳)"
          leftIcon={
            <span className="font-heading text-sm font-bold text-primary">
              ৳
            </span>
          }
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="equipment-rental-type"
            className="flex items-center gap-1 text-sm font-medium text-foreground"
          >
            <span>Rental Type</span>
            <span aria-hidden="true" className="text-danger">
              *
            </span>
          </label>
          <select
            id="equipment-rental-type"
            name="rentalType"
            required
            disabled={disabled}
            value={values.rentalType}
            onChange={(e) => onChange("rentalType", e.target.value)}
            aria-invalid={Boolean(errors.rentalType) || undefined}
            aria-describedby={
              errors.rentalType ? "equipment-rental-type-error" : undefined
            }
            className={cn(
              "min-h-11 w-full cursor-pointer rounded-lg border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70 sm:text-sm",
              errors.rentalType
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-border focus:border-primary focus:ring-primary/20"
            )}
          >
            {ALLOWED_RENTAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.rentalType ? (
            <p
              id="equipment-rental-type-error"
              role="alert"
              className="flex items-center gap-1.5 text-xs font-medium text-danger"
            >
              <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
              <span>{errors.rentalType}</span>
            </p>
          ) : (
            <p className="text-xs text-text-secondary">
              Daily, Weekly, or Monthly billing
            </p>
          )}
        </div>

        <Input
          id="equipment-quantity"
          name="availableQuantity"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          label="Available Quantity"
          placeholder="1"
          required
          disabled={disabled}
          value={values.availableQuantity}
          onChange={(e) => onChange("availableQuantity", e.target.value)}
          error={errors.availableQuantity}
          helperText="Minimum 1 unit"
          leftIcon={<Hash className="size-4" />}
        />
      </div>
    </Card>
  );
}
