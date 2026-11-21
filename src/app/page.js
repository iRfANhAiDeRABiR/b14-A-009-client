import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/shared/HeroSection";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
