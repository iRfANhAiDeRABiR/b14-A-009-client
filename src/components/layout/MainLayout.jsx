import { Suspense } from "react";
import {
  PublicFooterSlot,
  PublicNavbarSlot,
} from "@/components/layout/ChromeSlots";
import { AuthProvider } from "@/context/AuthProvider";
import { FavoriteProvider } from "@/context/FavoriteProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
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
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <FavoriteProvider>
            <div className="flex min-h-dvh flex-col bg-background text-foreground transition-colors duration-200">
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
    </ThemeProvider>
  );
}
