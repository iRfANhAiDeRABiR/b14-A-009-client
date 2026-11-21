"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Receipt, ShieldCheck } from "lucide-react";

const INDICATOR_ICONS = {
  "flexible-rental-periods": CalendarClock,
  "trusted-equipment-owners": ShieldCheck,
  "transparent-pricing": Receipt,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.24,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroTrustIndicators({ items }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-border pt-7 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = INDICATOR_ICONS[item.id] || ShieldCheck;

          return (
            <div key={item.id} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/75 text-primary"
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <dt className="font-heading text-sm font-semibold text-foreground">
                  {item.title}
                </dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                  {item.subtitle}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    );
  }

  return (
    <motion.dl
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="mt-10 grid grid-cols-1 gap-4 border-t border-border pt-7 sm:grid-cols-3"
    >
      {items.map((item) => {
        const Icon = INDICATOR_ICONS[item.id] || ShieldCheck;

        return (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex items-start gap-3"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/75 text-primary"
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <dt className="font-heading text-sm font-semibold text-foreground">
                {item.title}
              </dt>
              <dd className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                {item.subtitle}
              </dd>
            </div>
          </motion.div>
        );
      })}
    </motion.dl>
  );
}
