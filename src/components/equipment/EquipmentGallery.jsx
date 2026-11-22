"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export function EquipmentGallery({
  images = [],
  name = "Equipment",
  alt,
  className = "",
}) {
  const safeImages =
    Array.isArray(images) && images.length > 0
      ? images
      : ["/images/hero-equipment.jpg"];

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [failedSrcs, setFailedSrcs] = React.useState(() => new Set());
  const prefersReducedMotion = useReducedMotion();

  const activeIndex = selectedIndex < safeImages.length ? selectedIndex : 0;
  const rawActiveSrc = safeImages[activeIndex];
  const activeSrc = failedSrcs.has(rawActiveSrc)
    ? "/images/hero-equipment.jpg"
    : rawActiveSrc;

  const markImageFailed = React.useCallback((src) => {
    if (!src || src === "/images/hero-equipment.jpg") return;
    setFailedSrcs((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  return (
    <Card padding="sm" className={cn("flex h-full flex-col rounded-2xl", className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-subtle lg:flex-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSrc}
            initial={prefersReducedMotion ? false : { opacity: 0.35 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.35 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full"
          >
            <Image
              src={activeSrc}
              alt={alt || `${name} photo ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="object-cover"
              onError={() => markImageFailed(rawActiveSrc)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {safeImages.length > 1 ? (
        <div
          role="group"
          aria-label="Equipment image thumbnails"
          className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4"
        >
          {safeImages.map((src, index) => {
            const isActive = index === activeIndex;
            const thumbSrc = failedSrcs.has(src)
              ? "/images/hero-equipment.jpg"
              : src;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1} of ${safeImages.length} for ${name}`}
                aria-pressed={isActive}
                className={cn(
                  "relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border-2 bg-surface-subtle transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "border-primary ring-1 ring-primary/20"
                    : "border-border opacity-80 hover:border-primary/40 hover:opacity-100"
                )}
              >
                <Image
                  src={thumbSrc}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 15vw"
                  className="object-cover"
                  onError={() => markImageFailed(src)}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}
