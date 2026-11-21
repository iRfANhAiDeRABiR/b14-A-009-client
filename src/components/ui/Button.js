import Link from "next/link";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover focus-visible:ring-primary",
  secondary:
    "border border-primary/25 bg-surface text-primary hover:border-primary/50 hover:bg-surface-muted focus-visible:ring-primary",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-muted focus-visible:ring-primary",
  inverted:
    "bg-primary-foreground text-primary shadow-sm hover:bg-[#ECEFE6] focus-visible:ring-primary-foreground",
};

const SIZES = {
  md: "min-h-11 px-5 py-2.5 text-sm font-semibold",
  lg: "min-h-12 px-6 py-3 text-base font-semibold",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  const classes = cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
