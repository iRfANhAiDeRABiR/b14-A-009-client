"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useEquipmentForm } from "@/hooks/useEquipmentForm";
import { mapEquipmentToFormValues } from "@/lib/ownerUtils";
import { getOwnerEquipmentById } from "@/services/equipmentService";
import { EquipmentBasicInfo } from "@/components/owner/EquipmentBasicInfo";
import { EquipmentImageUpload } from "@/components/owner/EquipmentImageUpload";
import { EquipmentLivePreview } from "@/components/owner/EquipmentLivePreview";
import { EquipmentRentalInfo } from "@/components/owner/EquipmentRentalInfo";
import { EquipmentSpecifications } from "@/components/owner/EquipmentSpecifications";
import { EquipmentStatusBadge } from "@/components/owner/EquipmentStatusBadge";
import { RentalTermsForm } from "@/components/owner/RentalTermsForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const FIELD_INPUT_IDS = {
  name: "equipment-name",
  category: "equipment-category",
  location: "equipment-location",
  description: "equipment-description",
  rentalPrice: "equipment-price",
  rentalType: "equipment-rental-type",
  availableQuantity: "equipment-quantity",
  condition: "equipment-condition",
  brand: "equipment-brand",
  model: "equipment-model",
  image: "equipment-image-input",
  rentalTerms: "equipment-rental-terms",
};

function EditEquipmentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card padding="lg" className="space-y-4 rounded-2xl">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
          </Card>
          <Card padding="lg" className="space-y-4 rounded-2xl">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-11 w-full" />
          </Card>
        </div>
        <div className="space-y-6 lg:col-span-5">
          <Card padding="lg" className="space-y-4 rounded-2xl">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export function EditEquipmentForm({ equipmentId }) {
  const errorSummaryRef = React.useRef(null);
  const { user, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [refreshTick, setRefreshTick] = React.useState(0);

  const requestKey = `${equipmentId || ""}|${token ? "auth" : "anon"}|${refreshTick}`;

  const [loadState, setLoadState] = React.useState({
    loadedKey: "",
    record: null,
    error: null,
    errorStatus: null,
  });

  const {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    uploadState,
    previewImageSrc,
    applyInitialValues,
    updateField,
    handleImageFileSelect,
    handleRemoveImage,
    handleSubmit,
  } = useEquipmentForm({
    mode: "edit",
    equipmentId,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated || !equipmentId) return undefined;

    let active = true;

    getOwnerEquipmentById(equipmentId, { token })
      .then((item) => {
        if (!active) return;
        setLoadState({
          loadedKey: requestKey,
          record: item,
          error: null,
          errorStatus: null,
        });
        applyInitialValues(mapEquipmentToFormValues(item));
      })
      .catch((error) => {
        if (!active) return;
        setLoadState({
          loadedKey: requestKey,
          record: null,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load equipment details for editing.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [
    applyInitialValues,
    equipmentId,
    isAuthLoading,
    isAuthenticated,
    requestKey,
    token,
  ]);

  const loading = isAuthLoading || loadState.loadedKey !== requestKey;
  const errorEntries = Object.entries(fieldErrors);
  const isUploading = uploadState.status === "uploading";
  const isBusy = isSubmitting || isUploading;

  const handleFormSubmit = async (event) => {
    const result = await handleSubmit(event);
    if (result && !result.ok && !result.inProgress) {
      setTimeout(() => errorSummaryRef.current?.focus(), 0);
    }
  };

  if (loading) {
    return <EditEquipmentSkeleton />;
  }

  if (loadState.error || !loadState.record) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/owner/my-equipment"
          className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          <span>Back to My Equipment</span>
        </Link>

        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl border border-warning-border bg-warning-bg text-warning"
          >
            <AlertCircle className="size-7" />
          </span>

          <h1 className="type-page-title mt-5 text-foreground">
            {loadState.errorStatus === 403
              ? "Unauthorized equipment access"
              : loadState.errorStatus === 404
                ? "Equipment listing not found"
                : "Unable to load equipment listing"}
          </h1>
          <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-text-secondary">
            {loadState.error ||
              "Confirm the listing belongs to your owner account and the backend server is reachable."}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setRefreshTick((p) => p + 1)}
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              <span>Retry</span>
            </Button>
            <Button
              href="/dashboard/owner/my-equipment"
              variant="outline"
              size="md"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span>Return to My Equipment</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const record = loadState.record;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/owner/my-equipment"
          className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          <span>Back to My Equipment</span>
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="type-page-title text-foreground">
            Update Equipment
          </h1>
          <EquipmentStatusBadge status={record.status} size="md" />
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Modify equipment specifications, rental rates, stock availability, or photos while preserving backend ownership and review controls.
        </p>
      </div>

      {String(record.status).toLowerCase() === "rejected" &&
      record.rejectionReason ? (
        <div
          role="alert"
          className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3.5 text-sm text-danger"
        >
          <p className="flex items-center gap-1.5 font-semibold">
            <ShieldAlert aria-hidden="true" className="size-4 shrink-0" />
            <span>Rejection Feedback</span>
          </p>
          <p className="mt-1 text-xs sm:text-sm">{record.rejectionReason}</p>
        </div>
      ) : null}

      {formError || errorEntries.length > 0 ? (
        <div
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="edit-equipment-error-summary"
          className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3.5 text-sm text-danger focus:outline-none focus:ring-2 focus:ring-danger/30"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <div>
              <h2 id="edit-equipment-error-summary" className="font-semibold">
                {formError || "Please resolve the highlighted required fields."}
              </h2>
              {errorEntries.length > 0 ? (
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs">
                  {errorEntries.map(([field, msg]) => (
                    <li key={field}>
                      <a
                        href={`#${FIELD_INPUT_IDS[field] || field}`}
                        className="underline underline-offset-2 hover:text-foreground"
                      >
                        {msg}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <EquipmentBasicInfo
              values={values}
              errors={fieldErrors}
              onChange={updateField}
              disabled={isSubmitting}
            />

            <EquipmentRentalInfo
              values={values}
              errors={fieldErrors}
              onChange={updateField}
              disabled={isSubmitting}
            />

            <EquipmentSpecifications
              values={values}
              errors={fieldErrors}
              onChange={updateField}
              disabled={isSubmitting}
            />

            <RentalTermsForm
              value={values.rentalTerms}
              error={fieldErrors.rentalTerms}
              onChange={updateField}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-6 lg:col-span-5">
            <EquipmentImageUpload
              hostedUrl={values.image}
              previewSrc={previewImageSrc}
              uploadState={uploadState}
              error={fieldErrors.image}
              onSelectFile={handleImageFileSelect}
              onRemoveImage={handleRemoveImage}
              disabled={isSubmitting}
            />

            <Card padding="lg" className="space-y-3 rounded-2xl">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                <h2 className="type-card-title text-foreground">
                  Review &amp; Ownership
                </h2>
                <EquipmentStatusBadge status={record.status} />
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                Owner:{" "}
                <strong className="font-semibold text-foreground">
                  {record.owner?.name || user?.name || user?.email}
                </strong>
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">
                Approval status is controlled solely by administrators and is preserved or re-queued per backend review policy.
              </p>
            </Card>

            <EquipmentLivePreview
              values={values}
              previewImageSrc={previewImageSrc}
            />
          </div>
        </div>

        <Card padding="md" className="rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={isBusy}
              onClick={() => applyInitialValues(mapEquipmentToFormValues(record))}
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              <span>Reset Changes</span>
            </Button>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                href="/dashboard/owner/my-equipment"
                variant="outline"
                size="md"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isUploading}
              >
                {!isSubmitting ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : null}
                <span>
                  {isSubmitting
                    ? "Saving Changes..."
                    : isUploading
                      ? "Waiting for Image Upload..."
                      : "Save Changes"}
                </span>
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
