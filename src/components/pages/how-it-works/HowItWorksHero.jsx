"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const HIGHLIGHTS = [
  "Browse approved equipment across 6 dedicated rental categories",
  "Inspect transparent daily, weekly, and monthly rates up front",
  "Complete checkout securely through Stripe Hosted Checkout",
];

export function HowItWorksHero() {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="border-b border-border bg-surface/50 py-12 sm:py-16 lg:py-20"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div {...motionProps} className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3.5 py-1.5 text-xs font-semibold tracking-[0.1em] text-primary uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent"
              />
              SIMPLE RENTAL PROCESS
            </span>

            <h1
              id="how-it-works-heading"
              className="type-hero mt-5 text-foreground"
            >
              Getting the Right Equipment Has Never Been Easier.
            </h1>

            <p className="type-body mt-5 max-w-xl text-text-secondary sm:text-lg">
              From discovering the right equipment to completing your rental, GearNest makes the process simple, transparent and convenient.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-text-secondary">
              {HIGHLIGHTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/equipment" variant="primary" size="lg">
                <span>Explore Equipment</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>

              <Button href="/contact" variant="outline" size="lg">
                <Mail aria-hidden="true" className="size-4 text-primary" />
                <span>Contact Us</span>
              </Button>
            </div>
          </motion.div>

          <motion.div
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.97 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
                })}
            className="lg:col-span-6"
          >
            <div className="relative rounded-2xl border border-border bg-surface p-3 shadow-sm sm:p-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-subtle">
                <Image
                  src="/images/hero-equipment.jpg"
                  alt="Professional camera rig, rotary drill, laser level, and lighting kit prepared for rental on GearNest"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <Badge
                    variant="success"
                    dot
                    size="md"
                    className="bg-surface/95 shadow-xs backdrop-blur-xs"
                  >
                    4-Step Guided Flow
                  </Badge>
                </div>

                <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-surface/95 p-4 shadow-md backdrop-blur-sm sm:inset-x-4 sm:bottom-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="type-label text-[11px] text-primary">
                        Marketplace Workflow
                      </p>
                      <p className="mt-0.5 font-heading text-sm font-bold text-foreground sm:text-base">
                        Search &rarr; Review Terms &rarr; Book &rarr; Track Online
                      </p>
                    </div>
                    <Badge variant="primary" size="sm">
                      BDT Pricing
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
