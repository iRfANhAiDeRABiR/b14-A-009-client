import { CustomerSteps } from "@/components/pages/how-it-works/CustomerSteps";
import { HowItWorksHero } from "@/components/pages/how-it-works/HowItWorksHero";
import { OwnerSteps } from "@/components/pages/how-it-works/OwnerSteps";
import { WorkflowFAQ } from "@/components/pages/how-it-works/WorkflowFAQ";

export const metadata = {
  title: "How It Works",
  description:
    "Learn how to discover, book and manage equipment rentals through GearNest.",
};

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksHero />
      <CustomerSteps />
      <OwnerSteps />
      <WorkflowFAQ />
    </>
  );
}
