"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  Mail,
  ScrollText,
  UserCircle,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/Card";

const ADMIN_QUICK_ACTIONS = [
  {
    title: "All Users",
    description:
      "Manage user roles, edit profile details, suspend/ban accounts, and audit statuses.",
    href: "/dashboard/admin/users",
    icon: Users,
    tone: "bg-secondary text-primary",
  },
  {
    title: "All Equipment",
    description:
      "Audit submitted machinery listings, inspect approval history, and moderate statuses.",
    href: "/dashboard/admin/equipment",
    icon: Boxes,
    tone: "bg-warning-bg text-warning",
  },
  {
    title: "All Rentals",
    description:
      "Monitor platform-wide customer bookings, settlements, and internal admin notes.",
    href: "/dashboard/admin/rentals",
    icon: ClipboardList,
    tone: "bg-success-bg text-success",
  },
  {
    title: "Support Inquiries",
    description:
      "Review messages from /contact, track investigation status, and resolve tickets.",
    href: "/dashboard/admin/inquiries",
    icon: Mail,
    tone: "bg-secondary text-primary",
  },
  {
    title: "Event Log",
    description:
      "Filter persistent platform audit logs across users, equipment, rentals, and support.",
    href: "/dashboard/admin/logs",
    icon: ScrollText,
    tone: "bg-warning-bg text-warning",
  },
  {
    title: "My Profile",
    description:
      "Inspect administrator account identity, session details, and profile preferences.",
    href: "/dashboard/admin/profile",
    icon: UserCircle,
    tone: "bg-surface-subtle text-foreground",
  },
];

export function AdminQuickActions() {
  return (
    <section aria-labelledby="admin-quick-actions-heading">
      <div className="mb-3.5">
        <h2
          id="admin-quick-actions-heading"
          className="type-card-title text-foreground"
        >
          Quick Management Actions
        </h2>
        <p className="mt-0.5 text-xs text-text-secondary">
          Navigate directly to core GearNest governance and moderation modules.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_QUICK_ACTIONS.map((action) => {
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
