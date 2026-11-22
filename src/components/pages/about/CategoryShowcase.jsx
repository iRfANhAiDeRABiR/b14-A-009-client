import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EQUIPMENT_CATEGORIES } from "@/data/equipmentCategories";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CategoryShowcase() {
  return (
    <section
      aria-labelledby="about-categories-heading"
      className="py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          id="about-categories-heading"
          eyebrow="Equipment Coverage"
          title="One Marketplace. Many Possibilities."
          description="Discover tools, vehicles, production kits, and specialized machinery across six marketplace categories."
          align="center"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPMENT_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="group flex rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card
                padding="none"
                hoverable
                className="flex h-full w-full flex-col overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-subtle">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="type-card-title flex items-center justify-between gap-2 text-foreground">
                    <span>{category.name}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                    {category.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
