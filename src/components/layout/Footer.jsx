import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/site-config";

function SocialLinks() {
  return (
    <div className="flex items-center gap-2.5">
      <Link
        href="/contact"
        aria-label="GearNest on X"
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-primary-foreground transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Link>

      <Link
        href="/about"
        aria-label="GearNest on LinkedIn"
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-primary-foreground transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </Link>

      <Link
        href="/equipment"
        aria-label="GearNest on YouTube"
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-primary-foreground transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </Link>
    </div>
  );
}

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-primary-hover bg-primary text-primary-foreground">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <BrandLogo tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-secondary">
              A transparent equipment rental marketplace connecting commercial-grade
              gear owners with crews, creators, and project teams.
            </p>
            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>

          <div className="grid gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-8">
            {SITE_CONFIG.footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="type-label text-accent">{column.title}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="inline-block cursor-pointer rounded py-0.5 text-sm text-secondary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
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

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-6 text-xs text-secondary sm:flex-row sm:items-center">
          <p>&copy; {currentYear} GearNest. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium tracking-wide text-secondary">
              GearNest Equipment Rental Platform
            </span>
            <span aria-hidden="true" className="text-white/30">
              &bull;
            </span>
            <Link
              href="/terms"
              className="cursor-pointer text-secondary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="cursor-pointer text-secondary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
