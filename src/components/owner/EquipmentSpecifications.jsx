"use client";

import { AlertCircle, Factory, Wrench } from "lucide-react";

import { EQUIPMENT_CONDITION_OPTIONS } from "@/lib/ownerUtils";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function EquipmentSpecifications({
  values,
  errors,
  onChange,
  disabled = false,
}) {
  const isCustomCondition =
    Boolean(values.condition) &&
    !EQUIPMENT_CONDITION_OPTIONS.includes(values.condition);
  const selectValue = isCustomCondition ? "__custom__" : values.condition;

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="mb-5 border-b border-border pb-3.5">
        <h2 className="type-card-title text-foreground">
          3. Equipment Specifications
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Specify actual condition, manufacturer brand, and model reference.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="equipment-condition"
            className="flex items-center gap-1 text-sm font-medium text-foreground"
          >
            <span>Equipment Condition</span>
            <span aria-hidden="true" className="text-danger">
              *
            </span>
          </label>
          <select
            id="equipment-condition"
            name="condition"
            required
            disabled={disabled}
            value={selectValue}
            onChange={(e) => {
              const selected = e.target.value;
              if (selected === "__custom__") {
                onChange("condition", "");
              } else {
                onChange("condition", selected);
              }
            }}
            aria-invalid={Boolean(errors.condition) || undefined}
            aria-describedby={
              errors.condition ? "equipment-condition-error" : undefined
            }
            className={cn(
              "min-h-11 w-full cursor-pointer rounded-lg border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70 sm:text-sm",
              errors.condition
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-border focus:border-primary focus:ring-primary/20"
            )}
          >
            <option value="">Select condition</option>
            {EQUIPMENT_CONDITION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Input
            id="equipment-condition-custom"
            name="conditionCustom"
            type="text"
            label="Or describe condition"
            placeholder="e.g., Serviced Q4 2026"
            disabled={disabled}
            value={values.condition}
            onChange={(e) => onChange("condition", e.target.value)}
            helperText="Select above or type exact condition details."
            className="text-xs"
            wrapperClassName="mt-1"
          />

          {errors.condition ? (
            <p
              id="equipment-condition-error"
              role="alert"
              className="flex items-center gap-1.5 text-xs font-medium text-danger"
            >
              <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
              <span>{errors.condition}</span>
            </p>
          ) : null}
        </div>

        <Input
          id="equipment-brand"
          name="brand"
          type="text"
          label="Brand"
          placeholder="Enter equipment brand"
          required
          disabled={disabled}
          value={values.brand}
          onChange={(e) => onChange("brand", e.target.value)}
          error={errors.brand}
          leftIcon={<Factory className="size-4" />}
        />

        <Input
          id="equipment-model"
          name="model"
          type="text"
          label="Model"
          placeholder="Enter equipment model"
          required
          disabled={disabled}
          value={values.model}
          onChange={(e) => onChange("model", e.target.value)}
          error={errors.model}
          leftIcon={<Wrench className="size-4" />}
        />
      </div>
    </Card>
  );
}
