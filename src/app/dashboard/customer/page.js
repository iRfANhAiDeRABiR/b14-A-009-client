import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Customer Overview",
};

export default function CustomerOverviewPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.CUSTOMER}
      title="Customer Overview"
      description="Your central rental workspace for tracking active bookings, saved machinery, and verified customer profile settings."
      milestoneNote="Customer rental summaries, saved favorite cards, and booking history panels will connect cleanly here once backend dashboard milestones begin."
      showQuickNavigation
    />
  );
}
