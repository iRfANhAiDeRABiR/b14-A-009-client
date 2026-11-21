import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "All Equipment",
};

export default function EquipmentPage() {
  return (
    <ComingSoonPage
      eyebrow="Equipment Catalog"
      title="All Equipment Marketplace"
      description="The searchable, filterable 3-column equipment catalog for construction, photography, agriculture, vehicles, electronics, and event gear will be connected in an upcoming milestone."
      secondaryAction={{ label: "How It Works", href: "/how-it-works" }}
    />
  );
}
