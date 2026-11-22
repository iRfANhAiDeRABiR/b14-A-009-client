"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import {
  INITIAL_EQUIPMENT_FORM_VALUES,
  validateEquipmentImageFile,
  validateEquipmentListingForm,
} from "@/lib/ownerUtils";
import {
  createEquipmentListing,
  updateOwnerEquipment,
} from "@/services/equipmentService";
import { uploadEquipmentImage } from "@/services/imageUploadService";

export function useEquipmentForm({
  mode = "create",
  equipmentId = "",
  initialValues = null,
} = {}) {
  const router = useRouter();
  const { showToast } = useToast();
  const { token, getToken } = useAuth();

  const resolvedInitial = React.useMemo(
    () =>
      initialValues
        ? { ...INITIAL_EQUIPMENT_FORM_VALUES, ...initialValues }
        : INITIAL_EQUIPMENT_FORM_VALUES,
    [initialValues]
  );

  const [values, setValues] = React.useState(resolvedInitial);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [uploadState, setUploadState] = React.useState({
    status: resolvedInitial.image ? "uploaded" : "idle",
    progress: resolvedInitial.image ? 100 : 0,
    error: "",
    fileName: resolvedInitial.image ? "Current hosted photo" : "",
    localPreviewUrl: "",
  });

  const localPreviewRef = React.useRef("");
  const uploadInFlightRef = React.useRef(false);

  const revokeLocalPreview = React.useCallback(() => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
      localPreviewRef.current = "";
    }
  }, []);

  React.useEffect(() => {
    return () => {
      revokeLocalPreview();
    };
  }, [revokeLocalPreview]);

  const applyInitialValues = React.useCallback(
    (nextInitial) => {
      const merged = nextInitial
        ? { ...INITIAL_EQUIPMENT_FORM_VALUES, ...nextInitial }
        : INITIAL_EQUIPMENT_FORM_VALUES;
      revokeLocalPreview();
      setValues(merged);
      setFieldErrors({});
      setFormError("");
      setUploadState({
        status: merged.image ? "uploaded" : "idle",
        progress: merged.image ? 100 : 0,
        error: "",
        fileName: merged.image ? "Current hosted photo" : "",
        localPreviewUrl: "",
      });
    },
    [revokeLocalPreview]
  );

  const updateField = React.useCallback((field, nextValue) => {
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
    setFormError((prev) => (prev ? "" : prev));
  }, []);

  const handleImageFileSelect = React.useCallback(
    async (file) => {
      if (!file || uploadInFlightRef.current || isSubmitting) return;

      const fileError = validateEquipmentImageFile(file);
      if (fileError) {
        setFieldErrors((prev) => ({ ...prev, image: fileError }));
        setUploadState((prev) => ({
          ...prev,
          status: "error",
          progress: 0,
          error: fileError,
        }));
        showToast({
          title: "Invalid equipment image",
          description: fileError,
          variant: "warning",
        });
        return;
      }

      uploadInFlightRef.current = true;
      revokeLocalPreview();
      const previewUrl = URL.createObjectURL(file);
      localPreviewRef.current = previewUrl;

      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });
      setFormError("");
      setUploadState({
        status: "uploading",
        progress: 1,
        error: "",
        fileName: file.name || "equipment-image",
        localPreviewUrl: previewUrl,
      });

      try {
        const activeToken =
          token || (typeof getToken === "function" ? await getToken() : null);

        const uploaded = await uploadEquipmentImage(file, {
          token: activeToken,
          onProgress: (progress) => {
            setUploadState((prev) => ({ ...prev, progress }));
          },
        });

        setValues((prev) => ({ ...prev, image: uploaded.url }));
        setUploadState((prev) => ({
          ...prev,
          status: "uploaded",
          progress: 100,
          error: "",
        }));

        showToast({
          title: "Image uploaded",
          description: "Your equipment photo is ready to save.",
          variant: "success",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Image upload failed. Please try again.";

        // Security & UX rule: preserve existing hosted URL when editing, or stay empty in create mode.
        revokeLocalPreview();
        setValues((prev) => ({
          ...prev,
          image: mode === "edit" ? prev.image : "",
        }));
        setFieldErrors((prev) => ({ ...prev, image: message }));
        setUploadState((prev) => ({
          ...prev,
          status: mode === "edit" && prev.status === "uploaded" ? "uploaded" : "error",
          progress: 0,
          error: message,
          localPreviewUrl: "",
        }));

        showToast({
          title: "Image upload failed",
          description: message,
          variant: "error",
        });
      } finally {
        uploadInFlightRef.current = false;
      }
    },
    [getToken, isSubmitting, mode, revokeLocalPreview, showToast, token]
  );

  const handleRemoveImage = React.useCallback(() => {
    if (uploadInFlightRef.current || isSubmitting) return;
    revokeLocalPreview();
    setValues((prev) => ({ ...prev, image: "" }));
    setUploadState({
      status: "idle",
      progress: 0,
      error: "",
      fileName: "",
      localPreviewUrl: "",
    });
    setFieldErrors((prev) => {
      if (!prev.image) return prev;
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });
  }, [isSubmitting, revokeLocalPreview]);

  const handleResetForm = React.useCallback(() => {
    if (uploadInFlightRef.current || isSubmitting) return;
    applyInitialValues(resolvedInitial);
  }, [applyInitialValues, isSubmitting, resolvedInitial]);

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();
      if (isSubmitting) return { ok: false, inProgress: true };

      if (uploadState.status === "uploading") {
        const waitMessage =
          "Please wait for the equipment image upload to finish before submitting.";
        setFormError(waitMessage);
        showToast({
          title: "Upload in progress",
          description: waitMessage,
          variant: "warning",
        });
        return { ok: false };
      }

      const validationErrors = validateEquipmentListingForm(values);
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        setFormError(
          "Please resolve all highlighted required fields before saving."
        );
        showToast({
          title: "Validation required",
          description: "Check the highlighted fields on the form.",
          variant: "warning",
        });
        return { ok: false };
      }

      setFormError("");
      setIsSubmitting(true);

      try {
        const activeToken =
          token || (typeof getToken === "function" ? await getToken() : null);

        if (mode === "edit") {
          const result = await updateOwnerEquipment(equipmentId, values, {
            token: activeToken,
          });

          const serverMessage =
            typeof result?.message === "string" && result.message.trim()
              ? result.message.trim()
              : "Equipment listing updated successfully.";

          showToast({
            title: "Equipment updated",
            description: serverMessage,
            variant: "success",
          });

          router.push("/dashboard/owner/my-equipment");
          return { ok: true, result };
        }

        const result = await createEquipmentListing(values, {
          token: activeToken,
        });

        const serverMessage =
          typeof result?.message === "string" && result.message.trim()
            ? result.message.trim()
            : "Equipment submitted successfully and queued for admin review.";

        showToast({
          title: "Equipment submitted",
          description: serverMessage,
          variant: "success",
        });

        applyInitialValues(INITIAL_EQUIPMENT_FORM_VALUES);
        router.push("/dashboard/owner/my-equipment");
        return { ok: true, result };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to save equipment listing right now.";
        setFormError(message);
        showToast({
          title: mode === "edit" ? "Update failed" : "Submission failed",
          description: message,
          variant: "error",
        });
        return { ok: false, error: message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      applyInitialValues,
      equipmentId,
      getToken,
      isSubmitting,
      mode,
      router,
      showToast,
      token,
      uploadState.status,
      values,
    ]
  );

  return {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    uploadState,
    previewImageSrc: uploadState.localPreviewUrl || values.image || "",
    applyInitialValues,
    updateField,
    handleImageFileSelect,
    handleRemoveImage,
    handleResetForm,
    handleSubmit,
  };
}
