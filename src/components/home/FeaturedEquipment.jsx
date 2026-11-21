"use client";

import * as React from "react";
import { AlertCircle, ArrowRight, PackageSearch, RefreshCw } from "lucide-react";

import { getFeaturedEquipment } from "@/services/equipmentService";
import {
  EquipmentCard,
  EquipmentCardSkeleton,
} from "@/components/equipment/EquipmentCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedEquipment() {
  const [state, setState] = React.useState({
    items: [],
    source: "demo",
    error: null,
    loading: true,
  });

  const loadFeatured = React.useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const result = await getFeaturedEquipment({ limit: 6 });
    setState({
      items: result.items,
      source: result.source,
      error: result.error,
      loading: false,
    });
  }, []);

  React.useEffect(() => {
    let active = true;

    getFeaturedEquipment({ limit: 6 }).then((result) => {
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
    <section
      aria-labelledby="featured-equipment-heading"
      className="border-t border-border bg-surface py-16 sm:py-20"
    >
      <Container>
        <div className="flex flex-col gap-4">
          <SectionHeading
            headingId="featured-equipment-heading"
            eyebrow="Featured Inventory"
            title="Equipment Ready for Your Next Project"
            description="Explore quality equipment available for flexible rental periods at competitive prices."
            actions={
              <div className="flex flex-wrap items-center gap-3">
                {!state.loading && state.source === "demo" ? (
                  <Badge variant="neutral" size="sm">
                    Demo Preview Data
                  </Badge>
                ) : null}
                <Button href="/equipment" variant="outline" size="md">
                  <span>View All Equipment</span>
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
            }
          />
        </div>

        {state.error ? (
          <div
            role="status"
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
          >
            <div className="flex items-center gap-2">
              <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
              <span>
                Live equipment API unavailable ({state.error}). Showing sample demo
                inventory instead.
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={loadFeatured}>
              <RefreshCw aria-hidden="true" className="size-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        ) : null}

        {state.loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <EquipmentCardSkeleton key={idx} />
            ))}
          </div>
        ) : state.items.length === 0 ? (
          <Card className="mt-10 flex flex-col items-center justify-center py-14 text-center">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <PackageSearch className="size-6" />
            </span>
            <h3 className="type-card-title mt-4 text-foreground">
              No featured equipment available right now
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-text-secondary">
              Approved listings will appear here as soon as equipment owners publish
              new inventory.
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={loadFeatured}
              className="mt-5"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              <span>Reload Inventory</span>
            </Button>
          </Card>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
