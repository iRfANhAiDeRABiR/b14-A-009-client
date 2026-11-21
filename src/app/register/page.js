import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <ComingSoonPage
      eyebrow="Create Account"
      title="Join GearNest"
      description="Customer and equipment owner registration with profile photo upload and password validation will be built in the authentication milestone."
      secondaryAction={{ label: "Sign In", href: "/login" }}
    />
  );
}
