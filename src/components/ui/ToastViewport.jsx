"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  success: {
    container: "border-success-border bg-surface text-foreground",
    iconWrap: "bg-success-bg text-success",
    Icon: CheckCircle2,
  },
  error: {
    container: "border-danger-border bg-surface text-foreground",
    iconWrap: "bg-danger-bg text-danger",
    Icon: AlertCircle,
  },
  warning: {
    container: "border-warning-border bg-surface text-foreground",
    iconWrap: "bg-warning-bg text-warning",
    Icon: AlertCircle,
  },
  neutral: {
    container: "border-border bg-surface text-foreground",
    iconWrap: "bg-secondary text-primary",
    Icon: Info,
  },
};

export function ToastViewport({ toasts = [], onDismiss }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed right-4 bottom-4 left-4 z-[70] flex flex-col items-end gap-2.5 sm:left-auto sm:w-full sm:max-w-sm"
    >
      <AnimatePresence initial={false}>
        {toasts.map((item) => {
          const style = VARIANT_STYLES[item.variant] || VARIANT_STYLES.neutral;
          const Icon = style.Icon;

          return (
            <motion.div
              key={item.id}
              role="status"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-4 shadow-md",
                style.container
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  style.iconWrap
                )}
              >
                <Icon className="size-4" />
              </span>

              <div className="min-w-0 flex-1">
                {item.title ? (
                  <p className="font-heading text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                ) : null}
                {item.description ? (
                  <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                aria-label="Dismiss notification"
                className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
