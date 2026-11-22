import Image from "next/image";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function OurStory() {
  return (
    <section aria-labelledby="our-story-heading" className="py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="type-label text-primary">Our Story</p>
            <h2
              id="our-story-heading"
              className="type-section-title mt-3 text-foreground"
            >
              Why GearNest Exists
            </h2>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-text-secondary">
              <p>
                Finding the right equipment for a project can be expensive and inconvenient, especially when purchasing equipment is not practical for short-term needs.
              </p>
              <p>
                At the same time, many equipment owners have valuable machinery, tools and equipment that may not be used every day.
              </p>
              <p>
                GearNest aims to bring these two groups together through a convenient rental marketplace.
              </p>
              <p>
                Our goal is to make equipment discovery, rental booking and equipment management easier through one connected platform.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card padding="sm" className="rounded-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-subtle">
                <Image
                  src="/images/hero-equipment.jpg"
                  alt="Organized rental gear including cinema camera, rotary drill, precision laser level, and LED lighting"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
