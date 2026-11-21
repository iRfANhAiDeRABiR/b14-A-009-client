import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";

const FOOTER_COLUMNS = [
  {
    title: "Marketplace",
    links: [
      { label: "Explore Equipment", href: "#marketplace-preview" },
      { label: "List Your Equipment", href: "#list-equipment" },
      { label: "How GearNest Works", href: "#marketplace-preview" },
    ],
  },
  {
    title: "Equipment Categories",
    links: [
      { label: "Construction & Power", href: "#marketplace-preview" },
      { label: "Cinema & Photography", href: "#marketplace-preview" },
      { label: "Vehicles & Field Gear", href: "#marketplace-preview" },
    ],
  },
  {
    title: "Platform Trust",
    links: [
      { label: "Verified Equipment Owners", href: "#marketplace-preview" },
      { label: "Stripe Protected Checkout", href: "#marketplace-preview" },
      { label: "Flexible Rental Terms", href: "#list-equipment" },
    ],
  },
];

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-[#14322B] bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandLogo tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#D4DFDA]">
              A transparent equipment rental marketplace connecting commercial-grade
              gear owners with crews, creators, and project teams.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#top"
                aria-label="GearNest on X"
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-primary-foreground transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h2 className="font-heading text-sm font-semibold tracking-wider text-[#E5C170] uppercase">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="cursor-pointer rounded text-sm text-[#D4DFDA] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-6 text-xs text-[#C5D3CD] sm:flex-row sm:items-center">
          <p>&copy; {currentYear} GearNest Equipment Rental Platform. All rights reserved.</p>
          <p className="font-mono tracking-wide text-[#D4DFDA]">
            Forest-Grade Reliability &middot; Verified Rentals
          </p>
        </div>
      </div>
    </footer>
  );
}
