import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "Equipment Details",
};

export default function EquipmentDetailsPlaceholderPage() {
  return (
    <ComingSoonPage
      eyebrow="Equipment Details"
      title="Equipment Specifications & Booking"
      description="Detailed specifications, owner information, rental terms, favorites, and booking checkout for individual equipment listings will be implemented in an upcoming milestone."
      primaryAction={{ label: "Back to Home", href: "/" }}
      secondaryAction={{ label: "All Equipment", href: "/equipment" }}
    />
  );
}
