"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, User } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  getRoleBadgeVariant,
  getRoleLabel,
  getRoleNavLinks,
} from "@/lib/roleNavigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function RoleDashboardPortal({ portalRole, activePath = "" }) {
  const { user, role } = useAuth();
  const effectiveRole = portalRole || role || "customer";
  const roleLabel = getRoleLabel(effectiveRole);
  const roleBadgeVariant = getRoleBadgeVariant(effectiveRole);
  const navLinks = getRoleNavLinks(effectiveRole);
  const activeItem =
    navLinks.find((link) => link.href === activePath) || navLinks[0];

  return (
    <section className="py-10 sm:py-14">
      <Container size="md">
        <Card padding="lg" className="rounded-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-3.5">
              {user?.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.image}
                  alt={user.name || "User avatar"}
                  className="size-12 shrink-0 rounded-full border border-border bg-surface-subtle object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <User className="size-5" />
                </span>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                    {activeItem?.label || `${roleLabel} Dashboard`}
                  </h1>
                  <Badge variant={roleBadgeVariant} dot size="sm">
                    {roleLabel}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  Signed in as{" "}
                  <span className="font-medium text-foreground">
                    {user?.name || user?.email || "Authenticated User"}
                  </span>
                  {user?.email ? ` (${user.email})` : ""}
                </p>
              </div>
            </div>

            <Button href="/equipment" variant="outline" size="sm">
              <span>Browse Equipment</span>
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Button>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <LayoutDashboard aria-hidden="true" className="size-3.5 text-primary" />
              <span>{roleLabel} Workspace Navigation</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {navLinks.map((item) => {
                const isCurrent = item.href === activeItem?.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isCurrent
                        ? "border-primary/40 bg-secondary/40"
                        : "border-border bg-background hover:border-primary/30 hover:bg-surface-subtle"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading text-sm font-semibold text-foreground">
                        {item.label}
                      </span>
                      {isCurrent ? (
                        <Badge variant="primary" size="sm">
                          Current View
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background px-4 py-3 text-xs leading-relaxed text-text-secondary">
            Role access control and session verification are active on this route.
            Dedicated {roleLabel.toLowerCase()} workflows and tables will be completed in the upcoming dashboard milestones.
          </div>
        </Card>
      </Container>
    </section>
  );
}
