"use client";

import { AlertTriangle, LayoutDashboard, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function DashboardErrorBoundary({ error, reset }) {
  return (
    <section
      role="alert"
      aria-labelledby="dashboard-error-heading"
      className="flex min-h-[75dvh] items-center py-14 sm:py-20"
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
              Dashboard Error
            </Badge>
          </div>

          <h1
            id="dashboard-error-heading"
            className="type-page-title mt-4 text-foreground"
          >
            Something interrupted this workspace view
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            {error?.message ||
              "An unexpected client error occurred while loading this dashboard view."}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="md" onClick={() => reset?.()}>
              <RefreshCw aria-hidden="true" className="size-4" />
              <span>Try Again</span>
            </Button>
            <Button href="/dashboard" variant="outline" size="md">
              <LayoutDashboard aria-hidden="true" className="size-4" />
              <span>Return to Dashboard</span>
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}
