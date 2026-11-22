"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function UserRoleDialog({
  pendingChange,
  onClose,
  onConfirm,
  isUpdating = false,
}) {
  const isOpen = Boolean(pendingChange?.user);
  const userName = pendingChange?.user?.name || "this user";
  const currentRole = pendingChange?.currentRole || "Customer";
  const nextRole = pendingChange?.nextRole || "";

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirm Role Change"
      description={
        pendingChange
          ? `Change role for "${userName}" from ${currentRole} to ${nextRole}? Platform permissions will update on the backend according to Admin governance policy (including self-role and last-admin protection).`
          : ""
      }
      confirmLabel={`Update Role to ${nextRole || "Selected"}`}
      cancelLabel="Cancel"
      confirmTone="primary"
      isLoading={isUpdating}
    />
  );
}
