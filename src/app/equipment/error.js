"use client";

import * as React from "react";
import { ErrorFallbackCard } from "@/components/shared/ErrorFallbackCard";

export default function EquipmentRouteError({ error, reset }) {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" && error) {
      console.error("Equipment route error:", error);
    }
  }, [error]);

  return (
    <ErrorFallbackCard
      badge="Catalog Error"
      title="Unable to render equipment view"
      description="Something interrupted loading this equipment listing or catalog view. You can retry now or return to the full catalog."
      digest={error?.digest || ""}
      onRetry={() => reset?.()}
      secondaryHref="/equipment"
      secondaryLabel="Explore Equipment"
    />
  );
}
