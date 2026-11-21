import { CustomerOverview } from "@/components/customer/CustomerOverview";

export const metadata = {
  title: "Customer Dashboard",
  description:
    "Manage your equipment rentals, view monthly rental activity, and explore saved favorites on GearNest.",
};

export default function CustomerOverviewPage() {
  return <CustomerOverview />;
}
