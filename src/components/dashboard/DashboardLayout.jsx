"use client";

import * as React from "react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export function DashboardLayout({ portalRole = null, children }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-dvh w-full overflow-x-clip bg-background text-foreground">
      <DashboardSidebar portalRole={portalRole} />

      <DashboardMobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        portalRole={portalRole}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          portalRole={portalRole}
          mobileNavOpen={mobileNavOpen}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main
          id="dashboard-main-content"
          className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"
        >
          <div className="mx-auto w-full min-w-0 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
