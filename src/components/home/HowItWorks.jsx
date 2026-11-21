"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarCheck2, CreditCard, Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    step: "STEP 01",
    title: "Discover",
    description: "Browse equipment and find what your project requires.",
    icon: Search,
  },
  {
    step: "STEP 02",
    title: "Book",
    description: "Choose rental dates, quantity and delivery information.",
    icon: CalendarCheck2,
  },
  {
    step: "STEP 03",
    title: "Pay & Get Started",
    description: "Complete secure payment and arrange your rental.",
    icon: CreditCard,
  },
];

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-labelledby="how-it-works-heading" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          headingId="how-it-works-heading"
          eyebrow="Simple Rental Workflow"
          title="Rent Equipment in Three Simple Steps"
          description="Go from search to confirmed equipment booking in minutes."
          actions={
            <Button href="/equipment" variant="primary" size="md">
              <span>Explore Equipment</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          }
        />

        <div className="relative mt-12">
          {/* Desktop horizontal connector */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-11 right-16 left-16 hidden h-px bg-border lg:block"
          />

          <ol className="relative grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              const motionProps = prefersReducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 18 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.15 },
                    transition: {
                      duration: 0.44,
                      delay: index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  };

              return (
                <motion.li
                  key={item.step}
                  {...motionProps}
                  className="relative flex gap-4 lg:block"
                >
                  {/* Mobile/tablet vertical timeline indicator */}
                  <div className="flex flex-col items-center lg:hidden">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs"
                    >
                      <Icon className="size-4" />
                    </span>
                    {index < STEPS.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="mt-2 h-full w-px bg-border"
                      />
                    ) : null}
                  </div>

                  <Card className="flex-1 transition-colors duration-200 hover:border-primary/35">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        aria-hidden="true"
                        className="hidden size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs lg:inline-flex"
                      >
                        <Icon className="size-5" />
                      </span>
                      <span className="type-label rounded-md bg-secondary px-2.5 py-1 text-primary">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="type-card-title mt-4 text-foreground lg:mt-5">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                  </Card>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
