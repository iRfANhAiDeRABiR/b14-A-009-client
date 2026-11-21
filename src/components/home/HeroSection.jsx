"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PlusCircle } from "lucide-react";

import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroTrustIndicators } from "@/components/home/HeroTrustIndicators";
import { HeroVisual } from "@/components/home/HeroVisual";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { hero } = SITE_CONFIG;

  const fadeUp = (delay = 0, distance = 16) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] },
        };

  const fadeIn = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden py-10 sm:py-14 lg:py-20"
    >
      <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div className="lg:col-span-6">
          <motion.div {...fadeIn(0.04)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/65 px-3.5 py-1.5 text-xs font-semibold tracking-[0.1em] text-primary uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent"
              />
              {hero.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            {...fadeUp(0.1, 18)}
            className="type-hero mt-5 text-foreground"
          >
            <span className="block">{hero.headlineTop}</span>
            <span className="mt-1 block text-primary">
              {hero.headlineAccent}
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.18, 10)}
            className="type-body mt-5 max-w-xl text-text-secondary sm:text-lg"
          >
            {hero.description}
          </motion.p>

          <motion.div
            {...fadeUp(0.24, 10)}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              href={hero.primaryCta.href}
              variant="primary"
              size="lg"
              aria-label="Explore Equipment marketplace catalog"
            >
              <span>{hero.primaryCta.label}</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>

            <Button
              href={hero.secondaryCta.href}
              variant="outline"
              size="lg"
              aria-label="List Your Equipment by registering an owner account"
            >
              <PlusCircle aria-hidden="true" className="size-4 text-primary" />
              <span>{hero.secondaryCta.label}</span>
            </Button>
          </motion.div>

          <HeroTrustIndicators items={hero.trustIndicators} />
        </div>

        <div className="lg:col-span-6">
          <HeroVisual visual={hero.visual} />
        </div>
      </Container>
    </section>
  );
}
