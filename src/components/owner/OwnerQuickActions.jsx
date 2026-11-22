"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ClipboardCheck,
  PlusCircle,
  UserCircle,
} from "lucide-react";

import { Card } from "@/components/ui/Card";

const QUICK_ACTIONS = [
  {
    title: "Add Equipment",
    description:
      "Publish machinery, cameras, vehicles, or event setups for approval.",
    href: "/dashboard/owner/add-equipment",
    icon: PlusCircle,
    tone: "bg-primary text-primary-foreground",
  },
  {
    title: "Manage My Equipment",
    description:
      "Update stock counts, pricing rates, and inspect listing statuses.",
    href: "/dashboard/owner/my-equipment",
    icon: Boxes,
    tone: "bg-secondary text-primary",
  },
  {
    title: "View Rental Requests",
    description:
      "Monitor upcoming customer reservations and booking completions.",
    href: "/dashboard/owner/rentals",
    icon: ClipboardCheck,
    tone: "bg-warning-bg text-warning",
  },
  {
    title: "My Profile",
    description:
      "Review owner identity, photo, and dispatch contact configuration.",
    href: "/dashboard/owner/profile",
    icon: UserCircle,
    tone: "bg-surface-subtle text-foreground",
  },
];

export function OwnerQuickActions() {
  return (
    <section aria-labelledby="owner-quick-actions-heading">
      <div className="mb-3.5">
        <h2
          id="owner-quick-actions-heading"
          className="type-card-title text-foreground"
        >
          Quick Actions
        </h2>
        <p className="mt-0.5 text-xs text-text-secondary">
          Jump directly to common owner inventory and rental management views.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card
                padding="md"
                className="flex h-full flex-col justify-between rounded-2xl transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      aria-hidden="true"
                      className={`flex size-10 items-center justify-center rounded-xl ${action.tone}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                    {action.description}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
