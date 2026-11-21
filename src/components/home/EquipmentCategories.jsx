"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { EQUIPMENT_CATEGORIES } from "@/data/equipmentCategories";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function EquipmentCategories() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="categories-heading"
      className="py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          headingId="categories-heading"
          eyebrow="Browse by Specialty"
          title="Find Equipment by Category"
          description="Whatever your project needs, find the right equipment in one place."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {EQUIPMENT_CATEGORIES.map((category, index) => {
            const motionProps = prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 18 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.12 },
                  transition: {
                    duration: 0.42,
                    delay: Math.min(index * 0.06, 0.3),
                    ease: [0.22, 1, 0.36, 1],
                  },
                };

            return (
              <motion.div key={category.slug} {...motionProps}>
                <Link
                  href={category.href}
                  aria-label={`Explore ${category.name}`}
                  className="group block h-full cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card
                    padding="none"
                    className="flex h-full flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-subtle">
                      <Image
                        src={category.image}
                        alt={category.imageAlt}
                        fill
                        sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18221E]/55 via-[#18221E]/10 to-transparent"
                      />
                      <span className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-lg bg-surface/95 text-primary shadow-xs transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <h3 className="type-card-title text-foreground transition-colors group-hover:text-primary">
                          {category.name}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                          {category.description}
                        </p>
                      </div>

                      <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-primary uppercase">
                        <span>Explore Category</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
