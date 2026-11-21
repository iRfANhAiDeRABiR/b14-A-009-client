import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "My Equipment Rental",
};

export default function OwnerRentalsPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.OWNER}
      title="My Equipment Rental"
      description="Inspect active customer bookings for your listed machines, confirm dispatch readiness, and update return completion."
      milestoneNote="Booking schedule filters and owner rental status workflows will be implemented in the owner dashboard commit."
    />
  );
}
