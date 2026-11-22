"use client";

import { AlertCircle, MapPin, Tag } from "lucide-react";

import {
  ALLOWED_EQUIPMENT_CATEGORIES,
  EQUIPMENT_FORM_LIMITS,
} from "@/lib/ownerUtils";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function EquipmentBasicInfo({
  values,
  errors = {},
  onChange,
  disabled = false,
}) {
  const descriptionLength = String(values.description || "").length;

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="mb-5 border-b border-border pb-3.5">
        <h2 className="type-card-title text-foreground">
          1. Basic Information
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Provide an accurate equipment title, category, operating location, and summary for renters.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          id="equipment-name"
          name="name"
          type="text"
          label="Equipment Name"
          placeholder="Enter equipment name"
          required
          disabled={disabled}
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors.name}
          leftIcon={<Tag className="size-4" />}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="equipment-category"
              className="flex items-center gap-1 text-sm font-medium text-foreground"
            >
              <span>Category</span>
              <span aria-hidden="true" className="text-danger">
                *
              </span>
            </label>
            <select
              id="equipment-category"
              name="category"
              required
              disabled={disabled}
              value={values.category}
              onChange={(e) => onChange("category", e.target.value)}
              aria-invalid={Boolean(errors.category) || undefined}
              aria-describedby={
                errors.category ? "equipment-category-error" : undefined
              }
              className={cn(
                "min-h-11 w-full cursor-pointer rounded-lg border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70 sm:text-sm",
                errors.category
                  ? "border-danger focus:border-danger focus:ring-danger/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              )}
            >
              <option value="">Select Category</option>
              {ALLOWED_EQUIPMENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p
                id="equipment-category-error"
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-danger"
              >
                <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
                <span>{errors.category}</span>
              </p>
            ) : null}
          </div>

          <Input
            id="equipment-location"
            name="location"
            type="text"
            label="Location"
            placeholder="Enter equipment location"
            required
            disabled={disabled}
            value={values.location}
            onChange={(e) => onChange("location", e.target.value)}
            error={errors.location}
            leftIcon={<MapPin className="size-4" />}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="equipment-description"
              className="flex items-center gap-1 text-sm font-medium text-foreground"
            >
              <span>Description</span>
              <span aria-hidden="true" className="text-danger">
                *
              </span>
            </label>
            <span className="text-xs text-muted tabular-nums">
              {descriptionLength} / {EQUIPMENT_FORM_LIMITS.descriptionMax}
            </span>
          </div>

          <textarea
            id="equipment-description"
            name="description"
            rows={4}
            required
            maxLength={EQUIPMENT_FORM_LIMITS.descriptionMax}
            disabled={disabled}
            placeholder="Describe your equipment, features and intended use..."
            value={values.description}
            onChange={(e) => onChange("description", e.target.value)}
            aria-invalid={Boolean(errors.description) || undefined}
            aria-describedby="equipment-description-hint"
            className={cn(
              "w-full rounded-lg border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors placeholder:text-muted focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70 sm:text-sm",
              errors.description
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-border focus:border-primary focus:ring-primary/20"
            )}
          />

          {errors.description ? (
            <p
              id="equipment-description-hint"
              role="alert"
              className="flex items-center gap-1.5 text-xs font-medium text-danger"
            >
              <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
              <span>{errors.description}</span>
            </p>
          ) : (
            <p id="equipment-description-hint" className="text-xs text-text-secondary">
              Minimum {EQUIPMENT_FORM_LIMITS.descriptionMin} characters summarizing capabilities and attachments.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
