import { cn } from "@/lib/utils";

const HEADING_STYLES = {
  hero: "type-hero",
  page: "type-page-title",
  section: "type-section-title",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Component = "h2",
  headingId,
  variant = "section",
  align = "left",
  actions,
  className,
}) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        isCentered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("max-w-2xl", isCentered && "mx-auto")}>
        {eyebrow ? (
          <p className="type-label text-primary">{eyebrow}</p>
        ) : null}

        <Component
          id={headingId}
          className={cn(
            HEADING_STYLES[variant] ?? HEADING_STYLES.section,
            eyebrow ? "mt-2" : "",
            "text-foreground"
          )}
        >
          {title}
        </Component>

        {description ? (
          <p className="type-body mt-3 text-text-secondary">{description}</p>
        ) : null}
      </div>

      {actions && !isCentered ? (
        <div className="shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}
