import { Compass, Target } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function MissionVision() {
  return (
    <section
      aria-labelledby="mission-vision-heading"
      className="border-y border-border bg-surface py-16 sm:py-20"
    >
      <Container>
        <div className="sr-only">
          <h2 id="mission-vision-heading">Mission and Vision</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            tone="background"
            padding="lg"
            className="flex h-full flex-col rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
              >
                <Target className="size-6" />
              </span>
              <div>
                <p className="type-label text-primary">Our Mission</p>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Accessible Rental Access
                </h3>
              </div>
            </div>

            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              To make equipment rental more accessible by connecting customers and equipment owners through a convenient, transparent and organized marketplace.
            </p>
          </Card>

          <Card
            tone="subtle"
            padding="lg"
            className="flex h-full flex-col rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"
              >
                <Compass className="size-6" />
              </span>
              <div>
                <p className="type-label text-accent">Our Vision</p>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Trusted Marketplace Network
                </h3>
              </div>
            </div>

            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              To become a trusted platform where people and businesses can discover, rent and share equipment for projects of different sizes.
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
