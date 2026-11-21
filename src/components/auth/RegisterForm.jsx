"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Image as ImageIcon,
  Loader2,
  Mail,
  Upload,
  User,
  UserPlus,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import {
  evaluatePasswordRules,
  sanitizeRedirectPath,
  validateEmail,
  validateImageUrl,
  validatePassword,
} from "@/lib/authValidation";
import {
  hasImgBBConfigured,
  uploadProfilePhotoToImgBB,
} from "@/services/authService";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const {
    isAuthenticated,
    isLoading: isSessionLoading,
    register,
    loginWithGoogle,
  } = useAuth();

  const rawRedirect = searchParams.get("redirectTo");
  const redirectTarget = React.useMemo(
    () => sanitizeRedirectPath(rawRedirect, "/"),
    [rawRedirect]
  );

  const loginHref = React.useMemo(() => {
    if (!rawRedirect || redirectTarget === "/") return "/login";
    return `/login?redirectTo=${encodeURIComponent(redirectTarget)}`;
  }, [rawRedirect, redirectTarget]);

  const imgbbEnabled = React.useMemo(() => hasImgBBConfigured(), []);
  const errorBannerRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  const [values, setValues] = React.useState({
    name: "",
    email: "",
    imageUrl: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, isSessionLoading, redirectTarget, router]);

  const passwordRules = React.useMemo(
    () => evaluatePasswordRules(values.password),
    [values.password]
  );

  const isBusy = isSubmitting || isGoogleLoading || isUploadingPhoto;

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

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFieldErrors((prev) => ({ ...prev, imageUrl: "" }));
    setFormError("");
    setIsUploadingPhoto(true);

    try {
      const uploadedUrl = await uploadProfilePhotoToImgBB(file);
      setValues((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      showToast({
        title: "Profile photo uploaded",
        description: "Your profile image URL has been attached.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload profile photo.";
      setFieldErrors((prev) => ({ ...prev, imageUrl: message }));
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isBusy) return;

    const trimmedName = values.name.trim();
    const nextErrors = {};

    if (!trimmedName) {
      nextErrors.name = "Full name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Full name must be at least 2 characters.";
    }

    const emailError = validateEmail(values.email);
    if (emailError) nextErrors.email = emailError;

    const imageError = validateImageUrl(values.imageUrl);
    if (imageError) nextErrors.imageUrl = imageError;

    const passwordError = validatePassword(values.password, {
      requireComplexity: true,
    });
    if (passwordError) nextErrors.password = passwordError;

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError("Please fix the highlighted fields to create your account.");
      setTimeout(() => errorBannerRef.current?.focus(), 0);
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await register({
        name: trimmedName,
        email: values.email,
        password: values.password,
        image: values.imageUrl.trim(),
      });

      showToast({
        title: "Account created",
        description: "Welcome to GearNest! Your customer account is ready.",
        variant: "success",
      });

      router.replace(redirectTarget);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create your account right now.";
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
          : "Unable to launch Google registration right now.";
      setFormError(message);
      setTimeout(() => errorBannerRef.current?.focus(), 0);
      setIsGoogleLoading(false);
    }
  };

  const checklistItems = [
    {
      key: "uppercase",
      met: passwordRules.hasUppercase,
      label: "Contains uppercase letter (A-Z)",
    },
    {
      key: "lowercase",
      met: passwordRules.hasLowercase,
      label: "Contains lowercase letter (a-z)",
    },
    {
      key: "minLength",
      met: passwordRules.hasMinLength,
      label: "At least 6 characters",
    },
  ];

  const validPreviewUrl =
    values.imageUrl.trim() && !validateImageUrl(values.imageUrl)
      ? values.imageUrl.trim()
      : "";

  return (
    <AuthLayout
      eyebrow="Customer Registration"
      title="Create your account"
      description="Join GearNest to save favorite equipment, calculate transparent rental totals, and book gear quickly."
      asideTitle="Rent heavy machines and production gear with confidence."
      asideDescription="Every public registration starts with a verified Customer profile. Owner and Administrator capabilities are managed centrally for marketplace trust."
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
          id="register-name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="Tariqul Islam"
          autoComplete="name"
          required
          disabled={isBusy}
          value={values.name}
          onChange={updateField("name")}
          error={fieldErrors.name}
          leftIcon={<User className="size-4" />}
        />

        <Input
          id="register-email"
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

        <div className="space-y-2">
          <div className="flex items-end gap-3">
            <Input
              id="register-image-url"
              name="imageUrl"
              type="url"
              label="Profile Photo URL (Optional)"
              placeholder="https://example.com/avatar.jpg"
              autoComplete="photo"
              disabled={isBusy}
              value={values.imageUrl}
              onChange={updateField("imageUrl")}
              error={fieldErrors.imageUrl}
              helperText={
                imgbbEnabled
                  ? "Paste an HTTPS image link or upload a JPG, PNG, or WebP photo (max 5 MB)."
                  : "Optional. Paste any valid HTTP/HTTPS profile image URL."
              }
              leftIcon={<ImageIcon className="size-4" />}
            />

            {validPreviewUrl ? (
              <div className="mb-5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={validPreviewUrl}
                  alt="Profile photo preview"
                  className="size-11 rounded-lg border border-border bg-surface-subtle object-cover"
                />
              </div>
            ) : null}
          </div>

          {imgbbEnabled ? (
            <div>
              <input
                ref={fileInputRef}
                id="register-photo-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={isBusy}
                className="sr-only"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isBusy}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingPhoto ? (
                  <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                ) : (
                  <Upload aria-hidden="true" className="size-3.5" />
                )}
                <span>
                  {isUploadingPhoto ? "Uploading photo..." : "Upload Image File"}
                </span>
              </Button>
            </div>
          ) : null}
        </div>

        <PasswordInput
          id="register-password"
          name="password"
          label="Password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
          disabled={isBusy}
          value={values.password}
          onChange={updateField("password")}
          error={fieldErrors.password}
        />

        {/* Real-time password strength checklist */}
        <ul
          aria-label="Password requirements"
          className="space-y-1.5 rounded-xl border border-border bg-background px-4 py-3 text-xs"
        >
          {checklistItems.map((rule) => (
            <li
              key={rule.key}
              className={cn(
                "flex items-center gap-2 transition-colors",
                rule.met ? "font-medium text-success" : "text-text-secondary"
              )}
            >
              {rule.met ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-success"
                />
              ) : (
                <Circle
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted"
                />
              )}
              <span>{rule.label}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-text-secondary">
          New registrations start with the standard{" "}
          <span className="font-semibold text-foreground">Customer</span> role.
        </p>

        <div className="pt-1">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isGoogleLoading || isUploadingPhoto}
          >
            {!isSubmitting ? (
              <UserPlus aria-hidden="true" className="size-4" />
            ) : null}
            <span>{isSubmitting ? "Creating account..." : "Create Account"}</span>
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
        disabled={isSubmitting || isUploadingPhoto}
        onClick={handleGoogleSignIn}
        label="Continue with Google"
      />

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
