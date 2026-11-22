import { AboutCTA } from "@/components/pages/about/AboutCTA";
import { AboutHero } from "@/components/pages/about/AboutHero";
import { CategoryShowcase } from "@/components/pages/about/CategoryShowcase";
import { MissionVision } from "@/components/pages/about/MissionVision";
import { OurStory } from "@/components/pages/about/OurStory";
import { OurValues } from "@/components/pages/about/OurValues";

export const metadata = {
  title: "About Us",
  description:
    "Learn about GearNest's mission to make equipment rental simpler for customers and equipment owners.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <CategoryShowcase />
      <OurValues />
      <AboutCTA />
    </>
  );
}
