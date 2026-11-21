import Image from "next/image";
import { Lock, MapPin, ShieldCheck, User } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EquipmentOwnerCard({
  owner,
  location,
  isAuthenticated = false,
}) {
  const ownerName = owner?.name || "Equipment Owner";
  const ownerPhoto = owner?.photo || "";
  const ownerLocation = owner?.locationLabel || location || "";

  return (
    <Card className="rounded-2xl">
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-card-title text-foreground">Owner Information</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          <span>Listed Provider</span>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3.5">
        {ownerPhoto ? (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border bg-surface-subtle">
            <Image
              src={ownerPhoto}
              alt={`${ownerName} profile photo`}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <User className="size-5" />
          </span>
        )}

        <div className="min-w-0">
          <p className="truncate font-heading text-base font-semibold text-foreground">
            {ownerName}
          </p>
          {ownerLocation ? (
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-text-secondary">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" />
              <span>{ownerLocation}</span>
            </p>
          ) : null}
          {owner?.memberSince ? (
            <p className="mt-0.5 text-xs text-text-secondary">
              Partner since {owner.memberSince}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-xs leading-relaxed text-text-secondary">
        {isAuthenticated && owner?.email ? (
          <p>
            Owner contact:{" "}
            <span className="font-medium text-foreground">{owner.email}</span>
          </p>
        ) : (
          <p className="flex items-center gap-2">
            <Lock aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
            <span>
              Direct owner contact details are protected and shared only with
              authenticated renters during booking.
            </span>
          </p>
        )}
      </div>
    </Card>
  );
}
