import { MyRentalsTable } from "@/components/customer/MyRentalsTable";

export const metadata = {
  title: "My Rentals",
  description:
    "Track and manage all your equipment rental bookings, payment statuses, and schedules.",
};

export default function CustomerRentalsPage() {
  return <MyRentalsTable />;
}
