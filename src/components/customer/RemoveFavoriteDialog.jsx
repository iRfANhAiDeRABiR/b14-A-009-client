"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function RemoveFavoriteDialog({
  targetItem,
  onClose,
  onConfirm,
  isRemoving = false,
}) {
  return (
    <ConfirmDialog
      isOpen={Boolean(targetItem)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Remove equipment from favorites?"
      description={
        targetItem
          ? `Remove "${targetItem.name}" from your saved favorites list? You can always add it again later.`
          : ""
      }
      confirmLabel="Remove Favorite"
      cancelLabel="Keep Saved"
      isLoading={isRemoving}
    />
  );
}
