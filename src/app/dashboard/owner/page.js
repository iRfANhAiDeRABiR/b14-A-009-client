import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Owner Overview",
};

export default function OwnerOverviewPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.OWNER}
      title="Owner Overview"
      description="Manage listed inventory, approval status updates, incoming reservations, and rental payouts from one dedicated owner portal."
      milestoneNote="Owner inventory metrics and rental analytics will connect via role-protected Express APIs in upcoming commits."
      showQuickNavigation
    />
  );
}
