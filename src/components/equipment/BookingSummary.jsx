"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { RentalPriceCalculator } from "@/components/equipment/RentalPriceCalculator";
import { StripeTestCardBox } from "@/components/payment/StripeTestCardBox";

export function BookingSummary({
  equipmentName,
  startDate,
  endDate,
  quantity,
  estimate,
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-3"
    >
      <div className="rounded-xl border border-primary/15 bg-secondary/40 p-4">
        <p className="type-label text-[11px] text-primary">Booking Summary</p>
        <p className="mt-1 font-heading text-base font-bold text-foreground">
          {equipmentName}
        </p>

        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-text-secondary">Start Date</dt>
            <dd className="font-semibold text-foreground tabular-nums">
              {startDate || "Not selected"}
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">End Date</dt>
            <dd className="font-semibold text-foreground tabular-nums">
              {endDate || "Not selected"}
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">Quantity</dt>
            <dd className="font-semibold text-foreground tabular-nums">
              {quantity || 0}
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">Estimate</dt>
            <dd className="font-semibold text-primary tabular-nums">
              {formatCurrencyBDT(estimate.estimatedTotal)}
            </dd>
          </div>
        </dl>
      </div>

      <RentalPriceCalculator estimate={estimate} />
      <StripeTestCardBox />
    </motion.div>
  );
}
