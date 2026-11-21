import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({ tone = "dark", className }) {
  const isLightText = tone === "light";

  return (
    <Link
      href="/"
      aria-label="GearNest home"
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-[1.03]",
          isLightText ? "bg-[#F7F8F4]/12 ring-1 ring-[#F7F8F4]/25" : "bg-primary shadow-sm"
        )}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 7.5L30.8253 13.75V26.25L20 32.5L9.17468 26.25V13.75L20 7.5Z"
            stroke="#F7F8F4"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <circle
            cx="20"
            cy="20"
            r="4.75"
            stroke="#D9A441"
            strokeWidth="2.4"
          />
          <path
            d="M20 12V15.2M20 24.8V28M13.07 16L15.84 17.6M24.16 22.4L26.93 24M26.93 16L24.16 17.6M15.84 22.4L13.07 24"
            stroke="#F7F8F4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-xl font-bold tracking-tight",
            isLightText ? "text-[#F7F8F4]" : "text-foreground"
          )}
        >
          Gear<span className={isLightText ? "text-[#E5C170]" : "text-primary"}>Nest</span>
        </span>
        <span
          className={cn(
            "mt-0.5 text-[10px] font-medium tracking-[0.14em] uppercase",
            isLightText ? "text-[#C9D6D0]" : "text-muted"
          )}
        >
          Equipment Rental
        </span>
      </span>
    </Link>
  );
}
