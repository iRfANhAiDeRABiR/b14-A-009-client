"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeDollarSign,
  CalendarRange,
  Lock,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const BENEFITS = [
  {
    id: "affordable-prices",
    title: "Affordable Rental Prices",
    description:
      "Rent equipment without the expense of ownership.",
    icon: BadgeDollarSign,
  },
  {
    id: "trusted-owners",
    title: "Trusted Equipment Owners",
    description:
      "Connect with equipment providers through a transparent marketplace.",
    icon: ShieldCheck,
  },
  {
    id: "flexible-periods",
    title: "Flexible Rental Periods",
    description:
      "Choose rental periods that suit your project.",
    icon: CalendarRange,
  },
  {
    id: "secure-payments",
    title: "Secure Online Payments",
    description:
      "Complete rental payments through a secure payment process.",
    icon: Lock,
  },
];

export function WhyChooseUs() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="why-choose-heading"
      className="border-y border-border bg-surface py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          headingId="why-choose-heading"
          eyebrow="Marketplace Advantage"
          title="Why Choose GearNest?"
          description="Everything you need to rent equipment with confidence."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            const motionProps = prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.15 },
                  transition: {
                    duration: 0.42,
                    delay: index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  whileHover: { y: -3 },
                };

            return (
              <motion.div key={benefit.id} {...motionProps} className="h-full">
                <Card
                  as="article"
                  tone="background"
                  className="flex h-full flex-col transition-colors duration-200 hover:border-primary/35"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"
                  >
                    <Icon className="size-5" />
                  </span>
                  <CardHeader className="mt-5">
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
