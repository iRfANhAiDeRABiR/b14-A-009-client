import { Suspense } from "react";
import { AuthPageSkeleton } from "@/components/auth/AuthSkeletons";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
  description:
    "Sign in to your GearNest account to manage equipment rentals, favorites, and dashboard workflows.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
