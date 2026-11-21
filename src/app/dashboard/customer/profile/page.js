import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "My Profile",
};

export default function CustomerProfilePage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.CUSTOMER}
      title="Customer Profile"
      description="Review your authenticated customer identity, avatar photo, and marketplace contact preferences."
      milestoneNote="Editable customer profile fields will connect directly to Better Auth / Express profile endpoints in the upcoming dashboard milestone."
    />
  );
}
