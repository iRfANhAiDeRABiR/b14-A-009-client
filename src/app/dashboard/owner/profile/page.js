import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Owner Profile",
};

export default function OwnerProfilePage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.OWNER}
      title="Owner Profile"
      description="Manage your owner display identity, fleet hub location, and contact verification preferences."
      milestoneNote="Owner profile editing will integrate cleanly with Better Auth / Express profile endpoints in upcoming milestones."
    />
  );
}
