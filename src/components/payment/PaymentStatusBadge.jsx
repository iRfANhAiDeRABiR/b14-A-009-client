"use client";

import { getPaymentStatusBadge } from "@/lib/customerUtils";
import { Badge } from "@/components/ui/Badge";

export function PaymentStatusBadge({ status = "Pending", size = "sm", className = "" }) {
  const badge = getPaymentStatusBadge(status);

  return (
    <Badge
      variant={badge.variant}
      dot={String(badge.label || "").toLowerCase() === "pending"}
      size={size}
      className={className}
    >
      {badge.label}
    </Badge>
  );
}
