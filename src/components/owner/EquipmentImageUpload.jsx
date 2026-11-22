"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function EquipmentImageUpload({
  hostedUrl = "",
  previewSrc = "",
  uploadState,
  error = "",
  onSelectFile,
  onRemoveImage,
  disabled = false,
}) {
  const fileInputRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const isUploading = uploadState?.status === "uploading";
  const hasPreview = Boolean(previewSrc);
  const isUploaded = Boolean(hostedUrl) && uploadState?.status === "uploaded";
  const activeError = error || uploadState?.error || "";

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelectFile?.(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      onSelectFile?.(file);
    }
  };

  const triggerFilePicker = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="mb-4 border-b border-border pb-3.5">
        <h2 className="type-card-title text-foreground">
          4. Equipment Images
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Upload a clear photo via secure backend ImgBB relay (<code className="font-mono text-[11px]">POST /api/uploads/equipment-image</code>).
        </p>
      </div>

      <input
        ref={fileInputRef}
        id="equipment-image-input"
        name="equipmentImage"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="sr-only"
      />

      {!hasPreview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isUploading) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-secondary/40"
              : activeError
                ? "border-danger bg-danger-bg/40"
                : "border-border bg-background hover:border-primary/40"
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <UploadCloud className="size-6" />
          </span>

          <p className="mt-3 text-sm font-semibold text-foreground">
            Drag and drop an equipment image here
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Supports JPG, JPEG, PNG, or WEBP up to 5 MB.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading}
            onClick={triggerFilePicker}
            className="mt-4"
          >
            <UploadCloud aria-hidden="true" className="size-4" />
            <span>Browse Image File</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-surface-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Equipment upload preview"
              className="size-full object-cover"
            />
          </div>

          {isUploading ? (
            <div className="space-y-1.5 rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between text-xs font-medium text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Loader2
                    aria-hidden="true"
                    className="size-3.5 animate-spin text-primary"
                  />
                  <span>Uploading {uploadState.fileName}...</span>
                </span>
                <span className="tabular-nums">{uploadState.progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={uploadState.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Equipment image upload progress"
                className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-150"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          ) : isUploaded ? (
            <div className="flex items-center gap-2 rounded-xl border border-success-border bg-success-bg px-3 py-2 text-xs font-medium text-success">
              <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">
                Image hosted cleanly: {uploadState.fileName || "Ready"}
              </span>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading}
              onClick={triggerFilePicker}
            >
              <RefreshCw aria-hidden="true" className="size-3.5" />
              <span>Replace Image</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading}
              onClick={onRemoveImage}
              className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
            >
              <Trash2 aria-hidden="true" className="size-3.5" />
              <span>Remove Image</span>
            </Button>
          </div>
        </div>
      )}

      {activeError ? (
        <div
          id="equipment-image-error"
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-xl border border-danger-border bg-danger-bg px-3 py-2.5 text-xs font-medium text-danger"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{activeError}</span>
        </div>
      ) : null}
    </Card>
  );
}
