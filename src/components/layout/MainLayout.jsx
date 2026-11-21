import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
