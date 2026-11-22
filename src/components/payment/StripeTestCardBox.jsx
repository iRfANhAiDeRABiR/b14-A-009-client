"use client";

import * as React from "react";
import { Check, Copy, CreditCard } from "lucide-react";

const STRIPE_SANDBOX_CARD = "4242 4242 4242 4242";

export function StripeTestCardBox({ compact = false }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("4242424242424242");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-primary/25 bg-secondary/45 p-3.5 text-left text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-heading font-semibold text-primary">
          <CreditCard aria-hidden="true" className="size-3.5" />
          <span>Stripe Test Mode Card</span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-primary/30 bg-surface px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check aria-hidden="true" className="size-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy aria-hidden="true" className="size-3" />
              <span>Copy Card</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold text-foreground">
        <span>{STRIPE_SANDBOX_CARD}</span>
        <span className="font-sans text-[11px] font-medium text-text-secondary">
          Exp: 12/30 &middot; CVC: 424
        </span>
      </div>

      {!compact ? (
        <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
          Stripe Test Mode declines saved/real card numbers. Clear browser card
          autofill on Stripe Checkout and enter{" "}
          <strong className="font-semibold text-foreground">
            4242 4242 4242 4242
          </strong>
          .
        </p>
      ) : null}
    </div>
  );
}
