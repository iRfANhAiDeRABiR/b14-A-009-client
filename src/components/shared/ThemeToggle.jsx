"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

export function ThemeToggle({ compact = false, className = "" }) {
  const { isDark, toggleTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const label = mounted
    ? isDark
      ? "Switch to Light Mode"
      : "Switch to Dark Mode"
    : "Toggle color theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        compact && "size-10 px-0",
        className
      )}
    >
      {mounted && isDark ? (
        <Sun aria-hidden="true" className="size-4 text-accent" />
      ) : (
        <Moon aria-hidden="true" className="size-4 text-primary" />
      )}
      {!compact ? (
        <span className="hidden sm:inline">
          {mounted ? (isDark ? "Light" : "Dark") : "Theme"}
        </span>
      ) : null}
    </button>
  );
}
