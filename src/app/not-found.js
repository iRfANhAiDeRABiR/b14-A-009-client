import { ArrowLeft, Compass, FileQuestion, LayoutDashboard } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function GlobalNotFoundPage() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="flex min-h-[70dvh] items-center py-16 sm:py-24"
    >
      <Container size="sm">
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <FileQuestion className="size-7" />
          </span>

          <div className="mt-5 flex justify-center">
            <Badge variant="neutral" size="sm">
              HTTP 404 — Page Not Found
            </Badge>
          </div>

          <h1
            id="not-found-heading"
            className="type-page-title mt-4 text-foreground"
          >
            We couldn&apos;t find that page
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            The GearNest route or resource you requested does not exist or may have moved.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button href="/" variant="primary" size="md">
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>Back to Home</span>
            </Button>
            <Button href="/equipment" variant="outline" size="md">
              <Compass aria-hidden="true" className="size-4" />
              <span>Browse Equipment</span>
            </Button>
            <Button href="/dashboard" variant="ghost" size="md">
              <LayoutDashboard aria-hidden="true" className="size-4" />
              <span>Dashboard</span>
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}
