import { ArrowLeft, Compass, FileQuestion, LayoutDashboard } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function DashboardNotFoundPage() {
  return (
    <section
      aria-labelledby="dashboard-not-found-heading"
      className="flex min-h-[75dvh] items-center py-14 sm:py-20"
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
              HTTP 404 — Dashboard Route Not Found
            </Badge>
          </div>

          <h1
            id="dashboard-not-found-heading"
            className="type-page-title mt-4 text-foreground"
          >
            Dashboard section not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            The requested dashboard section is not available. Navigate back to your verified role dashboard or explore public marketplace equipment.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button href="/dashboard" variant="primary" size="md">
              <LayoutDashboard aria-hidden="true" className="size-4" />
              <span>Open My Dashboard</span>
            </Button>
            <Button href="/equipment" variant="outline" size="md">
              <Compass aria-hidden="true" className="size-4" />
              <span>Marketplace Catalog</span>
            </Button>
            <Button href="/" variant="ghost" size="md">
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>Home</span>
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}
