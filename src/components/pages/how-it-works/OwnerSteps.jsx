"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  FilePlus2,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const OWNER_STEPS = [
  {
    step: "01",
    title: "Get Started",
    description:
      "Get access to an Owner account to manage your equipment rental business. Public registration starts with a Customer account, while Owner access is authorized through GearNest role governance.",
    icon: UserCheck,
  },
  {
    step: "02",
    title: "List Your Equipment",
    description:
      "Add equipment information, images, category, location, rental price, available quantity and rental conditions.",
    icon: FilePlus2,
  },
  {
    step: "03",
    title: "Admin Review",
    description:
      "New equipment listings are submitted for administrative review. Approved equipment becomes eligible for public display.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Manage Your Business",
    description:
      "Monitor rental bookings, manage equipment listings and track your rental performance through the Owner Dashboard.",
    icon: BarChart3,
  },
];

export function OwnerSteps() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="owner-steps-heading"
      className="border-y border-border bg-surface py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          id="owner-steps-heading"
          eyebrow="For Equipment Owners"
          title="Have Equipment to Rent?"
          description="GearNest helps equipment owners connect their available equipment with customers who need it."
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OWNER_STEPS.map((item, idx) => {
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
                className="flex"
              >
                <Card
                  tone="background"
                  padding="md"
                  hoverable
                  className="flex h-full w-full flex-col rounded-2xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                    >
                      <Icon className="size-5" />
                    </span>

                    <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-heading text-xs font-bold text-text-secondary">
                      Step {item.step}
                    </span>
                  </div>

                  <h3 className="type-card-title mt-5 text-foreground">
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

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#245447] bg-[#193D34] p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
              Interested in Listing Your Equipment?
            </h3>
            <p className="mt-1 text-sm text-[#DCE8DF]">
              Reach out to request Owner portal onboarding or learn about listing moderation requirements.
            </p>
          </div>

          <Button href="/contact" variant="inverted" size="md" className="shrink-0">
            <span>Contact Our Team</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
