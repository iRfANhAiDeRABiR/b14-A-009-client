"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutDashboard, LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";

import { SITE_CONFIG } from "@/lib/site-config";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Shared responsive marketplace navbar.
 * Accepts optional `auth` props for future BetterAuth integration without
 * introducing fake sessions or hardcoded user data.
 */
export function Navbar({ auth = null }) {
  const pathname = usePathname() || "/";
  const prefersReducedMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const dashboardHref = auth?.dashboardHref || SITE_CONFIG.authLinks.dashboard.href;

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

  const closeMenu = () => setMobileOpen(false);

  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm"
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <div className="flex shrink-0 items-center">
          <BrandLogo tone="dark" />
        </div>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center justify-center lg:flex"
        >
          <ul className="flex items-center gap-1 xl:gap-2">
            {SITE_CONFIG.navLinks.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-10 cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active
                        ? "bg-secondary/60 font-semibold text-primary"
                        : "text-text-secondary hover:bg-surface-subtle hover:text-primary"
                    )}
                  >
                    <span>{item.label}</span>
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-primary"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          {isAuthenticated ? (
            <>
              <Button href={dashboardHref} variant="secondary" size="md">
                <LayoutDashboard aria-hidden="true" className="size-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={auth?.onLogout}
              >
                <LogOut aria-hidden="true" className="size-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                href={SITE_CONFIG.authLinks.login.href}
                variant="ghost"
                size="md"
              >
                <LogIn aria-hidden="true" className="size-4" />
                <span>Login</span>
              </Button>
              <Button
                href={SITE_CONFIG.authLinks.register.href}
                variant="primary"
                size="md"
              >
                <UserPlus aria-hidden="true" className="size-4" />
                <span>Register</span>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          {mobileOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </Container>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.div
            id="mobile-navigation-drawer"
            initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-surface shadow-sm lg:hidden"
          >
            <Container className="py-5">
              <nav aria-label="Mobile navigation">
                <ul className="flex flex-col gap-1">
                  {SITE_CONFIG.navLinks.map((item) => {
                    const active = isActivePath(pathname, item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={closeMenu}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "bg-secondary/70 font-semibold text-primary"
                              : "text-foreground hover:bg-surface-subtle hover:text-primary"
                          )}
                        >
                          <span>{item.label}</span>
                          {active ? (
                            <span
                              aria-hidden="true"
                              className="size-2 rounded-full bg-primary"
                            />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
                {isAuthenticated ? (
                  <>
                    <Button
                      href={dashboardHref}
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={closeMenu}
                    >
                      <LayoutDashboard aria-hidden="true" className="size-4" />
                      <span>Dashboard</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={() => {
                        closeMenu();
                        auth?.onLogout?.();
                      }}
                    >
                      <LogOut aria-hidden="true" className="size-4" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      href={SITE_CONFIG.authLinks.login.href}
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={closeMenu}
                    >
                      <LogIn aria-hidden="true" className="size-4" />
                      <span>Login</span>
                    </Button>
                    <Button
                      href={SITE_CONFIG.authLinks.register.href}
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={closeMenu}
                    >
                      <UserPlus aria-hidden="true" className="size-4" />
                      <span>Register</span>
                    </Button>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
