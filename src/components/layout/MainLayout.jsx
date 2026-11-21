import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
            <Navbar />
          </Suspense>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}
