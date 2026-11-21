import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "max-w-[42rem]",
  md: "max-w-[64rem]",
  lg: "max-w-[80rem]",
  wide: "max-w-[90rem]",
  full: "max-w-none",
};

export function Container({
  as: Component = "div",
  size = "lg",
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        SIZE_CLASSES[size] ?? SIZE_CLASSES.lg,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
