"use client";

import * as React from "react";
import { AlertCircle, Check, RotateCcw } from "lucide-react";

import { useEquipmentForm } from "@/hooks/useEquipmentForm";
import { EquipmentBasicInfo } from "@/components/owner/EquipmentBasicInfo";
import { EquipmentImageUpload } from "@/components/owner/EquipmentImageUpload";
import { EquipmentLivePreview } from "@/components/owner/EquipmentLivePreview";
import { EquipmentRentalInfo } from "@/components/owner/EquipmentRentalInfo";
import { EquipmentSpecifications } from "@/components/owner/EquipmentSpecifications";
import { OwnerInformationCard } from "@/components/owner/OwnerInformationCard";
import { RentalTermsForm } from "@/components/owner/RentalTermsForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

export function AddEquipmentForm() {
  const errorSummaryRef = React.useRef(null);

  const {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    uploadState,
    previewImageSrc,
    updateField,
    handleImageFileSelect,
    handleRemoveImage,
    handleResetForm,
    handleSubmit,
  } = useEquipmentForm();

  const handleFormSubmit = async (event) => {
    const result = await handleSubmit(event);
    if (result && !result.ok && !result.inProgress) {
      setTimeout(() => errorSummaryRef.current?.focus(), 0);
    }
  };

  const errorEntries = Object.entries(fieldErrors);
  const isUploading = uploadState.status === "uploading";
  const isBusy = isSubmitting || isUploading;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="type-page-title text-foreground">List Your Equipment</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Add your equipment to GearNest and connect with customers looking for reliable rental solutions.
        </p>
      </header>

      {(formError || errorEntries.length > 0) ? (
        <div
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="add-equipment-error-summary"
          className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3.5 text-sm text-danger focus:outline-none focus:ring-2 focus:ring-danger/30"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <div>
              <h2 id="add-equipment-error-summary" className="font-semibold">
                {formError || "Please check the required form fields below."}
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
          {/* Left Column: Core Info, Rental Rates, Specifications & Terms */}
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

          {/* Right Column: Image Upload, Owner Card, Pending Status & Live Preview */}
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

            <OwnerInformationCard />

            <EquipmentLivePreview
              values={values}
              previewImageSrc={previewImageSrc}
            />
          </div>
        </div>

        {/* Form Submission Actions */}
        <Card padding="md" className="rounded-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-secondary">
              Submissions create a listing under{" "}
              <strong className="font-semibold text-foreground">
                Pending Admin Approval
              </strong>
              .
            </p>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={isBusy}
                onClick={handleResetForm}
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                <span>Cancel / Reset</span>
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
                    ? "Submitting Equipment..."
                    : isUploading
                      ? "Waiting for Image Upload..."
                      : "Submit Equipment"}
                </span>
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
