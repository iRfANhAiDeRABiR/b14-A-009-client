"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/ui/Container";

export function ContactHero() {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="border-b border-border bg-surface/50 py-12 sm:py-16"
    >
      <Container>
        <motion.div {...motionProps} className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3.5 py-1.5 text-xs font-semibold tracking-[0.1em] text-primary uppercase">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent"
            />
            WE&apos;RE HERE TO HELP
          </span>

          <h1
            id="contact-hero-heading"
            className="type-hero mt-5 text-foreground"
          >
            Let&apos;s Talk About Your Next Project.
          </h1>

          <p className="type-body mt-4 max-w-2xl text-text-secondary sm:text-lg">
            Have a question about renting equipment, listing your equipment or using GearNest? Send us a message and tell us how we can help.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
