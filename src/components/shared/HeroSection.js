"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  PlusCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const enterProps = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <>
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/6 blur-3xl"
        />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
          <div className="lg:col-span-6">
            <motion.div
              {...enterProps(0)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary shadow-xs"
            >
              <Sparkles aria-hidden="true" className="size-3.5 text-accent-warm" />
              <span>Verified Equipment Rental Marketplace</span>
            </motion.div>

            <motion.h1
              {...enterProps(0.06)}
              className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]"
            >
              Rent Pro-Grade Equipment{" "}
              <span className="text-primary">Without Ownership Overhead.</span>
            </motion.h1>

            <motion.p
              {...enterProps(0.12)}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              {SITE_CONFIG.description}
            </motion.p>

            <motion.div
              {...enterProps(0.18)}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <Button href="#marketplace-preview" variant="primary" size="lg">
                <span>Explore Equipment</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button href="#list-equipment" variant="secondary" size="lg">
                <PlusCircle aria-hidden="true" className="size-4" />
                <span>List Your Equipment</span>
              </Button>
            </motion.div>

            <motion.dl
              {...enterProps(0.24)}
              className="mt-10 grid grid-cols-1 gap-4 border-t border-border pt-7 sm:grid-cols-3"
            >
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary"
                />
                <div>
                  <dt className="font-heading text-sm font-semibold text-foreground">
                    Verified Owners
                  </dt>
                  <dd className="mt-0.5 text-xs text-muted">
                    Admin-reviewed equipment specs
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CalendarClock
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary"
                />
                <div>
                  <dt className="font-heading text-sm font-semibold text-foreground">
                    Flexible Terms
                  </dt>
                  <dd className="mt-0.5 text-xs text-muted">
                    Daily, weekly &amp; monthly rates
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary"
                />
                <div>
                  <dt className="font-heading text-sm font-semibold text-foreground">
                    Insured Checkout
                  </dt>
                  <dd className="mt-0.5 text-xs text-muted">
                    Protected Stripe payments
                  </dd>
                </div>
              </div>
            </motion.dl>
          </div>

          <motion.div {...enterProps(0.12)} className="lg:col-span-6">
            <div className="rounded-3xl border border-border bg-surface p-3 shadow-[0_20px_50px_-15px_rgba(25,61,52,0.14)] sm:p-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-muted">
                <Image
                  src="/images/hero-equipment.jpg"
                  alt="Curated professional rental equipment including a cinema camera rig, cordless rotary tool, laser level, and portable LED studio light"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute inset-x-2.5 bottom-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/25 bg-[#122D26]/90 px-3 py-2 text-primary-foreground backdrop-blur-md sm:inset-x-3 sm:bottom-3 sm:px-4 sm:py-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-wider text-[#E5C170] uppercase sm:text-[11px]">
                      Ready For Dispatch
                    </p>
                    <p className="font-heading text-xs font-semibold sm:text-sm">
                      Production, Construction &amp; Field Fleet
                    </p>
                  </div>
                  <span className="hidden rounded-lg bg-white/15 px-2.5 py-1 font-mono text-xs font-medium sm:inline-flex">
                    Daily &middot; Weekly &middot; Monthly
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {SITE_CONFIG.equipmentHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/80 bg-background px-3.5 py-3"
                  >
                    <p className="font-heading text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-primary">
                      {item.rate}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">{item.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="marketplace-preview"
        className="border-y border-border bg-surface py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
              Built for Modern Rentals
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Everything you need to book or supply reliable gear.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SITE_CONFIG.marketplacePillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-colors duration-200 hover:border-primary/35"
              >
                <div>
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="list-equipment" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-primary/15 bg-primary px-6 py-10 text-primary-foreground sm:px-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-widest text-[#E5C170] uppercase">
                For Equipment Owners
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Turn idle machines and studio gear into steady rental income.
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#D4DFDA] sm:text-base">
                Publish equipment listings with transparent terms, track booking
                requests, and get paid seamlessly after verification.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="#marketplace-preview" variant="inverted" size="lg">
                <span>Explore Marketplace</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
