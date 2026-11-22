"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { AuthContext } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastContext";
import {
  getDashboardHomeByRole,
  getRoleBadgeVariant,
  getRoleLabel,
  getRoleNavLinks,
  normalizeUserRole,
} from "@/lib/roleNavigation";
import { SITE_CONFIG } from "@/lib/site-config";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function UserAvatar({ user, sizeClass = "size-8" }) {
  if (user?.image) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={user.image}
        alt={user.name || "User avatar"}
        className={cn(
          "shrink-0 rounded-full border border-border bg-surface-subtle object-cover",
          sizeClass
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
        sizeClass
      )}
    >
      <User className="size-4" />
    </span>
  );
}

/**
 * Shared responsive marketplace navbar connected to live Better Auth session
 * state via AuthContext, with optional `auth` override for isolated renders.
 */
export function Navbar({ auth: authOverride = null }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { showToast } = useToast();
  const contextAuth = React.useContext(AuthContext);

  const auth = authOverride || contextAuth;
  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const isSessionLoading = Boolean(auth?.isLoading) && !authOverride;
  const user = auth?.user || null;
  const normalizedRole = user ? normalizeUserRole(auth?.role || user.role) : null;
  const roleLabel =
    auth?.roleLabel || (normalizedRole ? getRoleLabel(normalizedRole) : null);
  const roleBadgeVariant =
    auth?.roleBadgeVariant ||
    (normalizedRole ? getRoleBadgeVariant(normalizedRole) : "primary");
  const dashboardHref =
    auth?.dashboardHref ||
    (normalizedRole
      ? getDashboardHomeByRole(normalizedRole)
      : SITE_CONFIG.authLinks.dashboard.href);
  const roleNavLinks =
    auth?.roleNavLinks ||
    (normalizedRole ? getRoleNavLinks(normalizedRole) : []);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const accountMenuRef = React.useRef(null);

  React.useEffect(() => {
    if (!mobileOpen && !accountMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setAccountMenuOpen(false);
      }
    };

    const handlePointerDown = (event) => {
      if (
        accountMenuOpen &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [accountMenuOpen, mobileOpen]);

  const closeMenu = () => setMobileOpen(false);
  const closeAccountMenu = () => setAccountMenuOpen(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    closeMenu();
    closeAccountMenu();

    try {
      if (typeof auth?.onLogout === "function") {
        await auth.onLogout();
      } else if (typeof auth?.logout === "function") {
        await auth.logout();
      }
      showToast({
        title: "Signed out",
        description: "Your GearNest session has ended cleanly.",
        variant: "neutral",
      });
      router.replace("/");
    } catch {
      showToast({
        title: "Logout issue",
        description: "Unable to complete sign out cleanly. Please refresh.",
        variant: "warning",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.name || user?.email || "Account";

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
          <ThemeToggle compact />
          {isSessionLoading ? (
            <div className="flex items-center gap-2" aria-hidden="true">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          ) : isAuthenticated ? (
            <>
              {/* Account & Role Portal Dropdown */}
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  aria-expanded={accountMenuOpen}
                  aria-controls="navbar-role-menu"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <UserAvatar user={user} sizeClass="size-7" />
                  <span className="max-w-28 truncate">{displayName}</span>
                  {roleLabel ? (
                    <Badge variant={roleBadgeVariant} size="sm">
                      {roleLabel}
                    </Badge>
                  ) : null}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-4 text-muted transition-transform duration-150",
                      accountMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {accountMenuOpen ? (
                  <div
                    id="navbar-role-menu"
                    role="menu"
                    aria-label="Account role menu"
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-md"
                  >
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {displayName}
                      </p>
                      {user?.email ? (
                        <p className="truncate text-xs text-text-secondary">
                          {user.email}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                      {roleNavLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            role="menuitem"
                            onClick={closeAccountMenu}
                            className={cn(
                              "flex min-h-9 items-center rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              active
                                ? "bg-secondary/70 font-semibold text-primary"
                                : "text-foreground hover:bg-surface-subtle hover:text-primary"
                            )}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              <Button href={dashboardHref} variant="secondary" size="md">
                <LayoutDashboard aria-hidden="true" className="size-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant="outline"
                size="md"
                loading={isLoggingOut}
                onClick={handleLogout}
              >
                {!isLoggingOut ? (
                  <LogOut aria-hidden="true" className="size-4" />
                ) : null}
                <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
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

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle compact />
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
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
              {isAuthenticated ? (
                <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3.5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar user={user} sizeClass="size-10" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {displayName}
                      </p>
                      {user?.email ? (
                        <p className="truncate text-xs text-text-secondary">
                          {user.email}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {roleLabel ? (
                    <Badge variant={roleBadgeVariant} size="sm">
                      {roleLabel}
                    </Badge>
                  ) : null}
                </div>
              ) : null}

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

                {isAuthenticated && roleNavLinks.length > 0 ? (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="px-3.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {roleLabel} Workspace
                    </p>
                    <ul className="mt-2 flex flex-col gap-1">
                      {roleNavLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={closeMenu}
                              className={cn(
                                "flex min-h-10 cursor-pointer items-center rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                active
                                  ? "bg-secondary/70 font-semibold text-primary"
                                  : "text-text-secondary hover:bg-surface-subtle hover:text-primary"
                              )}
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </nav>

              <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
                {isSessionLoading ? (
                  <Skeleton className="h-11 w-full rounded-lg" />
                ) : isAuthenticated ? (
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
                      loading={isLoggingOut}
                      onClick={handleLogout}
                    >
                      {!isLoggingOut ? (
                        <LogOut aria-hidden="true" className="size-4" />
                      ) : null}
                      <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
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
