"use client";

import * as React from "react";
import { AlertCircle, ArrowRight, PackagePlus, RefreshCw } from "lucide-react";

import { getRecentlyAddedEquipment } from "@/services/equipmentService";
import {
  EquipmentCard,
  EquipmentCardSkeleton,
} from "@/components/equipment/EquipmentCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function RecentlyAdded() {
  const [state, setState] = React.useState({
    items: [],
    source: "demo",
    error: null,
    loading: true,
  });

  const loadRecent = React.useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const result = await getRecentlyAddedEquipment({ limit: 4 });
    setState({
      items: result.items,
      source: result.source,
      error: result.error,
      loading: false,
    });
  }, []);

  React.useEffect(() => {
    let active = true;

    getRecentlyAddedEquipment({ limit: 4 }).then((result) => {
      if (!active) return;
      setState({
        items: result.items,
        source: result.source,
        error: result.error,
        loading: false,
      });
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section aria-labelledby="recently-added-heading" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          headingId="recently-added-heading"
          eyebrow="Fresh Listings"
          title="Recently Added"
          description="Discover equipment newly listed on GearNest."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              {!state.loading && state.source === "demo" ? (
                <Badge variant="neutral" size="sm">
                  Demo Preview Data
                </Badge>
              ) : null}
              <Button href="/equipment" variant="primary" size="md">
                <span>View All Equipment</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          }
        />

        {state.error ? (
          <div
            role="status"
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
          >
            <div className="flex items-center gap-2">
              <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
              <span>
                Unable to reach recent listings API ({state.error}). Displaying demo
                listings.
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={loadRecent}>
              <RefreshCw aria-hidden="true" className="size-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        ) : null}

        {state.loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <EquipmentCardSkeleton key={idx} />
            ))}
          </div>
        ) : state.items.length === 0 ? (
          <Card className="mt-10 flex flex-col items-center justify-center py-14 text-center">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <PackagePlus className="size-6" />
            </span>
            <h3 className="type-card-title mt-4 text-foreground">
              No recently added listings yet
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-text-secondary">
              Check back soon or explore our existing equipment catalog.
            </p>
            <Button href="/equipment" variant="primary" size="md" className="mt-5">
              <span>Browse Catalog</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </Card>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {state.items.map((item, index) => (
              <EquipmentCard
                key={item._id || item.id || index}
                item={item}
                index={index}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
