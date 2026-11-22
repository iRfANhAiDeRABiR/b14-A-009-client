import { Eye, Layers, Recycle, Unlock } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PLATFORM_VALUES = [
  {
    title: "Accessibility",
    description:
      "Helping customers discover equipment without the need to purchase everything they use.",
    icon: Unlock,
    tone: "bg-secondary text-primary",
  },
  {
    title: "Transparency",
    description:
      "Making equipment information, rental prices and rental conditions easier to understand.",
    icon: Eye,
    tone: "bg-warning-bg text-warning",
  },
  {
    title: "Convenience",
    description:
      "Bringing equipment discovery, booking and rental management together.",
    icon: Layers,
    tone: "bg-success-bg text-success",
  },
  {
    title: "Responsible Sharing",
    description:
      "Encouraging more productive use of equipment through rental opportunities.",
    icon: Recycle,
    tone: "bg-surface-subtle text-foreground",
  },
];

export function OurValues() {
  return (
    <section
      aria-labelledby="our-values-heading"
      className="border-t border-border bg-surface py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          id="our-values-heading"
          eyebrow="Core Principles"
          title="What Guides GearNest"
          description="Clear principles shaping how renters and equipment owners interact across the platform."
          align="center"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                tone="background"
                padding="md"
                hoverable
                className="flex h-full flex-col rounded-2xl"
              >
                <span
                  aria-hidden="true"
                  className={`flex size-12 items-center justify-center rounded-xl ${value.tone}`}
                >
                  <Icon className="size-5" />
                </span>

                <h3 className="type-card-title mt-5 text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-text-secondary">
                  {value.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
