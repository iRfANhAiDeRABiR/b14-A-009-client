"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, X, XCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function EquipmentRejectionDialog({
  targetItem,
  onClose,
  onConfirm,
  isRejecting = false,
}) {
  const isOpen = Boolean(targetItem);
  const targetId = targetItem?._id || "";
  const prefersReducedMotion = useReducedMotion();
  const textareaRef = React.useRef(null);
  const [draft, setDraft] = React.useState({ itemId: "", reason: "" });
  const [error, setError] = React.useState("");

  const reason =
    draft.itemId === targetId
      ? draft.reason
      : targetItem?.rejectionReason || "";

  const handleClose = React.useCallback(() => {
    setDraft({ itemId: "", reason: "" });
    setError("");
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 20);

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isRejecting) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    };
  }, [handleClose, isOpen, isRejecting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isRejecting) return;

    const trimmed = reason.trim();
    if (trimmed.length < 5) {
      setError(
        "Please provide a clear rejection reason (at least 5 characters) for the equipment owner."
      );
      textareaRef.current?.focus();
      return;
    }

    setError("");
    onConfirm(trimmed);
  };

  return (
    <AnimatePresence>
      {isOpen && targetItem ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => {
              if (!isRejecting) handleClose();
            }}
            aria-hidden="true"
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reject-equipment-title"
            aria-describedby="reject-equipment-description"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, scale: 0.97, y: 8 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.97, y: 8 }
            }
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-danger-border bg-danger-bg text-danger"
                >
                  <XCircle className="size-5" />
                </span>
                <div>
                  <h2
                    id="reject-equipment-title"
                    className="font-heading text-lg font-bold text-foreground"
                  >
                    Reject Equipment Listing
                  </h2>
                  <p
                    id="reject-equipment-description"
                    className="mt-1 text-sm leading-relaxed text-text-secondary"
                  >
                    Provide moderation feedback before marking{" "}
                    <strong className="font-semibold text-foreground">
                      {targetItem.name}
                    </strong>{" "}
                    as Rejected. Rejected equipment will not be publicly rentable.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isRejecting}
                onClick={handleClose}
                aria-label="Close rejection dialog"
                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="equipment-rejection-reason"
                  className="flex items-center gap-1 text-sm font-medium text-foreground"
                >
                  <span>Rejection Reason</span>
                  <span aria-hidden="true" className="text-danger">
                    *
                  </span>
                </label>

                <textarea
                  ref={textareaRef}
                  id="equipment-rejection-reason"
                  rows={3}
                  maxLength={500}
                  disabled={isRejecting}
                  value={reason}
                  onChange={(e) => {
                    setDraft({ itemId: targetId, reason: e.target.value });
                    if (error) setError("");
                  }}
                  placeholder="e.g., Photos are blurry or rental rate needs clarification before public listing."
                  aria-invalid={Boolean(error) || undefined}
                  className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-xs placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-surface-subtle"
                />

                {error ? (
                  <p
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger"
                  >
                    <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
                    <span>{error}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-text-secondary">
                    The reason is saved on the listing for owner review.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-2.5 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isRejecting}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isRejecting}
                  className="bg-danger text-white hover:bg-[#961D13] focus-visible:ring-danger"
                >
                  Confirm Rejection
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
