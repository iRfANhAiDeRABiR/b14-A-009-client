"use client";

import { useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";

import { DEMO_CUSTOMER_REVIEWS } from "@/data/demoReviews";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const COLUMN_CONFIG = [
  { direction: "up", duration: "26s", visibilityClass: "block" },
  { direction: "down", duration: "28s", visibilityClass: "block" },
  { direction: "up", duration: "25s", visibilityClass: "hidden xl:block" },
  { direction: "down", duration: "30s", visibilityClass: "hidden xl:block" },
];

function ReviewCard({ review }) {
  return (
    <Card
      tone="background"
      className="flex flex-col justify-between transition-[border-color,box-shadow] duration-200 hover:border-primary/35 hover:shadow-sm"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-0.5"
            aria-label={`Rated ${review.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, starIdx) => {
              const filled = starIdx < review.rating;
              return (
                <Star
                  key={starIdx}
                  aria-hidden="true"
                  className={
                    filled ? "size-4 fill-accent text-accent" : "size-4 text-border"
                  }
                />
              );
            })}
          </div>
          <Quote aria-hidden="true" className="size-4 text-primary/35" />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
        >
          {review.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-foreground">
            {review.customerName}
          </p>
          <p className="truncate text-xs text-text-secondary">{review.category}</p>
        </div>
      </div>
    </Card>
  );
}

function MarqueeColumn({ reviews, direction, duration, className }) {
  const trackClass =
    direction === "up" ? "animate-review-up" : "animate-review-down";

  return (
    <div className={cn("h-full overflow-hidden", className)}>
      <div
        className={cn("flex flex-col will-change-transform", trackClass)}
        style={{ "--marquee-duration": duration }}
      >
        <div className="flex flex-col gap-5 pb-5">
          {reviews.map((review) => (
            <article key={review.id}>
              <ReviewCard review={review} />
            </article>
          ))}
        </div>
        <div aria-hidden="true" className="flex flex-col gap-5 pb-5">
          {reviews.map((review) => (
            <div key={`${review.id}-dup`}>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CustomerReviews() {
  const prefersReducedMotion = useReducedMotion();

  const columns = COLUMN_CONFIG.map((cfg, colIdx) => ({
    ...cfg,
    reviews: DEMO_CUSTOMER_REVIEWS.filter(
      (_, reviewIdx) => reviewIdx % COLUMN_CONFIG.length === colIdx
    ),
  }));

  return (
    <section
      aria-labelledby="customer-reviews-heading"
      className="border-y border-border bg-surface py-16 sm:py-20"
    >
      <Container>
        <SectionHeading
          headingId="customer-reviews-heading"
          eyebrow="Customer Feedback"
          title="What Our Customers Say"
          description="Sample experiences across construction, photography, vehicles, agriculture, electronics, and event equipment rentals."
          actions={
            <Badge variant="neutral" size="sm">
              Sample Preview Reviews
            </Badge>
          }
        />

        {prefersReducedMotion ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {DEMO_CUSTOMER_REVIEWS.slice(0, 8).map((review) => (
              <article key={review.id} className="h-full">
                <ReviewCard review={review} />
              </article>
            ))}
          </div>
        ) : (
          <div className="relative mt-10 h-[470px] overflow-hidden sm:h-[520px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-surface to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-surface to-transparent"
            />

            <div className="h-full md:hidden">
              <MarqueeColumn
                reviews={DEMO_CUSTOMER_REVIEWS.slice(0, 6)}
                direction="up"
                duration="38s"
              />
            </div>

            <div className="hidden h-full grid-cols-2 gap-6 md:grid xl:grid-cols-4">
              {columns.map((column, colIdx) => (
                <MarqueeColumn
                  key={colIdx}
                  reviews={column.reviews}
                  direction={column.direction}
                  duration={column.duration}
                  className={column.visibilityClass}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
