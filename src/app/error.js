"use client";

import * as React from "react";
import { ErrorFallbackCard } from "@/components/shared/ErrorFallbackCard";

export default function RootErrorPage({ error, reset }) {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" && error) {
      console.error("GearNest route error:", error);
    }
  }, [error]);

  return (
    <ErrorFallbackCard
      badge="Application Error"
      title="We hit an unexpected issue"
      description="This GearNest view encountered a temporary rendering error. Retry loading the page or return to the homepage."
      digest={error?.digest || ""}
      onRetry={() => reset?.()}
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
