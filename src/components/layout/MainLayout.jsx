import { Suspense } from "react";
import {
  PublicFooterSlot,
  PublicNavbarSlot,
} from "@/components/layout/ChromeSlots";
import { AuthProvider } from "@/context/AuthProvider";
import { ToastProvider } from "@/context/ToastContext";

function NavbarFallback() {
  return (
    <div
      aria-hidden="true"
      className="sticky top-0 z-50 h-20 border-b border-border bg-surface/95"
    />
  );
}

export function MainLayout({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
          <Suspense fallback={<NavbarFallback />}>
            <PublicNavbarSlot />
          </Suspense>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Suspense fallback={null}>
            <PublicFooterSlot />
          </Suspense>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}
