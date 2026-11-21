"use client";

import { ArrowLeft, LayoutDashboard, ShieldAlert } from "lucide-react";
import { getRoleBadgeVariant, getRoleLabel } from "@/lib/roleNavigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function Unauthorized403State({
  currentRole,
  allowedRoles = [],
  dashboardHref = "/dashboard",
  onLogout = null,
}) {
  const currentRoleLabel = getRoleLabel(currentRole);
  const currentBadgeVariant = getRoleBadgeVariant(currentRole);
  const allowedText =
    Array.isArray(allowedRoles) && allowedRoles.length > 0
      ? allowedRoles.map((role) => getRoleLabel(role)).join(", ")
      : "Authorized";

  return (
    <section
      aria-labelledby="forbidden-heading"
      className="flex min-h-[75dvh] items-center py-12 sm:py-20"
    >
      <Container size="sm">
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl border border-danger-border bg-danger-bg text-danger"
          >
            <ShieldAlert className="size-7" />
          </span>

          <div className="mt-5 flex items-center justify-center gap-2">
            <Badge variant="danger" size="sm">
              HTTP 403 — Forbidden
            </Badge>
            <Badge variant={currentBadgeVariant} dot size="sm">
              Active Role: {currentRoleLabel}
            </Badge>
          </div>

          <h1
            id="forbidden-heading"
            className="type-page-title mt-4 text-foreground"
          >
            Access restricted to {allowedText} accounts
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            You are signed in as{" "}
            <span className="font-semibold text-foreground">
              {currentRoleLabel}
            </span>
            , so this dashboard section is outside your permitted workspace. Use your role dashboard or return to the GearNest marketplace.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button href={dashboardHref} variant="primary" size="md">
              <LayoutDashboard aria-hidden="true" className="size-4" />
              <span>Go to {currentRoleLabel} Dashboard</span>
            </Button>
            <Button href="/" variant="outline" size="md">
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>Back to Marketplace</span>
            </Button>
            {typeof onLogout === "function" ? (
              <Button variant="ghost" size="md" onClick={onLogout}>
                <span>Switch Account</span>
              </Button>
            ) : null}
          </div>
        </Card>
      </Container>
    </section>
  );
}
