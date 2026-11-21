"use client";

import * as React from "react";
import { AlertTriangle, ArrowLeft, Clock, LogIn, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export function SessionErrorState({
  title = "Unable to verify authentication session",
  description = "We could not reach the GearNest authentication server to confirm your session status. Check that the backend server is running and try again.",
  errorDetail = "",
  onRetry,
  loginHref = "/login",
}) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <section
      role="alert"
      aria-labelledby="session-error-heading"
      className="flex min-h-[75dvh] items-center py-12 sm:py-20"
    >
      <Container size="sm">
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl border border-warning-border bg-warning-bg text-warning"
          >
            <AlertTriangle className="size-7" />
          </span>

          <div className="mt-5 flex justify-center">
            <Badge variant="warning" size="sm">
              Session Verification Error
            </Badge>
          </div>

          <h1
            id="session-error-heading"
            className="type-page-title mt-4 text-foreground"
          >
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            {description}
          </p>

          {errorDetail ? (
            <p className="mx-auto mt-3 max-w-md rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-secondary">
              {errorDetail}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {typeof onRetry === "function" ? (
              <Button
                variant="primary"
                size="md"
                loading={isRetrying}
                onClick={handleRetry}
              >
                {!isRetrying ? (
                  <RefreshCw aria-hidden="true" className="size-4" />
                ) : null}
                <span>{isRetrying ? "Checking session..." : "Retry Verification"}</span>
              </Button>
            ) : null}
            <Button href={loginHref} variant="outline" size="md">
              <LogIn aria-hidden="true" className="size-4" />
              <span>Go to Login</span>
            </Button>
            <Button href="/" variant="ghost" size="md">
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>Marketplace</span>
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

export function SessionExpiredState({ loginHref = "/login" }) {
  return (
    <section
      role="alert"
      aria-labelledby="session-expired-heading"
      className="flex min-h-[75dvh] items-center py-12 sm:py-20"
    >
      <Container size="sm">
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl border border-warning-border bg-warning-bg text-warning"
          >
            <Clock className="size-7" />
          </span>

          <div className="mt-5 flex justify-center">
            <Badge variant="warning" size="sm">
              Session Expired
            </Badge>
          </div>

          <h1
            id="session-expired-heading"
            className="type-page-title mt-4 text-foreground"
          >
            Your session has expired
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            For your security, inactive or expired sessions are signed out automatically. Sign in again to return straight to your requested destination.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button href={loginHref} variant="primary" size="md">
              <LogIn aria-hidden="true" className="size-4" />
              <span>Sign In Again</span>
            </Button>
            <Button href="/" variant="outline" size="md">
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}
