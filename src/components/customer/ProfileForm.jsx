"use client";

import * as React from "react";
import {
  AlertCircle,
  Check,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  RotateCcw,
  Upload,
  User,
} from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { validateImageUrl } from "@/lib/authValidation";
import { validateCustomerProfile } from "@/lib/customerUtils";
import {
  hasImgBBConfigured,
  uploadProfilePhotoToImgBB,
} from "@/services/authService";
import {
  getMyProfile,
  updateMyProfile,
} from "@/services/profileService";
import { ProfileHeader } from "@/components/customer/ProfileHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card padding="lg" className="rounded-2xl">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full sm:size-20" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </Card>
      <Card padding="lg" className="space-y-4 rounded-2xl">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-24 w-full" />
      </Card>
    </div>
  );
}

export function ProfileForm() {
  const { showToast } = useToast();
  const {
    user,
    token,
    roleLabel,
    isLoading: isAuthLoading,
    isAuthenticated,
    refreshSession,
  } = useAuth();

  const imgbbEnabled = React.useMemo(() => hasImgBBConfigured(), []);
  const errorBannerRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  const [refreshTick, setRefreshTick] = React.useState(0);
  const requestKey = `${user?.id || user?.email || "profile"}|${refreshTick}`;

  const [loadState, setLoadState] = React.useState({
    loadedKey: "",
    error: null,
    savedProfile: {
      name: "",
      email: "",
      photoURL: "",
      phone: "",
      address: "",
    },
  });

  const [draft, setDraft] = React.useState(null);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    let active = true;

    getMyProfile({ token })
      .then((profile) => {
        if (!active) return;
        const resolved = {
          name: profile.name || user?.name || "",
          email: profile.email || user?.email || "",
          photoURL: profile.photoURL || user?.image || "",
          phone: profile.phone || "",
          address: profile.address || "",
        };
        setLoadState({
          loadedKey: requestKey,
          error: null,
          savedProfile: resolved,
        });
        setDraft(null);
        setFieldErrors({});
        setFormError("");
      })
      .catch((error) => {
        if (!active) return;
        const fallbackFromSession = {
          name: user?.name || "",
          email: user?.email || "",
          photoURL: user?.image || "",
          phone: "",
          address: "",
        };
        setLoadState({
          loadedKey: requestKey,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load profile details from server.",
          savedProfile: fallbackFromSession,
        });
        setDraft(null);
      });

    return () => {
      active = false;
    };
  }, [
    isAuthLoading,
    isAuthenticated,
    requestKey,
    token,
    user?.email,
    user?.image,
    user?.name,
  ]);

  const loading = isAuthLoading || loadState.loadedKey !== requestKey;
  const activeValues = draft || loadState.savedProfile;
  const isDirty = Boolean(
    draft &&
      (draft.name !== loadState.savedProfile.name ||
        draft.photoURL !== loadState.savedProfile.photoURL ||
        draft.phone !== loadState.savedProfile.phone ||
        draft.address !== loadState.savedProfile.address)
  );

  const isBusy = isSaving || isUploadingPhoto;

  const updateField = (field) => (event) => {
    const nextValue = event.target.value;
    setDraft((prev) => ({
      ...(prev || loadState.savedProfile),
      [field]: nextValue,
    }));
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

    setFieldErrors((prev) => ({ ...prev, photoURL: "" }));
    setFormError("");
    setIsUploadingPhoto(true);

    try {
      const uploadedUrl = await uploadProfilePhotoToImgBB(file);
      setDraft((prev) => ({
        ...(prev || loadState.savedProfile),
        photoURL: uploadedUrl,
      }));
      showToast({
        title: "Photo uploaded",
        description: "Click Save Changes to persist your new profile photo.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload profile image.";
      setFieldErrors((prev) => ({ ...prev, photoURL: message }));
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    setDraft(null);
    setFieldErrors({});
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isBusy) return;

    const validationErrors = validateCustomerProfile(activeValues);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setFormError("Please fix the highlighted profile fields before saving.");
      setTimeout(() => errorBannerRef.current?.focus(), 0);
      return;
    }

    setFormError("");
    setIsSaving(true);

    try {
      const updated = await updateMyProfile(activeValues, { token });
      const resolved = {
        name: updated.name || activeValues.name.trim(),
        email: updated.email || activeValues.email,
        photoURL:
          updated.photoURL !== undefined
            ? updated.photoURL
            : activeValues.photoURL.trim(),
        phone:
          updated.phone !== undefined
            ? updated.phone
            : activeValues.phone.trim(),
        address:
          updated.address !== undefined
            ? updated.address
            : activeValues.address.trim(),
      };

      setLoadState((prev) => ({
        ...prev,
        error: null,
        savedProfile: resolved,
      }));
      setDraft(null);

      await refreshSession?.().catch(() => null);

      showToast({
        title: "Profile updated",
        description: "Your personal information has been saved.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save profile changes right now.";
      setFormError(message);
      showToast({
        title: "Update failed",
        description: message,
        variant: "error",
      });
      setTimeout(() => errorBannerRef.current?.focus(), 0);
    } finally {
      setIsSaving(false);
    }
  };

  const previewUrl =
    activeValues.photoURL.trim() && !validateImageUrl(activeValues.photoURL)
      ? activeValues.photoURL.trim()
      : "";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">My Profile</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Manage your personal information and account details.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={loading || isBusy}
          onClick={() => setRefreshTick((prev) => prev + 1)}
        >
          <RefreshCw aria-hidden="true" className="size-3.5" />
          <span>Refresh</span>
        </Button>
      </header>

      {loadState.error && !loading ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>
              {loadState.error} Showing active session identity; connect{" "}
              <code className="font-mono text-xs">GET/PATCH /api/users/me</code>{" "}
              to persist edits.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshTick((prev) => prev + 1)}
          >
            <RefreshCw aria-hidden="true" className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : null}

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <>
          <ProfileHeader
            name={activeValues.name}
            email={activeValues.email}
            photoURL={previewUrl}
            phone={activeValues.phone}
            address={activeValues.address}
            roleLabel={roleLabel || "Customer"}
          />

          <Card padding="lg" className="rounded-2xl">
            <div className="mb-6 border-b border-border pb-4">
              <h2 className="type-card-title text-foreground">
                Personal Information
              </h2>
              <p className="mt-1 text-xs text-text-secondary">
                Account roles and authentication email addresses are managed securely and cannot be altered from this form.
              </p>
            </div>

            {formError ? (
              <div
                ref={errorBannerRef}
                role="alert"
                tabIndex={-1}
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger focus:outline-none focus:ring-2 focus:ring-danger/30"
              >
                <AlertCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0"
                />
                <span>{formError}</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="profile-name"
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  disabled={isBusy}
                  value={activeValues.name}
                  onChange={updateField("name")}
                  error={fieldErrors.name}
                  leftIcon={<User className="size-4" />}
                />

                <Input
                  id="profile-email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={activeValues.email}
                  disabled
                  helperText="Linked to your authenticated Better Auth account."
                  leftIcon={<Mail className="size-4" />}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="e.g., 01XXXXXXXXX"
                  autoComplete="tel"
                  disabled={isBusy}
                  value={activeValues.phone}
                  onChange={updateField("phone")}
                  error={fieldErrors.phone}
                  helperText="7 to 15 digits for rental dispatch coordination."
                  leftIcon={<Phone className="size-4" />}
                />

                <div className="space-y-2">
                  <Input
                    id="profile-photo-url"
                    name="photoURL"
                    type="url"
                    label="Profile Image URL"
                    placeholder="https://example.com/avatar.jpg"
                    autoComplete="photo"
                    disabled={isBusy}
                    value={activeValues.photoURL}
                    onChange={updateField("photoURL")}
                    error={fieldErrors.photoURL}
                    helperText={
                      imgbbEnabled
                        ? "Paste an HTTPS URL or upload a photo file below."
                        : "Paste any valid HTTP/HTTPS profile image URL."
                    }
                    leftIcon={<ImageIcon className="size-4" />}
                  />

                  {imgbbEnabled ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        id="profile-photo-file"
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
                          <Loader2
                            aria-hidden="true"
                            className="size-3.5 animate-spin"
                          />
                        ) : (
                          <Upload aria-hidden="true" className="size-3.5" />
                        )}
                        <span>
                          {isUploadingPhoto
                            ? "Uploading..."
                            : "Upload Image File"}
                        </span>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-address"
                  className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground"
                >
                  <MapPin aria-hidden="true" className="size-4 text-muted" />
                  <span>Delivery / Billing Address</span>
                </label>
                <textarea
                  id="profile-address"
                  name="address"
                  rows={3}
                  disabled={isBusy}
                  placeholder="House, Road, Area, City"
                  value={activeValues.address}
                  onChange={updateField("address")}
                  aria-invalid={Boolean(fieldErrors.address) || undefined}
                  aria-describedby={
                    fieldErrors.address ? "profile-address-error" : undefined
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70 sm:text-sm"
                />
                {fieldErrors.address ? (
                  <p
                    id="profile-address-error"
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger"
                  >
                    <AlertCircle aria-hidden="true" className="size-3.5" />
                    <span>{fieldErrors.address}</span>
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isBusy || !isDirty}
                  onClick={handleCancel}
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  <span>Cancel</span>
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSaving}
                  disabled={isUploadingPhoto}
                >
                  {!isSaving ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : null}
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
