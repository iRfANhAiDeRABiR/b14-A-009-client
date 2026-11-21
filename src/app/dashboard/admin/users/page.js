import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "All Users",
};

export default function AdminUsersPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.ADMIN}
      title="All Users & Role Governance"
      description="Inspect registered GearNest users, account providers, and administer role assignments across Customer, Owner, and Admin accounts."
      milestoneNote="User directory tables and role promotion workflows will be added in the admin dashboard milestone and backed by server-side Admin checks."
    />
  );
}
