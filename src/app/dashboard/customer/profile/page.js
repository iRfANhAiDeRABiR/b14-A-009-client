import { ProfileForm } from "@/components/customer/ProfileForm";

export const metadata = {
  title: "My Profile",
  description:
    "Manage your GearNest customer personal information, avatar photo, and contact details.",
};

export default function CustomerProfilePage() {
  return <ProfileForm />;
}
