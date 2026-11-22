"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function UserDeleteDialog({
  targetUser,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  return (
    <ConfirmDialog
      isOpen={Boolean(targetUser)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Remove User Account?"
      description={
        targetUser
          ? `Remove "${targetUser.name}" (${targetUser.email}) from active platform access? Active sessions will be terminated and historical rental/audit records will remain safely archived.`
          : "Remove this user account?"
      }
      confirmLabel="Remove User"
      cancelLabel="Cancel"
      confirmTone="danger"
      isLoading={isDeleting}
    />
  );
}
