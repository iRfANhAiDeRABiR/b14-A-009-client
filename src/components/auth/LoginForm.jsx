"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, LogIn, Mail } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import {
  sanitizeRedirectPath,
  validateEmail,
  validatePassword,
} from "@/lib/authValidation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function getInitialOAuthError(searchParams) {
  const authError = searchParams.get("authError");
  if (!authError) return "";
  if (authError === "google_oauth_failed") {
    return "Google sign-in was cancelled or could not be verified. Please try again or use your email and password.";
  }
  return "Authentication could not be completed. Please try again.";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const {
    isAuthenticated,
    isLoading: isSessionLoading,
    login,
    loginWithGoogle,
  } = useAuth();

  const rawRedirect = searchParams.get("redirectTo");
  const redirectTarget = React.useMemo(
    () => sanitizeRedirectPath(rawRedirect, "/"),
    [rawRedirect]
  );

  const registerHref = React.useMemo(() => {
    if (!rawRedirect || redirectTarget === "/") return "/register";
    return `/register?redirectTo=${encodeURIComponent(redirectTarget)}`;
  }, [rawRedirect, redirectTarget]);

  const errorBannerRef = React.useRef(null);

  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState(() =>
    getInitialOAuthError(searchParams)
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  // If the user is already authenticated, leave /login cleanly without trapping them.
  React.useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, isSessionLoading, redirectTarget, router]);

  const isBusy = isSubmitting || isGoogleLoading;

  const updateField = (field) => (event) => {
    const nextValue = event.target.value;
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isBusy) return;

    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password, {
      requireComplexity: false,
    });

    const nextErrors = {};
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError("Please resolve the highlighted fields to sign in.");
      setTimeout(() => errorBannerRef.current?.focus(), 0);
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const result = await login({
        email: values.email,
        password: values.password,
      });

      const greetingName = result?.user?.name?.split(" ")[0] || "back";
      showToast({
        title: `Welcome ${greetingName}!`,
        description: "You are now signed in to GearNest.",
        variant: "success",
      });

      router.replace(redirectTarget);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please verify your credentials.";
      setFormError(message);
      setTimeout(() => errorBannerRef.current?.focus(), 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isBusy) return;

    setFormError("");
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle({ redirectTo: redirectTarget });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to launch Google sign-in right now.";
      setFormError(message);
      setTimeout(() => errorBannerRef.current?.focus(), 0);
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account Sign In"
      title="Sign in to GearNest"
      description="Access your rentals, saved favorites, equipment dashboard, and secure booking reservations."
      asideTitle="Reliable rentals start with verified access."
      asideDescription="Sign in to compare live fleet availability, manage active bookings, and complete protected payments across the marketplace."
    >
      {formError ? (
        <div
          ref={errorBannerRef}
          role="alert"
          tabIndex={-1}
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger focus:outline-none focus:ring-2 focus:ring-danger/30"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="login-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@company.com"
          autoComplete="email"
          required
          disabled={isBusy}
          value={values.email}
          onChange={updateField("email")}
          error={fieldErrors.email}
          leftIcon={<Mail className="size-4" />}
        />

        <PasswordInput
          id="login-password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={isBusy}
          value={values.password}
          onChange={updateField("password")}
          error={fieldErrors.password}
        />

        <div className="pt-1">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isGoogleLoading}
          >
            {!isSubmitting ? <LogIn aria-hidden="true" className="size-4" /> : null}
            <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
          </Button>
        </div>
      </form>

      <div className="relative my-6 flex items-center justify-center">
        <span aria-hidden="true" className="h-px w-full bg-border" />
        <span className="shrink-0 bg-surface px-3 text-xs font-medium text-muted">
          Or continue with
        </span>
        <span aria-hidden="true" className="h-px w-full bg-border" />
      </div>

      <GoogleLoginButton
        loading={isGoogleLoading}
        disabled={isSubmitting}
        onClick={handleGoogleSignIn}
      />

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href={registerHref}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
