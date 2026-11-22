import { FileText, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export function RentalTerms({ rentalTerms, rentalType, className = "" }) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col justify-between gap-4 rounded-2xl",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"
          >
            <FileText className="size-4" />
          </span>
          <div>
            <h2 className="type-card-title text-foreground">
              Rental Terms and Conditions
            </h2>
            <p className="text-xs text-text-secondary">
              Applies to {String(rentalType || "Daily").toLowerCase()} rental
              bookings on GearNest
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          {rentalTerms}
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-border bg-background px-3.5 py-3 text-xs text-text-secondary">
        <ShieldAlert
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-primary"
        />
        <span>
          Displayed rental totals are preliminary estimates. The server verifies
          approved listing status, real-time date availability, and final
          billing before confirming any reservation.
        </span>
      </div>
    </Card>
  );
}
