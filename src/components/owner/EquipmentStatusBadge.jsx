"use client";

import { getApprovalStatusBadge } from "@/lib/ownerUtils";
import { Badge } from "@/components/ui/Badge";

export function EquipmentStatusBadge({ status, size = "sm", className }) {
  const badge = getApprovalStatusBadge(status);

  return (
    <Badge
      variant={badge.variant}
      dot
      size={size}
      className={className}
    >
      {badge.label}
    </Badge>
  );
}
