"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function AboutHero() {
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
      aria-labelledby="about-hero-heading"
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
              ABOUT GEARNEST
            </span>

            <h1
              id="about-hero-heading"
              className="type-hero mt-5 text-foreground"
            >
              Making Equipment Rental Simpler for Everyone.
            </h1>

            <p className="type-body mt-5 max-w-xl text-text-secondary sm:text-lg">
              GearNest is an equipment rental marketplace designed to connect people who need equipment with owners who have equipment available to rent.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/equipment" variant="primary" size="lg">
                <span>Explore Our Marketplace</span>
                <ArrowRight aria-hidden="true" className="size-4" />
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
                  src="/images/hero-excavator.jpg"
                  alt="Commercial excavator ready for deployment through GearNest marketplace"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <Badge
                    variant="primary"
                    size="md"
                    className="bg-surface/95 shadow-xs backdrop-blur-xs"
                  >
                    6 Core Categories
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
