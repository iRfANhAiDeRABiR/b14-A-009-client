import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "All Rentals",
};

export default function AdminRentalsPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.ADMIN}
      title="All Platform Rentals"
      description="Monitor marketplace-wide bookings, Stripe payment verification statuses, and completion records across owners and customers."
      milestoneNote="Platform-wide rental tables and settlement audit filters will connect once Admin API endpoints are completed."
    />
  );
}
