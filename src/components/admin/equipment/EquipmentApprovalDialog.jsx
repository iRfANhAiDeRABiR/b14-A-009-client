"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function EquipmentApprovalDialog({
  targetItem,
  onClose,
  onConfirm,
  isApproving = false,
}) {
  return (
    <ConfirmDialog
      isOpen={Boolean(targetItem)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Approve Equipment Listing?"
      description={
        targetItem
          ? `Approve "${targetItem.name}"? Once approved by an Administrator, this listing becomes eligible for public marketplace display and customer rental bookings.`
          : "Approve this equipment listing for public display?"
      }
      confirmLabel="Approve Listing"
      cancelLabel="Cancel"
      confirmTone="primary"
      isLoading={isApproving}
    />
  );
}
