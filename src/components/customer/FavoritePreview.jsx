"use client";

import { ArrowRight, ExternalLink, Heart } from "lucide-react";

import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function FavoritePreview({ favorites = [], loading = false }) {
  if (loading) {
    return (
      <Card padding="lg" className="rounded-2xl">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[1, 2].map((card) => (
            <div
              key={card}
              className="rounded-xl border border-border p-3 space-y-2.5"
            >
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="flex flex-col justify-between rounded-2xl">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="type-card-title text-foreground">
              Favorite Equipment
            </h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              Saved gear ready for quick reservations.
            </p>
          </div>
          <Button
            href="/dashboard/customer/favorites"
            variant="outline"
            size="sm"
          >
            <span>View All Favorites</span>
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
        </div>

        {favorites.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <Heart className="size-6" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
              No Favorites Yet
            </h3>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-text-secondary">
              Save equipment you like and find it here whenever you need it.
            </p>
            <Button href="/equipment" variant="primary" size="sm" className="mt-4">
              Explore Equipment
            </Button>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {favorites.map((item) => (
              <div
                key={item.equipmentId}
                className="flex flex-col justify-between rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || "/images/hero-equipment.jpg"}
                    alt={item.name}
                    className="size-16 shrink-0 rounded-lg border border-border bg-surface-subtle object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {item.category}
                    </p>
                    <p className="mt-1.5 font-heading text-sm font-bold text-primary tabular-nums">
                      {formatCurrencyBDT(item.rentalPrice)}
                      <span className="ml-1 text-xs font-normal text-text-secondary">
                        / {item.rentalType}
                      </span>
                    </p>
                  </div>
                </div>

                <Button
                  href={`/equipment/${encodeURIComponent(item.equipmentId)}`}
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="mt-3"
                >
                  <span>View Details</span>
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
