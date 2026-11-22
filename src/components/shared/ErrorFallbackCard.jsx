"use client";

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function ErrorFallbackCard({
  badge = "Unexpected Error",
  title = "Something went wrong",
  description = "We encountered an unexpected issue while rendering this page. You can retry loading or return to GearNest home.",
  digest = "",
  onRetry = null,
  secondaryHref = "/",
  secondaryLabel = "Back to Home",
}) {
  return (
    <section
      role="alert"
      aria-labelledby="route-error-heading"
      className="flex min-h-[70dvh] items-center py-16 sm:py-24"
    >
      <Container size="sm">
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl border border-danger-border bg-danger-bg text-danger"
          >
            <AlertTriangle className="size-7" />
          </span>

          <div className="mt-5 flex justify-center">
            <Badge variant="danger" size="sm">
              {badge}
            </Badge>
          </div>

          <h1
            id="route-error-heading"
            className="type-page-title mt-4 text-foreground"
          >
            {title}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            {description}
          </p>

          {digest ? (
            <p className="mt-3 font-mono text-xs text-muted">
              Reference: {digest}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {typeof onRetry === "function" ? (
              <Button variant="primary" size="md" onClick={onRetry}>
                <RefreshCw aria-hidden="true" className="size-4" />
                <span>Try Again</span>
              </Button>
            ) : null}
            <Button href={secondaryHref} variant="outline" size="md">
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>{secondaryLabel}</span>
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}
