import { Suspense } from "react";
import { AuthPageSkeleton } from "@/components/auth/AuthSkeletons";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register",
  description:
    "Create your GearNest customer account with profile photo support and real-time password validation.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
