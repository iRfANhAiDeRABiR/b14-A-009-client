"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogOut, X } from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import {
  getRoleBadgeVariant,
  getRoleLabel,
  normalizeUserRole,
} from "@/lib/roleNavigation";
import { DashboardSidebarNavList } from "@/components/dashboard/DashboardSidebar";
import { DashboardUserAvatar } from "@/components/dashboard/DashboardUserMenu";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function DashboardMobileNav({
  isOpen,
  onClose,
  portalRole = null,
}) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { showToast } = useToast();
  const { user, role: authRole, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const effectiveRole = normalizeUserRole(portalRole || authRole);
  const roleLabel = getRoleLabel(effectiveRole);
  const badgeVariant = getRoleBadgeVariant(effectiveRole);

  React.useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    onClose();

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
        description: "Could not complete sign out cleanly.",
        variant: "warning",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          id="dashboard-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={`${roleLabel} mobile navigation`}
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-[#18221E]/55 backdrop-blur-xs"
          />

          <motion.aside
            initial={prefersReducedMotion ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: "-100%" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-dvh w-72 max-w-[85vw] flex-col border-r border-border bg-surface px-4 py-5 shadow-md"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
              <BrandLogo tone="dark" />
              <button
                type="button"
                aria-label="Close dashboard navigation"
                onClick={onClose}
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="mt-4 mb-5 flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <DashboardUserAvatar user={user} sizeClass="size-8" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {user?.name || user?.email || "Authenticated User"}
                  </p>
                  {user?.email ? (
                    <p className="truncate text-[11px] text-text-secondary">
                      {user.email}
                    </p>
                  ) : null}
                </div>
              </div>
              <Badge variant={badgeVariant} size="sm">
                {roleLabel}
              </Badge>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
              <DashboardSidebarNavList
                role={effectiveRole}
                onNavigate={onClose}
                ariaLabel={`${roleLabel} mobile navigation links`}
              />
            </div>

            <div className="mt-4 pt-2">
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
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
