import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <ComingSoonPage
      eyebrow="Platform Overview"
      title="About GearNest"
      description="Learn about GearNest's mission to connect verified local equipment owners with contractors, creators, and teams across transparent rental workflows."
    />
  );
}
