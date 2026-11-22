"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ChevronDown,
  ClipboardList,
  CreditCard,
  UserCheck,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const HELP_TOPICS = [
  {
    title: "Renting Equipment",
    description:
      "Learn how to search listings, compare rental rates, calculate duration estimates, and submit bookings.",
    href: "/equipment",
    linkLabel: "Browse Equipment",
    icon: ClipboardList,
    tone: "bg-secondary text-primary",
  },
  {
    title: "Listing Equipment",
    description:
      "See how Owner portal listings work, from adding machinery specs and photos to Admin review.",
    href: "/how-it-works",
    linkLabel: "Read Workflow",
    icon: Boxes,
    tone: "bg-warning-bg text-warning",
  },
  {
    title: "Payments",
    description:
      "Review how Stripe Hosted Checkout works and monitor payment verification in My Rentals.",
    href: "/dashboard/customer/my-rentals",
    linkLabel: "View My Rentals",
    icon: CreditCard,
    tone: "bg-success-bg text-success",
  },
  {
    title: "Account Support",
    description:
      "Sign in to access Customer, Owner, or Admin dashboards or manage your verified account profile.",
    href: "/login",
    linkLabel: "Sign In",
    icon: UserCheck,
    tone: "bg-surface-subtle text-foreground",
  },
];

const CONTACT_FAQS = [
  {
    id: "choose-inquiry-type",
    question: "Which inquiry type should I select?",
    answer:
      "Choose Equipment Rental for booking questions, Equipment Listing for Owner onboarding or listing reviews, Payment Support for Stripe Checkout verification inquiries, or Technical Support for site issues.",
  },
  {
    id: "booking-reference-needed",
    question: "What should I include if I have a booking or listing question?",
    answer:
      "Include the equipment name or your booking reference ID inside the message body so the team can locate the exact record quickly without sharing any sensitive payment details.",
  },
  {
    id: "owner-onboarding-contact",
    question: "Can I request Owner portal access through this form?",
    answer:
      "Yes. Public registration creates Customer accounts by default. Select Equipment Listing in the inquiry form to tell us about the equipment you plan to offer.",
  },
];

export function ContactSupportCards() {
  const [openFaqId, setOpenFaqId] = React.useState(CONTACT_FAQS[0].id);

  return (
    <section
      aria-labelledby="contact-help-heading"
      className="border-t border-border bg-surface py-16 sm:py-20"
    >
      <Container className="space-y-14">
        <div>
          <SectionHeading
            id="contact-help-heading"
            eyebrow="Quick Guidance"
            title="How Can We Help?"
            description="Jump straight to relevant marketplace tools or support workflows before sending a message."
            align="center"
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HELP_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={topic.title}
                  tone="background"
                  padding="md"
                  hoverable
                  className="flex h-full flex-col justify-between rounded-2xl"
                >
                  <div>
                    <span
                      aria-hidden="true"
                      className={`flex size-11 items-center justify-center rounded-xl ${topic.tone}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="type-card-title mt-5 text-foreground">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {topic.description}
                    </p>
                  </div>

                  <Link
                    href={topic.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>{topic.linkLabel}</span>
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <h2 className="type-section-title text-center text-foreground">
            Common Contact Questions
          </h2>

          <div className="mt-6 space-y-3">
            {CONTACT_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <Card
                  key={faq.id}
                  tone="background"
                  padding="none"
                  className="overflow-hidden rounded-2xl"
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`contact-faq-${faq.id}`}
                      onClick={() =>
                        setOpenFaqId((prev) => (prev === faq.id ? "" : faq.id))
                      }
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-heading text-sm font-semibold text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 text-text-secondary transition-transform duration-200",
                          isOpen && "rotate-180 text-primary"
                        )}
                      />
                    </button>
                  </h3>
                  <div
                    id={`contact-faq-${faq.id}`}
                    hidden={!isOpen}
                    className="border-t border-border bg-surface px-5 py-4 text-sm leading-relaxed text-text-secondary"
                  >
                    {faq.answer}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
