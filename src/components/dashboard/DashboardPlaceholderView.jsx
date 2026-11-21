"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Compass, ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  getRoleBadgeVariant,
  getRoleLabel,
  getRoleNavLinks,
  normalizeUserRole,
} from "@/lib/roleNavigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function DashboardPlaceholderView({
  portalRole,
  title,
  description,
  milestoneNote,
  showQuickNavigation = false,
}) {
  const pathname = usePathname() || "/";
  const { user, role } = useAuth();

  const effectiveRole = normalizeUserRole(portalRole || role);
  const roleLabel = getRoleLabel(effectiveRole);
  const roleBadgeVariant = getRoleBadgeVariant(effectiveRole);
  const roleLinks = getRoleNavLinks(effectiveRole);

  return (
    <div className="space-y-6">
      <Card padding="lg" className="rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={roleBadgeVariant} dot size="md">
              {roleLabel} Portal
            </Badge>
            <Badge variant="neutral" size="sm">
              Protected Route
            </Badge>
          </div>

          <Button href="/equipment" variant="outline" size="sm">
            <Compass aria-hidden="true" className="size-4" />
            <span>Explore Equipment</span>
          </Button>
        </div>

        <h1 className="type-page-title mt-5 text-foreground">{title}</h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-xs sm:text-sm">
          <ShieldCheck
            aria-hidden="true"
            className="size-4 shrink-0 text-primary"
          />
          <span className="text-text-secondary">
            Verified session:{" "}
            <strong className="font-semibold text-foreground">
              {user?.name || user?.email || "Authenticated Account"}
            </strong>{" "}
            ({roleLabel}) on <code className="font-mono text-xs">{pathname}</code>
          </span>
        </div>

        {milestoneNote ? (
          <p className="mt-4 text-xs leading-relaxed text-text-secondary">
            {milestoneNote}
          </p>
        ) : null}
      </Card>

      {showQuickNavigation ? (
        <section aria-labelledby="quick-workspace-links">
          <h2
            id="quick-workspace-links"
            className="type-card-title mb-3 text-foreground"
          >
            {roleLabel} Modules
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {roleLinks.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex flex-col justify-between rounded-xl border bg-surface p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary/40 bg-secondary/35"
                      : "border-border hover:border-primary/40 hover:bg-surface-subtle"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading text-base font-semibold text-foreground">
                        {item.label}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
