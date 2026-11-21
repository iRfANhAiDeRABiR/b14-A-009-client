import { cn } from "@/lib/utils";

const PADDING_CLASSES = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const TONE_CLASSES = {
  surface: "border-border bg-surface text-foreground",
  subtle: "border-border bg-surface-subtle text-foreground",
  background: "border-border bg-background text-foreground",
  primary: "border-primary bg-primary text-primary-foreground",
};

export function Card({
  as: Component = "div",
  padding = "md",
  tone = "surface",
  hoverable = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "rounded-xl border shadow-xs transition-[border-color,box-shadow,transform] duration-200",
        TONE_CLASSES[tone] ?? TONE_CLASSES.surface,
        PADDING_CLASSES[padding] ?? PADDING_CLASSES.md,
        hoverable &&
          "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardMedia({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface-subtle",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ as: Component = "h3", className, children, ...props }) {
  return (
    <Component className={cn("type-card-title text-foreground", className)} {...props}>
      {children}
    </Component>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm leading-relaxed text-text-secondary", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("flex-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("mt-4 flex items-center justify-between gap-3 pt-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}
