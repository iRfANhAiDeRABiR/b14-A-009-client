"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  isFavorite,
  isLoading,
  disabled = false,
  onClick,
  errorMessage,
  helperText = "",
  className,
}) {
  const prefersReducedMotion = useReducedMotion();
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <motion.button
        type="button"
        disabled={isDisabled}
        onClick={onClick}
        aria-pressed={isFavorite}
        aria-busy={isLoading || undefined}
        aria-label={
          isFavorite ? "Remove equipment from favorites" : "Add equipment to favorites"
        }
        whileTap={
          prefersReducedMotion || isDisabled ? undefined : { scale: 0.97 }
        }
        className={cn(
          "type-button inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
          isFavorite
            ? "border-danger-border bg-danger-bg text-danger hover:bg-danger-hover-bg"
            : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-surface-subtle"
        )}
      >
        {isLoading ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Heart
            aria-hidden="true"
            className={cn("size-4", isFavorite && "fill-danger text-danger")}
          />
        )}
        <span>
          {isLoading
            ? "Updating..."
            : isFavorite
              ? "Saved in Favorites"
              : "Add to Favorites"}
        </span>
      </motion.button>

      {errorMessage ? (
        <p role="alert" className="text-xs font-medium text-warning">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-xs text-text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
}
