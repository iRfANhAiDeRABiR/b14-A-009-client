"use client";

import { Clock, Mail, ShieldCheck, User } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function OwnerInformationCard() {
  const { user } = useAuth();
  const ownerName = user?.name || "Authenticated Equipment Owner";
  const ownerEmail = user?.email || "";

  return (
    <Card padding="lg" className="space-y-5 rounded-2xl">
      <div>
        <div className="mb-3.5 border-b border-border pb-3">
          <h2 className="type-card-title text-foreground">
            5. Owner Information
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Automatically bound to your verified authenticated owner account.
          </p>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl border border-border bg-background p-3.5">
          {user?.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.image}
              alt={`${ownerName} profile photo`}
              className="size-12 shrink-0 rounded-full border border-border bg-surface-subtle object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <User className="size-5" />
            </span>
          )}

          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold text-foreground">
              {ownerName}
            </p>
            {ownerEmail ? (
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-text-secondary">
                <Mail aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{ownerEmail}</span>
              </p>
            ) : null}
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              <span>Verified Session Owner</span>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-warning-border bg-warning-bg px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-warning">
            Initial Listing Status
          </span>
          <Badge variant="warning" dot size="sm">
            Pending Admin Approval
          </Badge>
        </div>
        <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-warning">
          <Clock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>
            Your equipment will be reviewed by an administrator before becoming publicly available.
          </span>
        </p>
      </div>
    </Card>
  );
}
