"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  isLoading = false,
}) {
  const prefersReducedMotion = useReducedMotion();
  const cancelButtonRef = React.useRef(null);

  React.useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 20);

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
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
  }, [isLoading, isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
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
              if (!isLoading) onClose();
            }}
            aria-hidden="true"
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
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
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-warning-border bg-warning-bg text-warning"
                >
                  <AlertTriangle className="size-5" />
                </span>
                <div>
                  <h2
                    id="confirm-dialog-title"
                    className="font-heading text-lg font-bold text-foreground"
                  >
                    {title}
                  </h2>
                  <p
                    id="confirm-dialog-description"
                    className="mt-1.5 text-sm leading-relaxed text-text-secondary"
                  >
                    {description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                aria-label="Close dialog"
                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2.5 border-t border-border pt-4">
              <Button
                ref={cancelButtonRef}
                variant="outline"
                size="md"
                disabled={isLoading}
                onClick={onClose}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={confirmVariant}
                size="md"
                loading={isLoading}
                onClick={onConfirm}
                className="bg-danger text-white hover:bg-[#961D13] focus-visible:ring-danger"
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
