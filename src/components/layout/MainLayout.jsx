import { Suspense } from "react";
import {
  PublicFooterSlot,
  PublicNavbarSlot,
} from "@/components/layout/ChromeSlots";
import { AuthProvider } from "@/context/AuthProvider";
import { FavoriteProvider } from "@/context/FavoriteProvider";
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
        <FavoriteProvider>
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
        </FavoriteProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
