"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";

import { DEMO_CUSTOMER_REVIEWS } from "@/data/demoReviews";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CustomerReviews() {
  const prefersReducedMotion = useReducedMotion();

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
          description="Sample experiences across construction, photography, agriculture, and event equipment rentals."
          actions={
            <Badge variant="neutral" size="sm">
              Sample Preview Reviews
            </Badge>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-7 py-3 md:grid-cols-2 xl:grid-cols-4">
          {DEMO_CUSTOMER_REVIEWS.map((review, index) => {
            const movesUpFirst = index % 2 === 0;
            const entryProps = prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0 },
                  whileInView: { opacity: 1 },
                  viewport: { once: true, amount: 0.12 },
                  transition: {
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  },
                };

            const floatProps = prefersReducedMotion
              ? {}
              : {
                  animate: {
                    y: movesUpFirst
                      ? [0, -11, 0, 11, 0]
                      : [0, 11, 0, -11, 0],
                  },
                  transition: {
                    duration: 3.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                };

            return (
              <motion.div
                key={review.id}
                {...entryProps}
                className="h-full"
              >
                <motion.article
                  {...floatProps}
                  className="h-full will-change-transform"
                >
                  <Card
                    tone="background"
                    className="flex h-full flex-col justify-between transition-[border-color,box-shadow] duration-200 hover:border-primary/35 hover:shadow-sm"
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
                                  filled
                                    ? "size-4 fill-accent text-accent"
                                    : "size-4 text-border"
                                }
                              />
                            );
                          })}
                        </div>
                        <Quote
                          aria-hidden="true"
                          className="size-4 text-primary/35"
                        />
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
                        <p className="truncate text-xs text-text-secondary">
                          {review.category}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.article>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
