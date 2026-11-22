"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, ClipboardList, CreditCard, Search } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CUSTOMER_STEPS = [
  {
    step: "01",
    eyebrow: "Explore Equipment",
    title: "Find What You Need",
    description:
      "Browse equipment across construction, photography, agriculture, transportation, electronics and event categories. Use search and filters to find equipment that matches your project.",
    icon: Search,
  },
  {
    step: "02",
    eyebrow: "Compare Details",
    title: "Choose the Right Equipment",
    description:
      "Review equipment images, descriptions, rental prices, availability, locations, owner information and rental terms before making your decision.",
    icon: ClipboardList,
  },
  {
    step: "03",
    eyebrow: "Book Your Rental",
    title: "Select Your Rental Period",
    description:
      "Choose your rental start date, end date and required quantity. Provide your contact information and delivery address to submit your booking.",
    icon: CalendarCheck,
  },
  {
    step: "04",
    eyebrow: "Pay and Manage",
    title: "Complete Your Payment",
    description:
      "Continue to secure Stripe Checkout. After payment is verified, monitor your booking and payment information through your Customer Dashboard.",
    icon: CreditCard,
  },
];

export function CustomerSteps() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-labelledby="customer-steps-heading" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          id="customer-steps-heading"
          eyebrow="For Renters"
          title="Rent Equipment in Four Simple Steps"
          description="Follow a structured reservation workflow from catalog discovery to verified checkout and dashboard tracking."
          align="center"
        />

        <div className="relative mt-12">
          {/* Desktop horizontal progression line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-11 right-12 left-12 hidden h-0.5 bg-border lg:block"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CUSTOMER_STEPS.map((item, idx) => {
              const Icon = item.icon;
              const motionProps = prefersReducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.15 },
                    transition: {
                      duration: 0.4,
                      delay: idx * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  };

              return (
                <motion.div
                  key={item.step}
                  {...motionProps}
                  className="relative flex"
                >
                  <Card
                    padding="md"
                    hoverable
                    className="flex h-full w-full flex-col rounded-2xl"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        aria-hidden="true"
                        className="relative z-10 flex size-12 items-center justify-center rounded-xl bg-secondary text-primary ring-4 ring-background"
                      >
                        <Icon className="size-5" />
                      </span>

                      <span className="font-heading text-xs font-bold tracking-wider text-primary uppercase">
                        Step {item.step}
                      </span>
                    </div>

                    <p className="type-label mt-5 text-[11px] text-accent">
                      {item.eyebrow}
                    </p>
                    <h3 className="type-card-title mt-1.5 text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
