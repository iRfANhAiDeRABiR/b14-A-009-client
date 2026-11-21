import { DashboardPlaceholderView } from "@/components/dashboard/DashboardPlaceholderView";
import { USER_ROLES } from "@/lib/roleNavigation";

export const metadata = {
  title: "My Rentals",
};

export default function CustomerRentalsPage() {
  return (
    <DashboardPlaceholderView
      portalRole={USER_ROLES.CUSTOMER}
      title="My Rentals"
      description="Inspect active rental durations, Stripe Checkout payment confirmations, delivery addresses, and completed bookings."
      milestoneNote="This route is protected by Better Auth Customer role authorization. Rental lists will populate dynamically from protected Express API endpoints."
    />
  );
}
