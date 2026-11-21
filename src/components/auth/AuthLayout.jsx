"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const TRUST_HIGHLIGHTS = [
  "Verified local equipment owners across 6 commercial and field categories.",
  "Transparent daily, weekly, and monthly rates calculated before checkout.",
  "Role-protected Customer, Owner, and Admin workspaces with HTTP-only session security.",
];

export function AuthLayout({
  eyebrow,
  title,
  description,
  asideTitle,
  asideDescription,
  children,
  className,
}) {
  const prefersReducedMotion = useReducedMotion();

  const cardMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section className={cn("py-8 sm:py-12 lg:py-16", className)}>
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span>Back to marketplace</span>
          </Link>
        </div>

        <motion.div
          {...cardMotionProps}
          className="grid overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:grid-cols-12"
        >
          {/* Left Editorial Brand Showcase */}
          <aside className="relative flex flex-col justify-between bg-primary p-6 text-primary-foreground sm:p-8 lg:col-span-5 lg:p-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-secondary">
                <ShieldCheck aria-hidden="true" className="size-3.5 text-accent" />
                <span>{eyebrow}</span>
              </span>

              <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {asideTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-secondary/90">
                {asideDescription}
              </p>

              <ul className="mt-7 hidden space-y-3.5 border-t border-white/15 pt-6 lg:block">
                {TRUST_HIGHLIGHTS.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-white/90"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-accent"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 hidden items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-secondary lg:flex">
              <Lock aria-hidden="true" className="size-4 shrink-0 text-accent" />
              <span>
                Session cookies & short-lived JWT credentials keep every booking and inventory action protected.
              </span>
            </div>
          </aside>

          {/* Right Form Container */}
          <div className="p-6 sm:p-8 lg:col-span-7 lg:p-10 xl:p-12">
            <div className="mx-auto w-full max-w-md">
              <header className="mb-7">
                <h1 className="type-page-title text-foreground">{title}</h1>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {description}
                </p>
              </header>

              {children}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
