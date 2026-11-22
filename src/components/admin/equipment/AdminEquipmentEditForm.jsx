"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2, ShieldCheck, X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useEquipmentForm } from "@/hooks/useEquipmentForm";
import { mapEquipmentToFormValues } from "@/lib/adminUtils";
import {
  getAdminEquipmentById,
  updateAdminEquipment,
} from "@/services/adminEquipmentService";
import { EquipmentBasicInfo } from "@/components/owner/EquipmentBasicInfo";
import { EquipmentImageUpload } from "@/components/owner/EquipmentImageUpload";
import { EquipmentRentalInfo } from "@/components/owner/EquipmentRentalInfo";
import { EquipmentSpecifications } from "@/components/owner/EquipmentSpecifications";
import { EquipmentStatusBadge } from "@/components/owner/EquipmentStatusBadge";
import { RentalTermsForm } from "@/components/owner/RentalTermsForm";
import { Button } from "@/components/ui/Button";

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

export function AdminEquipmentEditForm({
  equipment,
  onClose,
  onSaved,
}) {
  const isOpen = Boolean(equipment);
  const prefersReducedMotion = useReducedMotion();
  const { token } = useAuth();
  const closeButtonRef = React.useRef(null);
  const errorSummaryRef = React.useRef(null);

  const equipmentId = equipment?._id || "";

  const [detailState, setDetailState] = React.useState({
    loadedId: "",
    fetched: null,
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
    redirectHref: null,
    onSubmitUpdate: updateAdminEquipment,
    onSuccess: () => {
      onSaved?.();
      onClose();
    },
  });

  React.useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 20);

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    };
  }, [isOpen, isSubmitting, onClose]);

  React.useEffect(() => {
    if (!equipment) return undefined;

    applyInitialValues(mapEquipmentToFormValues(equipment));
    let active = true;

    getAdminEquipmentById(equipment._id, { token })
      .then((detailed) => {
        if (!active || !detailed) return;
        setDetailState({
          loadedId: equipment._id,
          fetched: detailed,
        });
        applyInitialValues(mapEquipmentToFormValues(detailed));
      })
      .catch(() => {
        if (!active) return;
        setDetailState({
          loadedId: equipment._id,
          fetched: null,
        });
      });

    return () => {
      active = false;
    };
  }, [applyInitialValues, equipment, token]);

  const isLoadingFresh = Boolean(
    equipmentId && detailState.loadedId !== equipmentId
  );

  const activeItem =
    detailState.loadedId === equipmentId && detailState.fetched
      ? { ...equipment, ...detailState.fetched }
      : equipment;

  const isUploading = uploadState.status === "uploading";
  const isBusy = isSubmitting || isUploading;
  const errorEntries = Object.entries(fieldErrors);

  const handleFormSubmit = async (event) => {
    const result = await handleSubmit(event);
    if (result && !result.ok && !result.inProgress) {
      setTimeout(() => errorSummaryRef.current?.focus(), 0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && activeItem ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-6"
          role="presentation"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => {
              if (!isBusy) onClose();
            }}
            aria-hidden="true"
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-equipment-edit-title"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, scale: 0.98, y: 12 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.98, y: 12 }
            }
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-dvh w-full max-w-4xl flex-col bg-background shadow-md sm:h-auto sm:max-h-[92dvh] sm:rounded-2xl sm:border sm:border-border"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:rounded-t-2xl sm:px-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="admin-equipment-edit-title"
                    className="font-heading text-lg font-bold text-foreground sm:text-xl"
                  >
                    Update Equipment Listing
                  </h2>
                  <EquipmentStatusBadge status={activeItem.status} size="sm" />
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Owner identity ({activeItem.owner?.name || "Verified Owner"}), booking history, and payment records remain protected.
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                disabled={isBusy}
                onClick={onClose}
                aria-label="Close update equipment modal"
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>

            <form
              onSubmit={handleFormSubmit}
              noValidate
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                {isLoadingFresh ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-secondary">
                    <Loader2
                      aria-hidden="true"
                      className="size-3.5 animate-spin text-primary"
                    />
                    <span>Syncing latest listing fields...</span>
                  </div>
                ) : null}

                {formError || errorEntries.length > 0 ? (
                  <div
                    ref={errorSummaryRef}
                    role="alert"
                    tabIndex={-1}
                    aria-labelledby="admin-edit-error-summary"
                    className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3.5 text-sm text-danger focus:outline-none focus:ring-2 focus:ring-danger/40"
                  >
                    <p
                      id="admin-edit-error-summary"
                      className="flex items-center gap-2 font-heading font-semibold"
                    >
                      <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
                      <span>
                        {formError || "Please resolve the highlighted errors before saving."}
                      </span>
                    </p>
                    {errorEntries.length > 0 ? (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                        {errorEntries.map(([fieldKey, message]) => (
                          <li key={fieldKey}>
                            <a
                              href={`#${FIELD_INPUT_IDS[fieldKey] || "equipment-name"}`}
                              className="underline hover:no-underline"
                            >
                              {message}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                <div className="grid gap-5 lg:grid-cols-12">
                  <div className="space-y-5 lg:col-span-7">
                    <EquipmentBasicInfo
                      values={values}
                      fieldErrors={fieldErrors}
                      onChange={updateField}
                      disabled={isSubmitting}
                    />

                    <EquipmentRentalInfo
                      values={values}
                      fieldErrors={fieldErrors}
                      onChange={updateField}
                      disabled={isSubmitting}
                    />

                    <EquipmentSpecifications
                      values={values}
                      fieldErrors={fieldErrors}
                      onChange={updateField}
                      disabled={isSubmitting}
                    />

                    <RentalTermsForm
                      values={values}
                      fieldErrors={fieldErrors}
                      onChange={updateField}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-5 lg:col-span-5">
                    <EquipmentImageUpload
                      uploadState={uploadState}
                      previewImageSrc={previewImageSrc}
                      fieldError={fieldErrors.image}
                      onFileSelect={handleImageFileSelect}
                      onRemoveImage={handleRemoveImage}
                      disabled={isSubmitting}
                    />

                    <div className="rounded-2xl border border-border bg-surface p-4 text-xs text-text-secondary">
                      <p className="flex items-center gap-1.5 font-heading text-sm font-semibold text-foreground">
                        <ShieldCheck
                          aria-hidden="true"
                          className="size-4 text-primary"
                        />
                        <span>Moderation Policy Notice</span>
                      </p>
                      <p className="mt-1.5 leading-relaxed">
                        Saving changes calls{" "}
                        <code className="font-mono text-[11px]">
                          PATCH /api/admin/equipment/:id
                        </code>{" "}
                        with sanitized equipment fields only. Approval status is controlled exclusively via Approve and Reject actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-border bg-surface px-5 py-3.5 sm:rounded-b-2xl sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={isBusy}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSubmitting}
                  disabled={isUploading}
                >
                  {!isSubmitting ? <Check aria-hidden="true" className="size-4" /> : null}
                  <span>
                    {isUploading
                      ? "Uploading Image..."
                      : isSubmitting
                        ? "Saving Changes..."
                        : "Save Equipment Changes"}
                  </span>
                </Button>
              </footer>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
