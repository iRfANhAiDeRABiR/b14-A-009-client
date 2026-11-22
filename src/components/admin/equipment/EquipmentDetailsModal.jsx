"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  Package,
  Pencil,
  ShieldAlert,
  User,
  Wrench,
  X,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { formatDisplayDate } from "@/lib/adminUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { getAdminEquipmentById } from "@/services/adminEquipmentService";
import { EquipmentStatusBadge } from "@/components/owner/EquipmentStatusBadge";
import { Button } from "@/components/ui/Button";

export function EquipmentDetailsModal({
  equipment,
  onClose,
  onApprove = null,
  onReject = null,
  onEdit = null,
}) {
  const isOpen = Boolean(equipment);
  const prefersReducedMotion = useReducedMotion();
  const { token } = useAuth();
  const closeButtonRef = React.useRef(null);

  const equipmentId = equipment?._id || "";

  const [detailState, setDetailState] = React.useState({
    loadedId: "",
    fetched: null,
    error: null,
    errorStatus: null,
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
      if (event.key === "Escape") {
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
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (!equipmentId) return undefined;

    let active = true;

    getAdminEquipmentById(equipmentId, { token })
      .then((detailed) => {
        if (!active) return;
        setDetailState({
          loadedId: equipmentId,
          fetched: detailed,
          error: null,
          errorStatus: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setDetailState({
          loadedId: equipmentId,
          fetched: null,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load extended equipment details.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [equipmentId, token]);

  const isLoadingDetails = Boolean(
    equipmentId && detailState.loadedId !== equipmentId
  );

  const activeItem =
    detailState.loadedId === equipmentId && detailState.fetched
      ? { ...equipment, ...detailState.fetched }
      : equipment;

  const showAuthAlert =
    detailState.loadedId === equipmentId &&
    detailState.error &&
    (detailState.errorStatus === 401 || detailState.errorStatus === 403);

  const statusNormalized = String(activeItem?.status || "").toLowerCase();

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
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-equipment-details-title"
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
            className="relative z-10 flex h-dvh w-full max-w-2xl flex-col bg-surface shadow-md sm:h-auto sm:max-h-[90dvh] sm:rounded-2xl sm:border sm:border-border"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2
                  id="admin-equipment-details-title"
                  className="font-heading text-lg font-bold text-foreground sm:text-xl"
                >
                  Equipment Moderation Details
                </h2>
                <EquipmentStatusBadge status={activeItem.status} size="sm" />
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close equipment details modal"
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              {isLoadingDetails ? (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-secondary">
                  <Loader2
                    aria-hidden="true"
                    className="size-3.5 animate-spin text-primary"
                  />
                  <span>Refreshing equipment record from backend...</span>
                </div>
              ) : null}

              {showAuthAlert ? (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-xs text-danger sm:text-sm"
                >
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <span>{detailState.error}</span>
                </div>
              ) : null}

              {statusNormalized === "rejected" && activeItem.rejectionReason ? (
                <div
                  role="alert"
                  className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-xs text-danger sm:text-sm"
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    <ShieldAlert aria-hidden="true" className="size-4 shrink-0" />
                    <span>Recorded Rejection Reason</span>
                  </p>
                  <p className="mt-1">{activeItem.rejectionReason}</p>
                </div>
              ) : null}

              <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeItem.image || "/images/hero-equipment.jpg"}
                  alt={activeItem.name}
                  className="h-36 w-full shrink-0 rounded-xl border border-border bg-surface-subtle object-cover sm:size-28"
                />

                <div className="min-w-0 flex-1 space-y-1.5">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {activeItem.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
                    {activeItem.category ? (
                      <span className="inline-flex items-center gap-1">
                        <Package aria-hidden="true" className="size-3.5 text-primary" />
                        <span>{activeItem.category}</span>
                      </span>
                    ) : null}
                    {activeItem.location ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin aria-hidden="true" className="size-3.5 text-primary" />
                        <span>{activeItem.location}</span>
                      </span>
                    ) : null}
                    {activeItem.createdAt ? (
                      <span className="inline-flex items-center gap-1">
                        <Calendar aria-hidden="true" className="size-3.5 text-primary" />
                        <span>Submitted {formatDisplayDate(activeItem.createdAt)}</span>
                      </span>
                    ) : null}
                  </div>

                  <p className="font-heading text-base font-bold text-primary tabular-nums">
                    {activeItem.rentalPrice !== null
                      ? `${formatCurrencyBDT(activeItem.rentalPrice)} / ${activeItem.rentalType}`
                      : "—"}
                    <span className="ml-3 text-xs font-medium text-text-secondary">
                      ({activeItem.availableQuantity}{" "}
                      {activeItem.availableQuantity === 1 ? "unit" : "units"} available)
                    </span>
                  </p>
                </div>
              </div>

              {activeItem.description ? (
                <section className="rounded-xl border border-border bg-background p-4">
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    Description
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {activeItem.description}
                  </p>
                </section>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <Wrench aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      Specifications
                    </h3>
                  </div>
                  <dl className="mt-3 space-y-2 text-xs sm:text-sm">
                    <div>
                      <dt className="text-text-secondary">Brand</dt>
                      <dd className="mt-0.5 font-medium text-foreground">
                        {activeItem.brand || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-secondary">Model</dt>
                      <dd className="mt-0.5 font-medium text-foreground">
                        {activeItem.model || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-secondary">Condition</dt>
                      <dd className="mt-0.5 font-medium text-foreground">
                        {activeItem.condition || "—"}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <User aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      Owner Information
                    </h3>
                  </div>
                  <dl className="mt-3 space-y-2 text-xs sm:text-sm">
                    <div>
                      <dt className="text-text-secondary">Owner Name</dt>
                      <dd className="mt-0.5 font-medium text-foreground">
                        {activeItem.owner?.name || "Verified Owner"}
                      </dd>
                    </div>
                    {activeItem.owner?.email ? (
                      <div>
                        <dt className="text-text-secondary">Owner Email</dt>
                        <dd className="mt-0.5 break-all font-medium text-foreground">
                          {activeItem.owner.email}
                        </dd>
                      </div>
                    ) : null}
                    {activeItem.owner?._id ? (
                      <div>
                        <dt className="text-text-secondary">Owner ID</dt>
                        <dd className="mt-0.5 break-all font-mono text-xs text-muted">
                          {activeItem.owner._id}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </section>
              </div>

              {activeItem.rentalTerms ? (
                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <FileText aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      Rental Terms &amp; Conditions
                    </h3>
                  </div>
                  <p className="mt-2.5 whitespace-pre-line text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {activeItem.rentalTerms}
                  </p>
                </section>
              ) : null}
            </div>

            <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2.5 border-t border-border bg-background px-5 py-3.5 sm:rounded-b-2xl sm:px-6">
              {typeof onEdit === "function" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onEdit(activeItem);
                  }}
                >
                  <Pencil aria-hidden="true" className="size-3.5" />
                  <span>Update</span>
                </Button>
              ) : null}

              {typeof onReject === "function" &&
              statusNormalized !== "rejected" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onReject(activeItem);
                  }}
                  className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
                >
                  <XCircle aria-hidden="true" className="size-3.5" />
                  <span>Reject</span>
                </Button>
              ) : null}

              {typeof onApprove === "function" &&
              statusNormalized !== "approved" ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onApprove(activeItem);
                  }}
                >
                  <CheckCircle2 aria-hidden="true" className="size-3.5" />
                  <span>Approve</span>
                </Button>
              ) : null}

              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </footer>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
