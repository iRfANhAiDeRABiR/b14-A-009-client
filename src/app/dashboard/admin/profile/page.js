import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Admin Profile",
};

export default function AdminProfilePage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.ADMIN}
      title="Administrator Profile"
      description="View active administrator session details and verified marketplace moderation permissions."
      milestoneNote="Administrative profile updates and security audit controls will connect cleanly in future milestones."
    />
  );
}
