"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, ShieldCheck } from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { getRoleLabel, normalizeUserRole } from "@/lib/roleNavigation";
import { DashboardBreadcrumbs } from "@/components/dashboard/DashboardBreadcrumbs";
import { DashboardUserMenu } from "@/components/dashboard/DashboardUserMenu";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/Button";

export function DashboardHeader({
  onOpenMobileNav,
  mobileNavOpen = false,
  portalRole = null,
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const { role: authRole, logout } = useAuth();

  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const notifRef = React.useRef(null);

  const effectiveRole = normalizeUserRole(portalRole || authRole);
  const roleLabel = getRoleLabel(effectiveRole);

  React.useEffect(() => {
    if (!notificationsOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    };

    const handlePointerDown = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [notificationsOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logout();
      showToast({
        title: "Signed out",
        description: "You have been logged out of GearNest.",
        variant: "neutral",
      });
      router.replace("/");
    } catch {
      showToast({
        title: "Logout issue",
        description: "Unable to complete sign out cleanly.",
        variant: "warning",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur-sm sm:h-20 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-mobile-drawer"
          aria-label="Open dashboard menu"
          onClick={onOpenMobileNav}
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>

        <DashboardBreadcrumbs />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle compact />
        {/* Notification area */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-expanded={notificationsOpen}
            aria-controls="dashboard-notifications-panel"
            aria-label="Dashboard notifications"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell aria-hidden="true" className="size-4" />
          </button>

          {notificationsOpen ? (
            <div
              id="dashboard-notifications-panel"
              role="region"
              aria-label="Notifications"
              className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Notifications
              </p>
              <div className="mt-2.5 flex items-start gap-2.5 rounded-lg border border-border bg-background p-3">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                <div className="text-xs leading-relaxed text-text-secondary">
                  <p className="font-semibold text-foreground">
                    {roleLabel} Session Protected
                  </p>
                  <p className="mt-0.5">
                    Real-time rental and moderation alerts will connect here once dashboard endpoints are enabled.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <DashboardUserMenu />

        <Button
          variant="outline"
          size="sm"
          loading={isLoggingOut}
          onClick={handleLogout}
          className="hidden sm:inline-flex"
        >
          {!isLoggingOut ? (
            <LogOut aria-hidden="true" className="size-4" />
          ) : null}
          <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
        </Button>
      </div>
    </header>
  );
}
