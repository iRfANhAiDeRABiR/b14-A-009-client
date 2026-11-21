"use client";

import { Heart, SearchX } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function FavoriteEmptyState({
  isFiltered = false,
  onClearFilters = null,
}) {
  if (isFiltered) {
    return (
      <Card padding="lg" className="rounded-2xl text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
        >
          <SearchX className="size-7" />
        </span>
        <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
          No favorites match your filters
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
          Try clearing your search keyword or switching category filters to see all your saved equipment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {typeof onClearFilters === "function" ? (
            <Button variant="outline" size="md" onClick={onClearFilters}>
              Clear Filters
            </Button>
          ) : null}
          <Button href="/equipment" variant="primary" size="md">
            Explore Equipment
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="rounded-2xl text-center">
      <span
        aria-hidden="true"
        className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
      >
        <Heart className="size-7" />
      </span>
      <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
        No Favorites Yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
        Start exploring GearNest and save equipment you may need for your next project.
      </p>
      <div className="mt-6 flex justify-center">
        <Button href="/equipment" variant="primary" size="md">
          Explore Equipment
        </Button>
      </div>
    </Card>
  );
}
