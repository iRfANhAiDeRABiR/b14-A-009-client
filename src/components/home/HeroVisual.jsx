"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, CheckCircle2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/Badge";

export function HeroVisual({ visual }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
      {/* Subtle geometric architectural backdrop shapes */}
      <motion.div
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, y: [0, 8, 0], x: [0, -4, 0] }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 },
                y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 9, repeat: Infinity, ease: "easeInOut" },
              }
        }
        className="pointer-events-none absolute -top-4 -right-2 -z-10 h-56 w-56 rounded-2xl bg-secondary/80 sm:-top-6 sm:-right-4 sm:h-72 sm:w-72"
      />

      <motion.div
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: [0, -7, 0] }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                opacity: { duration: 0.6, delay: 0.15 },
                y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              }
        }
        className="pointer-events-none absolute -bottom-4 left-2 -z-10 h-32 w-48 rounded-2xl border border-primary/15 bg-primary/5 sm:-bottom-5 sm:-left-4 sm:h-40 sm:w-64"
      />

      {/* Framed primary equipment photograph */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-border bg-surface p-2.5 shadow-md sm:p-3.5"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-subtle">
          <Image
            src={visual.imageSrc}
            alt={visual.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          {/* Subtle gradient scrim only along the lower edge for card contrast */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#18221E]/45 via-[#18221E]/10 to-transparent"
          />

          {/* Top-left compact availability status badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <Badge
              variant="success"
              dot
              size="md"
              className="bg-surface/95 shadow-xs backdrop-blur-xs"
            >
              {visual.availabilityLabel}
            </Badge>
          </div>

          {/* Floating rental summary card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: [0, -5, 0] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.5, delay: 0.28 },
                    y: {
                      delay: 0.6,
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
            className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-surface/95 p-3.5 shadow-md backdrop-blur-sm sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[290px] sm:p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="type-label text-[11px] text-primary">
                  {visual.cardCategory}
                </p>
                <p className="mt-0.5 truncate font-heading text-sm font-bold text-foreground sm:text-base">
                  {visual.cardTitle}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-heading text-base font-bold text-primary tabular-nums sm:text-lg">
                  {visual.cardRate}
                </p>
                <p className="text-[11px] font-medium text-text-secondary">
                  {visual.cardUnit}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 text-[11px] text-text-secondary">
              <span className="inline-flex items-center gap-1 font-medium">
                <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
                {visual.cardMeta}
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-success">
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
                {visual.cardLocation}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Minimal bottom caption bar inside the frame */}
        <div className="mt-2.5 flex items-center justify-between gap-2 px-1.5 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <MapPin aria-hidden="true" className="size-3.5 text-primary" />
            <span>Verified Owner Dispatch</span>
          </span>
          <span className="font-medium text-primary">Inspected &amp; Insured</span>
        </div>
      </motion.div>
    </div>
  );
}
