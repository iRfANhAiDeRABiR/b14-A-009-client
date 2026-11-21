import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Admin Overview",
};

export default function AdminOverviewPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.ADMIN}
      title="Admin Overview"
      description="Platform governance portal for reviewing user roles, approving equipment listings, and monitoring marketplace bookings."
      milestoneNote="Real-time revenue charts, moderation queues, and administrative actions will connect via Admin-protected Express APIs in upcoming commits."
      showQuickNavigation
    />
  );
}
