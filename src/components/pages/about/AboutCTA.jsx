import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function AboutCTA() {
  return (
    <section aria-labelledby="about-cta-heading" className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-[#245447] bg-[#193D34] p-8 text-center text-white shadow-md sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-14 -right-14 size-56 rounded-full bg-white/5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-white/5"
          />

          <div className="relative mx-auto max-w-2xl">
            <h2
              id="about-cta-heading"
              className="type-section-title text-white"
            >
              Let&apos;s Make Your Next Project Easier.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#DCE8DF]">
              Discover equipment that fits your needs or connect with customers who need what you offer.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/equipment" variant="inverted" size="lg">
                <span>Explore Equipment</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button
                href="/contact"
                variant="ghost"
                size="lg"
                className="border border-white/25 text-white hover:bg-white/10"
              >
                <Mail aria-hidden="true" className="size-4" />
                <span>Get in Touch</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
