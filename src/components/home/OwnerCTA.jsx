"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const OWNER_POINTS = [
  "Publish specs, daily/weekly/monthly pricing, and quantity",
  "Track customer bookings and rental schedules in one view",
];

export function OwnerCTA() {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section
      aria-labelledby="owner-cta-heading"
      className="pb-16 pt-4 sm:pb-20"
    >
      <Container>
        <motion.div
          {...motionProps}
          className="relative overflow-hidden rounded-2xl border border-primary-hover bg-primary text-primary-foreground shadow-md"
        >
          {/* Subtle architectural accent geometry */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-14 left-12 size-44 rounded-2xl border border-white/10"
          />

          <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-12">
            <div className="lg:col-span-7">
              <p className="type-label text-accent">
                For Equipment Owners
              </p>
              <h2
                id="owner-cta-heading"
                className="type-section-title mt-3 text-white"
              >
                Have Equipment to Rent?
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-secondary">
                Turn unused equipment into an opportunity. List your equipment and
                connect with people who need it.
              </p>

              <ul className="mt-5 flex flex-col gap-2.5 text-sm text-secondary">
                {OWNER_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-accent"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/register" variant="inverted" size="lg">
                  <span>Start Listing</span>
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
                <Button
                  href="/how-it-works"
                  variant="ghost"
                  size="lg"
                  className="border border-white/25 text-white hover:bg-white/10"
                >
                  <span>Learn How It Works</span>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/15 bg-primary-hover shadow-sm">
                <Image
                  src="/images/hero-equipment.jpg"
                  alt="Professional camera rig, rotary drill, laser level, and LED lighting ready to list on GearNest"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
