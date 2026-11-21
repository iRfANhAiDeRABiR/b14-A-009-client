import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "My Equipment",
};

export default function OwnerMyEquipmentPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.OWNER}
      title="My Equipment Inventory"
      description="View approved, pending, and archived fleet items, update rental terms, and adjust available quantities."
      milestoneNote="Live equipment CRUD tables and status badges will load from protected owner endpoints in upcoming milestones."
    />
  );
}
