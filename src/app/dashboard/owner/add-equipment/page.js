import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Add Equipment",
};

export default function OwnerAddEquipmentPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.OWNER}
      title="Add Equipment"
      description="Submit new rental machinery, technical specifications, gallery photos, daily or weekly pricing, and available stock units."
      milestoneNote="The multi-field owner equipment submission form and ImgBB gallery uploader will be built in the owner dashboard milestone."
    />
  );
}
