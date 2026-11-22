import {
  Boxes,
  ClipboardCheck,
  CreditCard,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import { Card } from "@/components/ui/Card";

const SUPPORT_CHANNELS = [
  {
    title: "General Inquiries",
    description:
      "Questions about how GearNest works, regional availability, or platform feedback.",
    icon: MessageSquareText,
    tone: "bg-secondary text-primary",
  },
  {
    title: "Rental Support",
    description:
      "Assistance with finding equipment, understanding rental duration terms, or reviewing booking details.",
    icon: ClipboardCheck,
    tone: "bg-success-bg text-success",
  },
  {
    title: "Equipment Listing Support",
    description:
      "Guidance for owners submitting listings, updating specifications, or checking approval status.",
    icon: Boxes,
    tone: "bg-warning-bg text-warning",
  },
  {
    title: "Payment Assistance",
    description:
      "Support regarding Stripe Hosted Checkout redirects, payment verification, or transaction records.",
    icon: CreditCard,
    tone: "bg-surface-subtle text-foreground",
  },
];

export function ContactInformation() {
  return (
    <div className="space-y-4">
      <div>
        <p className="type-label text-primary">Support Categories</p>
        <h2 className="type-card-title mt-1.5 text-xl text-foreground">
          How to Reach GearNest
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
          Select the inquiry category that best fits your question and submit a direct request through our contact form.
        </p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
        {SUPPORT_CHANNELS.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} padding="md" className="rounded-2xl">
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card tone="subtle" padding="md" className="rounded-2xl">
        <div className="flex items-start gap-3">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-primary"
          />
          <p className="text-xs leading-relaxed text-text-secondary">
            Inquiries are sent securely to the GearNest Express API when configured. Never share card numbers, passwords, or private account credentials inside support messages.
          </p>
        </div>
      </Card>
    </div>
  );
}
