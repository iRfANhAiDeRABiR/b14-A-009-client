"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, Store, User } from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function DashboardUserAvatar({ user, sizeClass = "size-8" }) {
  if (user?.image) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={user.image}
        alt={user.name || "User profile photo"}
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

export function DashboardUserMenu() {
  const pathname = usePathname() || "/dashboard";
  const router = useRouter();
  const { showToast } = useToast();
  const { user, roleLabel, roleBadgeVariant, roleNavLinks, logout } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setOpen(false);
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
        description: "Could not complete sign out cleanly. Please refresh.",
        variant: "warning",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.name || user?.email || "Authenticated User";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="dashboard-user-dropdown"
        aria-label={`Account menu for ${displayName}`}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <DashboardUserAvatar user={user} sizeClass="size-7" />
        <span className="hidden max-w-32 truncate sm:inline">{displayName}</span>
        {roleLabel ? (
          <Badge variant={roleBadgeVariant} size="sm" className="hidden md:inline-flex">
            {roleLabel}
          </Badge>
        ) : null}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 text-muted transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div
          id="dashboard-user-dropdown"
          role="menu"
          aria-label="Dashboard user menu"
          className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-md"
        >
          <div className="border-b border-border px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName}
              </p>
              {roleLabel ? (
                <Badge variant={roleBadgeVariant} size="sm">
                  {roleLabel}
                </Badge>
              ) : null}
            </div>
            {user?.email ? (
              <p className="mt-0.5 truncate text-xs text-text-secondary">
                {user.email}
              </p>
            ) : null}
          </div>

          <div className="mt-1.5 space-y-0.5">
            {roleNavLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-9 items-center rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-secondary/70 font-semibold text-primary"
                      : "text-foreground hover:bg-surface-subtle hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-1.5 border-t border-border pt-1.5">
            <Link
              href="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Store aria-hidden="true" className="size-4" />
              <span>Back to Marketplace</span>
            </Link>
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-50"
            >
              <LogOut aria-hidden="true" className="size-4" />
              <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
