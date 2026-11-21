import { AlertTriangle, PackageSearch, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function EquipmentEmptyState({ hasActiveFilters, onClearFilters }) {
  return (
    <Card className="flex flex-col items-center justify-center py-16 text-center">
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
      >
        <PackageSearch className="size-7" />
      </span>
      <h2 className="type-card-title mt-5 text-foreground">
        No equipment found
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
        Try adjusting your search or filters to discover more equipment.
      </p>
      {hasActiveFilters ? (
        <Button
          variant="primary"
          size="md"
          onClick={onClearFilters}
          className="mt-6"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          <span>Clear Filters</span>
        </Button>
      ) : null}
    </Card>
  );
}

export function EquipmentErrorState({ message, onRetry }) {
  return (
    <Card
      role="alert"
      className="flex flex-col items-center justify-center border-danger-border bg-danger-bg/40 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-xl bg-danger-bg text-danger"
      >
        <AlertTriangle className="size-7" />
      </span>
      <h2 className="type-card-title mt-5 text-foreground">
        Unable to load equipment
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
        {message || "Something went wrong while fetching equipment listings."}
      </p>
      <Button variant="primary" size="md" onClick={onRetry} className="mt-6">
        <RotateCcw aria-hidden="true" className="size-4" />
        <span>Retry</span>
      </Button>
    </Card>
  );
}
