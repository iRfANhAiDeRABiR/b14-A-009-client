import { ArrowLeft, Compass } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ComingSoonPage({
  eyebrow = "Upcoming Milestone",
  title,
  description,
  primaryAction = { label: "Back to Home", href: "/" },
  secondaryAction = { label: "Explore Equipment", href: "/equipment" },
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container size="sm">
        <Card padding="lg" className="rounded-2xl">
          <Badge variant="primary" dot size="md">
            {eyebrow}
          </Badge>

          <SectionHeading
            as="h1"
            variant="page"
            title={title}
            description={description}
            className="mt-5"
          />

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
            <Button href={primaryAction.href} variant="primary" size="md">
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>{primaryAction.label}</span>
            </Button>
            {secondaryAction && secondaryAction.href !== primaryAction.href ? (
              <Button href={secondaryAction.href} variant="outline" size="md">
                <Compass aria-hidden="true" className="size-4" />
                <span>{secondaryAction.label}</span>
              </Button>
            ) : null}
          </div>
        </Card>
      </Container>
    </section>
  );
}
