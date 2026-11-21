"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { getDashboardBreadcrumbs } from "@/lib/roleNavigation";
import { cn } from "@/lib/utils";

export function DashboardBreadcrumbs({ className }) {
  const pathname = usePathname() || "/dashboard";
  const { role } = useAuth();
  const crumbs = getDashboardBreadcrumbs(pathname, role);

  return (
    <nav aria-label="Dashboard breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex min-w-0 items-center gap-1">
            {index > 0 ? (
              <ChevronRight
                aria-hidden="true"
                className="size-3.5 shrink-0 text-muted"
              />
            ) : null}
            {crumb.current ? (
              <span
                aria-current="page"
                className="truncate font-semibold text-foreground"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="truncate font-medium text-text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
