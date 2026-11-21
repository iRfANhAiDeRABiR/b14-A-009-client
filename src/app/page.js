import { CustomerReviews } from "@/components/home/CustomerReviews";
import { EquipmentCategories } from "@/components/home/EquipmentCategories";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { OwnerCTA } from "@/components/home/OwnerCTA";
import { RecentlyAdded } from "@/components/home/RecentlyAdded";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedEquipment />
      <EquipmentCategories />
      <WhyChooseUs />
      <HowItWorks />
      <CustomerReviews />
      <RecentlyAdded />
      <OwnerCTA />
    </>
  );
}
