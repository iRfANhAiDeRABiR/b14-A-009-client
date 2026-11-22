"use client";

import { CheckCircle2 } from "lucide-react";

import {
  getBookingStatusBadge,
  getPaymentStatusBadge,
} from "@/lib/ownerUtils";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function OwnerRentalStatusBadge({
  kind = "booking",
  status = "Pending",
  size = "sm",
  className = "",
}) {
  const isPayment = kind === "payment";
  const badge = isPayment
    ? getPaymentStatusBadge(status)
    : getBookingStatusBadge(status);

  const normalized = String(badge.label || "").trim().toLowerCase();
  const isCompletedBooking = !isPayment && normalized === "completed";
  const isActiveBooking = !isPayment && normalized === "active";
  const isPending = normalized === "pending";

  if (isCompletedBooking) {
    return (
      <Badge
        variant="neutral"
        size={size}
        className={cn(
          "border-success-border/70 bg-surface-subtle text-success",
          className
        )}
      >
        <CheckCircle2 aria-hidden="true" className="size-3 shrink-0" />
        <span>{badge.label}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant={badge.variant}
      dot={isActiveBooking || isPending || (!isPayment && normalized === "confirmed")}
      size={size}
      className={className}
    >
      {badge.label}
    </Badge>
  );
}
