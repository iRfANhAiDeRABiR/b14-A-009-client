"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function DeleteEquipmentDialog({
  targetItem,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  return (
    <ConfirmDialog
      isOpen={Boolean(targetItem)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Equipment?"
      description={
        targetItem
          ? `Are you sure you want to delete "${targetItem.name}"? This action may not be reversible.`
          : "Are you sure you want to delete this equipment listing? This action may not be reversible."
      }
      confirmLabel="Delete Equipment"
      cancelLabel="Cancel"
      isLoading={isDeleting}
    />
  );
}
