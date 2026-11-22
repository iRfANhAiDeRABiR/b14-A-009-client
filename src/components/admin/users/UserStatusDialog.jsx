"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ShieldAlert, X } from "lucide-react";

import { ADMIN_ASSIGNABLE_ACCOUNT_STATUSES } from "@/lib/adminUtils";
import { Button } from "@/components/ui/Button";

export function UserStatusDialog({
  targetUser,
  onClose,
  onConfirm,
  isUpdating = false,
}) {
  const isOpen = Boolean(targetUser);
  const prefersReducedMotion = useReducedMotion();
  const targetId = targetUser?._id || "";

  const defaultStatus =
    String(targetUser?.accountStatus || "Active") === "Active"
      ? "Suspended"
      : "Active";

  const [draft, setDraft] = React.useState({
    userId: "",
    status: "Suspended",
    reason: "",
  });

  const selectedStatus =
    draft.userId === targetId ? draft.status : defaultStatus;
  const reason =
    draft.userId === targetId
      ? draft.reason
      : targetUser?.suspensionReason || "";

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape" && !isUpdating) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, isUpdating, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdating) return;
    onConfirm({
      status: selectedStatus,
      reason: selectedStatus === "Active" ? "" : reason.trim(),
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
            onClick={() => !isUpdating && onClose()}
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-status-dialog-title"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-md"
          >
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-warning-bg text-warning">
                  <ShieldAlert className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2
                    id="user-status-dialog-title"
                    className="font-heading text-base font-bold text-foreground"
                  >
                    Manage Account Access
                  </h2>
                  <p className="text-xs text-text-secondary">
                    {targetUser.name} ({targetUser.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isUpdating}
                onClick={onClose}
                aria-label="Close account status dialog"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-subtle"
              >
                <X className="size-4" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="admin-user-status-select"
                  className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                >
                  Account Status
                </label>
                <select
                  id="admin-user-status-select"
                  value={selectedStatus}
                  disabled={isUpdating}
                  onChange={(e) =>
                    setDraft({
                      userId: targetId,
                      status: e.target.value,
                      reason,
                    })
                  }
                  className="mt-1.5 min-h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {ADMIN_ASSIGNABLE_ACCOUNT_STATUSES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedStatus !== "Active" ? (
                <div>
                  <label
                    htmlFor="admin-user-status-reason"
                    className="text-xs font-semibold uppercase tracking-wide text-text-secondary"
                  >
                    Reason / Audit Note (Optional)
                  </label>
                  <textarea
                    id="admin-user-status-reason"
                    rows={3}
                    maxLength={300}
                    disabled={isUpdating}
                    placeholder="Provide context recorded in the platform audit log..."
                    value={reason}
                    onChange={(e) =>
                      setDraft({
                        userId: targetId,
                        status: selectedStatus,
                        reason: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="mt-2 flex items-start gap-2 rounded-lg border border-warning-border bg-warning-bg px-3 py-2 text-xs text-warning">
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      Suspending or banning immediately revokes active sessions
                      and blocks new API requests.
                    </span>
                  </div>
                </div>
              ) : null}

              <footer className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={selectedStatus === "Active" ? "primary" : "danger"}
                  size="sm"
                  loading={isUpdating}
                >
                  Save Status
                </Button>
              </footer>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
