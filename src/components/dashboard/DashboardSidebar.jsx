"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  CalendarClock,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Mail,
  Package,
  PlusCircle,
  ScrollText,
  Store,
  UserCircle,
  Users,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  BACK_TO_MARKETPLACE_ITEM,
  getRoleBadgeVariant,
  getRoleLabel,
  getRoleNavLinks,
  normalizeUserRole,
} from "@/lib/roleNavigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const SIDEBAR_ICONS = {
  overview: LayoutDashboard,
  rentals: ClipboardList,
  favorites: Heart,
  profile: UserCircle,
  add: PlusCircle,
  equipment: Boxes,
  users: Users,
  logs: ScrollText,
  inquiries: Mail,
  schedule: CalendarClock,
  package: Package,
  marketplace: Store,
};

export function DashboardSidebarNavList({
  role,
  onNavigate = null,
  ariaLabel = "Dashboard role navigation",
}) {
  const pathname = usePathname() || "/";
  const normalizedRole = normalizeUserRole(role);
  const items = getRoleNavLinks(normalizedRole);

  return (
    <nav aria-label={ariaLabel} className="flex flex-1 flex-col justify-between">
      <div>
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {getRoleLabel(normalizedRole)} Workspace
        </p>

        <ul className="mt-2.5 space-y-1">
          {items.map((item) => {
            const Icon = SIDEBAR_ICONS[item.icon] || LayoutDashboard;
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => onNavigate?.()}
                  className={cn(
                    "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-secondary font-semibold text-primary"
                      : "text-text-secondary hover:bg-surface-subtle hover:text-primary"
                  )}
                >
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
                    />
                  ) : null}
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      active
                        ? "text-primary"
                        : "text-muted group-hover:text-primary"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <Link
          href={BACK_TO_MARKETPLACE_ITEM.href}
          onClick={() => onNavigate?.()}
          className="flex min-h-11 items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-subtle hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Store aria-hidden="true" className="size-4 shrink-0 text-primary" />
          <span className="truncate">{BACK_TO_MARKETPLACE_ITEM.label}</span>
        </Link>
      </div>
    </nav>
  );
}

export function DashboardSidebar({ portalRole = null }) {
  const { role: authRole } = useAuth();
  const effectiveRole = normalizeUserRole(portalRole || authRole);
  const roleLabel = getRoleLabel(effectiveRole);
  const badgeVariant = getRoleBadgeVariant(effectiveRole);

  return (
    <aside
      aria-label={`${roleLabel} dashboard sidebar`}
      className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-5 lg:flex xl:w-72"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border pb-5">
        <BrandLogo tone="dark" />
      </div>

      <div className="mt-4 mb-5 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5">
        <span className="text-xs font-medium text-text-secondary">
          Verified Portal
        </span>
        <Badge variant={badgeVariant} dot size="sm">
          {roleLabel}
        </Badge>
      </div>

      <DashboardSidebarNavList
        role={effectiveRole}
        ariaLabel={`${roleLabel} sidebar navigation`}
      />
    </aside>
  );
}
