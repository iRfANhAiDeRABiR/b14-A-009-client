"use client";

import * as React from "react";
import { ErrorFallbackCard } from "@/components/shared/ErrorFallbackCard";

export default function DashboardErrorBoundary({ error, reset }) {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" && error) {
      console.error("Dashboard error:", error);
    }
  }, [error]);

  return (
    <ErrorFallbackCard
      badge="Dashboard Error"
      title="Something interrupted this workspace view"
      description="An unexpected error occurred while rendering this dashboard view. Retry now or return to your portal overview."
      digest={error?.digest || ""}
      onRetry={() => reset?.()}
      secondaryHref="/dashboard"
      secondaryLabel="Return to Dashboard"
    />
  );
}
