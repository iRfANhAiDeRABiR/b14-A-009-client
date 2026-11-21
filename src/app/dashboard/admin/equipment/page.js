import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "All Equipment",
};

export default function AdminEquipmentPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.ADMIN}
      title="All Equipment Moderation"
      description="Review owner-submitted equipment listings, verify inspection standards, and approve or reject items for public discovery."
      milestoneNote="Equipment moderation tables, approval buttons, and search filters will be added in the admin moderation commit."
    />
  );
}
