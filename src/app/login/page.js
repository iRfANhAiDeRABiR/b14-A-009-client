import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <ComingSoonPage
      eyebrow="Account Access"
      title="Sign In to GearNest"
      description="Email, password, and Google social authentication powered by BetterAuth will be connected in the authentication milestone."
      secondaryAction={{ label: "Create an Account", href: "/register" }}
    />
  );
}
