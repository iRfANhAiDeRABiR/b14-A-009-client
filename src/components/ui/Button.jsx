import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover focus-visible:ring-primary",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-primary",
  outline:
    "border border-border bg-surface text-foreground hover:border-primary/40 hover:bg-surface-subtle focus-visible:ring-primary",
  ghost:
    "bg-transparent text-foreground hover:bg-secondary/60 focus-visible:ring-primary",
  inverted:
    "bg-white text-[#193D34] shadow-xs hover:bg-[#DCE8DF] focus-visible:ring-white",
};

const SIZES = {
  sm: "min-h-9 px-3.5 py-2 text-xs",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  className,
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  const classes = cn(
    "type-button inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth && "w-full",
    isDisabled && "pointer-events-none opacity-50",
    className
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {loading ? (
        <Loader2 aria-hidden="true" className="size-4 shrink-0 animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
