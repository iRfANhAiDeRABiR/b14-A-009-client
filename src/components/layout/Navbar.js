"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { SITE_CONFIG } from "@/lib/site-config";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo tone="dark" />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          <ul className="flex items-center gap-6">
            {SITE_CONFIG.navLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="cursor-pointer whitespace-nowrap rounded-md px-1.5 py-1 text-sm font-medium text-muted transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="#list-equipment" variant="secondary" size="md">
            List Your Equipment
          </Button>
          <Button href="#marketplace-preview" variant="primary" size="md">
            Explore Equipment
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
          className={cn(
            "inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          )}
        >
          {mobileOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-border bg-surface px-4 py-5 shadow-lg lg:hidden"
        >
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1">
              {SITE_CONFIG.navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 cursor-pointer items-center rounded-lg px-3 text-base font-medium text-foreground transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
            <Button
              href="#marketplace-preview"
              variant="primary"
              size="md"
              onClick={() => setMobileOpen(false)}
              className="w-full"
            >
              Explore Equipment
            </Button>
            <Button
              href="#list-equipment"
              variant="secondary"
              size="md"
              onClick={() => setMobileOpen(false)}
              className="w-full"
            >
              List Your Equipment
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
