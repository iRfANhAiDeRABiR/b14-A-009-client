"use client";

import { Mail, MapPin, Phone, User } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function ProfileHeader({
  name,
  email,
  photoURL,
  phone,
  address,
  roleLabel = "Customer",
}) {
  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {photoURL ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoURL}
              alt={`${name || "Customer"} avatar`}
              className="size-16 shrink-0 rounded-full border border-border bg-surface-subtle object-cover sm:size-20"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-20"
            >
              <User className="size-8" />
            </span>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {name || "GearNest Customer"}
              </h2>
              <Badge variant="primary" dot size="sm">
                {roleLabel}
              </Badge>
            </div>

            {email ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-secondary">
                <Mail aria-hidden="true" className="size-4 text-primary" />
                <span className="truncate">{email}</span>
              </p>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
              {phone ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone aria-hidden="true" className="size-3.5 text-primary" />
                  <span>{phone}</span>
                </span>
              ) : null}
              {address ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-3.5 text-primary" />
                  <span>{address}</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
