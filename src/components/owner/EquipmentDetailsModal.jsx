"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  FileText,
  Loader2,
  MapPin,
  Package,
  Pencil,
  ShieldAlert,
  User,
  Wrench,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { formatDisplayDate } from "@/lib/ownerUtils";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { getOwnerEquipmentById } from "@/services/equipmentService";
import { EquipmentStatusBadge } from "@/components/owner/EquipmentStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function EquipmentDetailsModal({ equipment, onClose }) {
  const isOpen = Boolean(equipment);
  const prefersReducedMotion = useReducedMotion();
  const { user, token } = useAuth();
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

    getOwnerEquipmentById(equipmentId, { token })
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
              : "Unable to load supplementary equipment details.",
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

  const ownerDisplay = activeItem?.owner || {
    name: user?.name || "",
    email: user?.email || "",
  };

  const showHardError =
    detailState.loadedId === equipmentId &&
    detailState.error &&
    (detailState.errorStatus === 403 || detailState.errorStatus === 404);

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
            aria-labelledby="owner-equipment-details-title"
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
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="owner-equipment-details-title"
                    className="truncate font-heading text-lg font-bold text-foreground sm:text-xl"
                  >
                    {activeItem.name}
                  </h2>
                  <EquipmentStatusBadge status={activeItem.status} />
                </div>
                {activeItem.category ? (
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {activeItem.category}
                  </p>
                ) : null}
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
                  <span>Refreshing latest record details...</span>
                </div>
              ) : null}

              {showHardError ? (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-xs text-warning sm:text-sm"
                >
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <span>{detailState.error}</span>
                </div>
              ) : null}

              {String(activeItem.status).toLowerCase() === "rejected" &&
              activeItem.rejectionReason ? (
                <div
                  role="alert"
                  className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-xs text-danger sm:text-sm"
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    <ShieldAlert aria-hidden="true" className="size-4 shrink-0" />
                    <span>Admin Rejection Feedback</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {activeItem.rejectionReason}
                  </p>
                </div>
              ) : null}

              {/* Image + Description */}
              <section
                aria-labelledby="modal-basic-info"
                className="grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-12"
              >
                <div className="sm:col-span-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeItem.image || "/images/hero-equipment.jpg"}
                    alt={activeItem.name}
                    className="aspect-[4/3] w-full rounded-xl border border-border bg-surface-subtle object-cover"
                  />
                </div>
                <div className="space-y-2 sm:col-span-7">
                  <h3
                    id="modal-basic-info"
                    className="font-heading text-sm font-semibold text-foreground"
                  >
                    Description
                  </h3>
                  <p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {activeItem.description || "No description returned."}
                  </p>
                  {activeItem.createdAt ? (
                    <p className="inline-flex items-center gap-1.5 pt-1 text-xs text-muted">
                      <Calendar aria-hidden="true" className="size-3.5 text-primary" />
                      <span>
                        Listed on {formatDisplayDate(activeItem.createdAt)}
                      </span>
                    </p>
                  ) : null}
                </div>
              </section>

              {/* Rental Info & Specifications */}
              <div className="grid gap-4 sm:grid-cols-2">
                <section
                  aria-labelledby="modal-rental-info"
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <Package
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    <h3
                      id="modal-rental-info"
                      className="font-heading text-sm font-semibold text-foreground"
                    >
                      Rental Information
                    </h3>
                  </div>

                  <dl className="mt-3 space-y-2.5 text-xs sm:text-sm">
                    <div>
                      <dt className="text-text-secondary">Rental Rate</dt>
                      <dd className="mt-0.5 font-heading text-base font-bold text-primary tabular-nums">
                        {activeItem.rentalPrice !== null
                          ? `${formatCurrencyBDT(activeItem.rentalPrice)} / ${activeItem.rentalType}`
                          : "—"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <dt className="text-text-secondary">Available Stock</dt>
                        <dd className="mt-0.5 font-medium text-foreground tabular-nums">
                          {activeItem.availableQuantity}{" "}
                          {activeItem.availableQuantity === 1 ? "unit" : "units"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-text-secondary">Availability</dt>
                        <dd className="mt-1">
                          <Badge
                            variant={
                              activeItem.availableQuantity > 0
                                ? "success"
                                : "warning"
                            }
                            size="sm"
                          >
                            {activeItem.availabilityStatus}
                          </Badge>
                        </dd>
                      </div>
                    </div>
                    {activeItem.location ? (
                      <div>
                        <dt className="text-text-secondary">Location</dt>
                        <dd className="mt-0.5 inline-flex items-center gap-1 font-medium text-foreground">
                          <MapPin
                            aria-hidden="true"
                            className="size-3.5 text-primary"
                          />
                          <span>{activeItem.location}</span>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </section>

                <section
                  aria-labelledby="modal-specs-info"
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <Wrench aria-hidden="true" className="size-4 text-primary" />
                    <h3
                      id="modal-specs-info"
                      className="font-heading text-sm font-semibold text-foreground"
                    >
                      Specifications &amp; Owner
                    </h3>
                  </div>

                  <dl className="mt-3 space-y-2.5 text-xs sm:text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      {activeItem.brand ? (
                        <div>
                          <dt className="text-text-secondary">Brand</dt>
                          <dd className="mt-0.5 font-medium text-foreground">
                            {activeItem.brand}
                          </dd>
                        </div>
                      ) : null}
                      {activeItem.model ? (
                        <div>
                          <dt className="text-text-secondary">Model</dt>
                          <dd className="mt-0.5 font-medium text-foreground">
                            {activeItem.model}
                          </dd>
                        </div>
                      ) : null}
                    </div>

                    {activeItem.condition ? (
                      <div>
                        <dt className="text-text-secondary">Condition</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {activeItem.condition}
                        </dd>
                      </div>
                    ) : null}

                    {ownerDisplay?.name || ownerDisplay?.email ? (
                      <div className="border-t border-border pt-2">
                        <dt className="text-text-secondary">Owner</dt>
                        <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-foreground">
                          <User
                            aria-hidden="true"
                            className="size-3.5 text-primary"
                          />
                          <span className="truncate">
                            {ownerDisplay.name || ownerDisplay.email}
                          </span>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </section>
              </div>

              {activeItem.rentalTerms ? (
                <section
                  aria-labelledby="modal-terms-info"
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <FileText
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    <h3
                      id="modal-terms-info"
                      className="font-heading text-sm font-semibold text-foreground"
                    >
                      Rental Terms &amp; Conditions
                    </h3>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {activeItem.rentalTerms}
                  </p>
                </section>
              ) : null}
            </div>

            <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-5 py-3.5 sm:rounded-b-2xl sm:px-6">
              <Button variant="outline" size="md" onClick={onClose}>
                Close
              </Button>
              <Button
                href={`/dashboard/owner/my-equipment/edit/${encodeURIComponent(
                  activeItem._id
                )}`}
                variant="primary"
                size="md"
              >
                <Pencil aria-hidden="true" className="size-4" />
                <span>Update Listing</span>
              </Button>
            </footer>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
