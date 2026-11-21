"use client";

import { PAYMENT_FILTER_OPTIONS } from "@/lib/customerUtils";
import { cn } from "@/lib/utils";

export function PaymentStatusFilter({
  selectedStatus = "all",
  onSelectStatus,
  disabled = false,
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Payment Status
      </p>
      <div
        role="group"
        aria-label="Filter by payment status"
        className="flex flex-wrap items-center gap-2"
      >
        {PAYMENT_FILTER_OPTIONS.map((option) => {
          const active =
            String(selectedStatus || "all").toLowerCase() ===
            option.value.toLowerCase();
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onSelectStatus(option.value)}
              className={cn(
                "inline-flex min-h-9 cursor-pointer items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? "border-primary bg-secondary font-semibold text-primary"
                  : "border-border bg-surface text-text-secondary hover:border-primary/40 hover:text-primary"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
