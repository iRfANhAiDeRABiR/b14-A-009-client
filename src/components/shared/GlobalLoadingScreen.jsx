import { Loader2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function GlobalLoadingScreen({ label = "Loading GearNest..." }) {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label={label}
      className="flex min-h-[65dvh] items-center py-16 sm:py-24"
    >
      <Container size="sm">
        <Card padding="lg" className="rounded-2xl text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-[#193D34] shadow-xs">
            <svg
              width="28"
              height="28"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M20 7.5L30.8253 13.75V26.25L20 32.5L9.17468 26.25V13.75L20 7.5Z"
                stroke="#F7F8F4"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="20" r="4.75" stroke="#D9A441" strokeWidth="2.4" />
            </svg>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            <span>{label}</span>
          </div>

          <div className="mx-auto mt-6 max-w-sm space-y-2.5">
            <Skeleton className="mx-auto h-4 w-3/4" />
            <Skeleton className="mx-auto h-3 w-1/2" />
          </div>
        </Card>
      </Container>
    </section>
  );
}
