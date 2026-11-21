import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "Favorites",
};

export default function CustomerFavoritesPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.CUSTOMER}
      title="Saved Favorites"
      description="Access equipment saved across construction, cinema photography, agricultural machinery, and field power tools for faster repeat bookings."
      milestoneNote="Saved favorites sync via authenticated JWT bearer requests once the customer dashboard integration commit is implemented."
    />
  );
}
