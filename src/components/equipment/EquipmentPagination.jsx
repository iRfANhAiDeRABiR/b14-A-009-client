"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function EquipmentPagination({ pagination, onPageChange }) {
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 0;
  const totalItems = pagination?.totalItems || 0;
  const limit = pagination?.limit || 9;

  if (totalItems === 0 || totalPages === 0) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <nav
      aria-label="Equipment pagination"
      className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row"
    >
      <p className="text-sm text-text-secondary">
        Showing{" "}
        <span className="font-semibold text-foreground tabular-nums">
          {startItem}&ndash;{endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground tabular-nums">
          {totalItems}
        </span>{" "}
        equipment items &middot; Page{" "}
        <span className="font-semibold text-foreground tabular-nums">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground tabular-nums">
          {totalPages}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-1.5">
          {pages.map((pageNum) => {
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-surface-subtle"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
