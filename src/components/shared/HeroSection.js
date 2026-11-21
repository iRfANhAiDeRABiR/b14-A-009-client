"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";

import { SITE_CONFIG } from "@/lib/site-config";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const enterProps = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <>
      <section className="py-12 sm:py-16 lg:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <motion.div {...enterProps(0)}>
              <Badge variant="primary" dot size="md">
                Verified Equipment Rental Marketplace
              </Badge>
            </motion.div>

            <motion.h1
              {...enterProps(0.06)}
              className="type-hero mt-5 text-foreground"
            >
              Rent Pro-Grade Equipment{" "}
              <span className="text-primary">Without Ownership Overhead.</span>
            </motion.h1>

            <motion.p
              {...enterProps(0.12)}
              className="type-body mt-5 max-w-xl text-text-secondary sm:text-lg"
            >
              {SITE_CONFIG.description}
            </motion.p>

            <motion.div
              {...enterProps(0.18)}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button href="/equipment" variant="primary" size="lg">
                <span>Explore Equipment</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button href="#list-equipment" variant="outline" size="lg">
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
                  <dd className="mt-0.5 text-xs text-text-secondary">
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
                  <dd className="mt-0.5 text-xs text-text-secondary">
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
                  <dd className="mt-0.5 text-xs text-text-secondary">
                    Protected Stripe payments
                  </dd>
                </div>
              </div>
            </motion.dl>
          </div>

          <motion.div {...enterProps(0.12)} className="lg:col-span-6">
            <Card padding="sm" className="rounded-2xl shadow-md">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface-subtle">
                <Image
                  src="/images/hero-equipment.jpg"
                  alt="Curated professional rental equipment including a cinema camera rig, cordless rotary tool, laser level, and portable LED studio light"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute inset-x-2.5 bottom-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/20 bg-primary/95 px-3.5 py-2.5 text-primary-foreground backdrop-blur-sm sm:inset-x-3 sm:bottom-3 sm:px-4 sm:py-3">
                  <div>
                    <p className="type-label text-accent">
                      Ready For Dispatch
                    </p>
                    <p className="font-heading text-xs font-semibold sm:text-sm">
                      Production, Construction &amp; Field Fleet
                    </p>
                  </div>
                  <Badge
                    variant="neutral"
                    size="sm"
                    className="hidden border-white/20 bg-white/15 text-white sm:inline-flex"
                  >
                    Daily &middot; Weekly &middot; Monthly
                  </Badge>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {SITE_CONFIG.equipmentHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border bg-background px-3.5 py-3"
                  >
                    <p className="font-heading text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-primary">
                      {item.rate}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-secondary">{item.location}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>

      <section
        id="marketplace-preview"
        className="border-y border-border bg-surface py-16 sm:py-20"
      >
        <Container>
          <SectionHeading
            eyebrow="Built for Modern Rentals"
            title="Everything you need to book or supply reliable gear."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SITE_CONFIG.marketplacePillars.map((pillar, index) => (
              <Card
                key={pillar.title}
                as="article"
                tone="background"
                hoverable
                className="flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    0{index + 1}
                  </span>
                  <CardHeader className="mt-4">
                    <CardTitle>{pillar.title}</CardTitle>
                    <CardDescription>{pillar.description}</CardDescription>
                  </CardHeader>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="list-equipment" className="py-16 sm:py-20">
        <Container>
          <Card
            tone="primary"
            padding="lg"
            className="flex flex-col items-start justify-between gap-6 rounded-2xl border-primary/20 lg:flex-row lg:items-center"
          >
            <div className="max-w-2xl">
              <p className="type-label text-accent">
                For Equipment Owners
              </p>
              <h2 className="type-section-title mt-2 text-primary-foreground">
                Turn idle machines and studio gear into steady rental income.
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-secondary sm:text-base">
                Publish equipment listings with transparent terms, track booking
                requests, and get paid seamlessly after verification.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/equipment" variant="inverted" size="lg">
                <span>Explore Marketplace</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
