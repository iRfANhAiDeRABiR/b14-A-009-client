import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  success: "border-success-border bg-success-bg text-success",
  warning: "border-warning-border bg-warning-bg text-warning",
  danger: "border-danger-border bg-danger-bg text-danger",
  neutral: "border-border bg-surface-subtle text-text-secondary",
  primary: "border-primary/20 bg-secondary text-primary",
};

const DOT_CLASSES = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted",
  primary: "bg-primary",
};

const SIZE_CLASSES = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-xs",
};

export function Badge({
  variant = "neutral",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.neutral,
        SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
        className
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            DOT_CLASSES[variant] ?? DOT_CLASSES.neutral
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
