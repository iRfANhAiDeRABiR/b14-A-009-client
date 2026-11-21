import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  rect: "rounded-lg",
  text: "h-4 rounded-md",
  circle: "rounded-full",
};

export function Skeleton({
  variant = "rect",
  className,
  ...props
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-border/80 motion-reduce:animate-none",
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.rect,
        className
      )}
      {...props}
    />
  );
}
