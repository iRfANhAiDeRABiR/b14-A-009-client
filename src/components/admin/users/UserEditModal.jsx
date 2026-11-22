"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function UserEditModal({
  targetUser,
  onClose,
  onConfirm,
  isSaving = false,
}) {
  const isOpen = Boolean(targetUser);
  const prefersReducedMotion = useReducedMotion();
  const targetId = targetUser?._id || "";

  const [draft, setDraft] = React.useState({
    userId: "",
    name: "",
    phone: "",
    address: "",
  });
  const [error, setError] = React.useState("");

  const activeName =
    draft.userId === targetId ? draft.name : targetUser?.name || "";
  const activePhone =
    draft.userId === targetId ? draft.phone : targetUser?.phone || "";
  const activeAddress =
    draft.userId === targetId ? draft.address : targetUser?.address || "";

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, isSaving, onClose]);

  const updateField = (field, val) => {
    setError("");
    setDraft({
      userId: targetId,
      name: field === "name" ? val : activeName,
      phone: field === "phone" ? val : activePhone,
      address: field === "address" ? val : activeAddress,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaving) return;
    const trimmedName = activeName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setError("Full name must be between 2 and 80 characters.");
      return;
    }
    const trimmedPhone = activePhone.trim();
    if (trimmedPhone && (trimmedPhone.length < 6 || trimmedPhone.length > 25)) {
      setError("Phone number must be between 6 and 25 characters.");
      return;
    }
    onConfirm({
      name: trimmedName,
      phone: trimmedPhone,
      address: activeAddress.trim(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && targetUser ? (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSaving && onClose()}
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-edit-modal-title"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-md"
          >
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Pencil className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h2
                    id="user-edit-modal-title"
                    className="font-heading text-base font-bold text-foreground"
                  >
                    Edit User Details
                  </h2>
                  <p className="text-xs text-text-secondary">{targetUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={onClose}
                aria-label="Close user edit modal"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-subtle"
              >
                <X className="size-4" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {error ? (
                <p
                  role="alert"
                  className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-xs font-medium text-danger"
                >
                  {error}
                </p>
              ) : null}

              <Input
                id="admin-edit-user-name"
                label="Full Name"
                required
                disabled={isSaving}
                value={activeName}
                onChange={(e) => updateField("name", e.target.value)}
              />

              <Input
                id="admin-edit-user-phone"
                label="Phone Number"
                disabled={isSaving}
                placeholder="+8801XXXXXXXXX"
                value={activePhone}
                onChange={(e) => updateField("phone", e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-edit-user-address"
                  className="text-sm font-medium text-foreground"
                >
                  Address
                </label>
                <textarea
                  id="admin-edit-user-address"
                  rows={2}
                  maxLength={240}
                  disabled={isSaving}
                  placeholder="Street, district, or company hub..."
                  value={activeAddress}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <footer className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={isSaving}>
                  Save Changes
                </Button>
              </footer>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
