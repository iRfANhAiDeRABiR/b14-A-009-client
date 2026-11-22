"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const WORKFLOW_FAQS = [
  {
    id: "find-equipment",
    question: "How can I find equipment?",
    answer:
      "Visit the All Equipment marketplace page to browse approved listings across Construction, Photography, Vehicles & Transportation, Agriculture, Electronics, and Event Equipment. You can search by keyword or location and filter by category, rental type, price range, and availability.",
  },
  {
    id: "need-account",
    question: "Do I need an account to book equipment?",
    answer:
      "Anyone can browse public listings and compare specs, rates, and rental terms. To save favorites, verify live booking availability, or reserve equipment through checkout, you must be signed in to an authenticated GearNest account.",
  },
  {
    id: "price-calculated",
    question: "How is the rental price calculated?",
    answer:
      "The Equipment Details and Booking Modal estimate your rental cost in Bangladeshi Taka (৳) using the equipment's unit price, rental period type (Daily, Weekly, or Monthly), selected rental dates, and required quantity. Before Stripe Checkout is created, the backend independently validates dates, stock overlap, and final payable amount.",
  },
  {
    id: "pay-rental",
    question: "How can I pay for a rental?",
    answer:
      "After submitting a booking request, GearNest creates a server-verified Stripe Checkout Session and redirects you to Stripe Hosted Checkout. GearNest never collects or stores card numbers in the browser, and payment confirmation is updated once verified by the backend webhook.",
  },
  {
    id: "list-equipment",
    question: "How can I list my equipment?",
    answer:
      "Listing tools are available through the Owner Dashboard once your account is authorized with the Owner role. Public registration creates a Customer account by default. From the Owner portal, you can add listings that remain in Pending status until reviewed and approved by an Admin.",
  },
  {
    id: "track-bookings",
    question: "How can I track my bookings?",
    answer:
      "Open the Customer Dashboard and select My Rentals to review all reservations, rental dates, total amounts, payment statuses, and booking statuses, plus view complete transaction and delivery details in one view.",
  },
];

export function WorkflowFAQ() {
  const [openId, setOpenId] = React.useState(WORKFLOW_FAQS[0].id);

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <section aria-labelledby="workflow-faq-heading" className="py-16 sm:py-20">
      <Container size="md">
        <SectionHeading
          id="workflow-faq-heading"
          eyebrow="Common Questions"
          title="Frequently Asked Questions"
          description="Clear answers about browsing, booking, pricing estimates, Stripe Checkout, and Owner listing workflows."
          align="center"
        />

        <div className="mt-10 space-y-3">
          {WORKFLOW_FAQS.map((item) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <Card
                key={item.id}
                padding="none"
                className="overflow-hidden rounded-2xl"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-heading text-base font-semibold text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-6"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle
                        aria-hidden="true"
                        className="size-4 shrink-0 text-primary"
                      />
                      <span>{item.question}</span>
                    </span>
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
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="border-t border-border bg-background/70 px-5 py-4 text-sm leading-relaxed text-text-secondary sm:px-6"
                >
                  {item.answer}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
