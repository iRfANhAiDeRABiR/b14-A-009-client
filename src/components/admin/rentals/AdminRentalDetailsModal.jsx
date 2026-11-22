"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Receipt,
  Store,
  User,
  X,
} from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import {
  formatBookingDuration,
  formatDisplayDate,
} from "@/lib/adminUtils";
import {
  getAdminRentalById,
  updateAdminRentalNote,
} from "@/services/adminRentalService";
import { BookingPaymentSummary } from "@/components/customer/BookingPaymentSummary";
import { OwnerRentalStatusBadge } from "@/components/owner/OwnerRentalStatusBadge";
import { Button } from "@/components/ui/Button";

export function AdminRentalDetailsModal({
  rental,
  onClose,
  onUpdated = null,
}) {
  const isOpen = Boolean(rental);
  const prefersReducedMotion = useReducedMotion();
  const { showToast } = useToast();
  const { token, getToken } = useAuth();
  const closeButtonRef = React.useRef(null);

  const rentalId = rental?._id || "";

  const [detailState, setDetailState] = React.useState({
    loadedId: "",
    fetched: null,
    error: null,
    errorStatus: null,
  });
  const [noteDraft, setNoteDraft] = React.useState({ id: "", value: "" });
  const [isSavingNote, setIsSavingNote] = React.useState(false);

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
    if (!rentalId) return undefined;

    let active = true;

    getAdminRentalById(rentalId, { token })
      .then((detailed) => {
        if (!active) return;
        setDetailState({
          loadedId: rentalId,
          fetched: detailed,
          error: null,
          errorStatus: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setDetailState({
          loadedId: rentalId,
          fetched: null,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load supplementary rental details.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [rentalId, token]);

  const isLoadingDetails = Boolean(
    rentalId && detailState.loadedId !== rentalId
  );

  const activeRecord =
    detailState.loadedId === rentalId && detailState.fetched
      ? {
          ...rental,
          ...detailState.fetched,
          customer: {
            ...rental?.customer,
            ...detailState.fetched?.customer,
          },
          owner: {
            ...rental?.owner,
            ...detailState.fetched?.owner,
          },
          equipment: {
            ...rental?.equipment,
            ...detailState.fetched?.equipment,
          },
        }
      : rental;

  const showAuthAlert =
    detailState.loadedId === rentalId &&
    detailState.error &&
    (detailState.errorStatus === 401 || detailState.errorStatus === 403);

  const equipmentId = activeRecord?.equipment?._id || "";
  const equipmentHref = equipmentId
    ? `/equipment/${encodeURIComponent(equipmentId)}`
    : "";

  const hasDeliverySection = Boolean(
    activeRecord?.contactNumber ||
      activeRecord?.deliveryAddress ||
      activeRecord?.additionalNotes
  );

  return (
    <AnimatePresence>
      {isOpen && activeRecord ? (
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
            aria-labelledby="admin-rental-details-title"
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
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="admin-rental-details-title"
                    className="font-heading text-lg font-bold text-foreground sm:text-xl"
                  >
                    Platform Booking Details
                  </h2>
                  <OwnerRentalStatusBadge
                    kind="booking"
                    status={activeRecord.bookingStatus}
                    size="sm"
                  />
                </div>
                {activeRecord.bookingReference ? (
                  <p className="mt-0.5 font-mono text-xs text-text-secondary">
                    Ref: {activeRecord.bookingReference}
                  </p>
                ) : null}
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close rental details modal"
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
                  <span>Refreshing booking details from backend...</span>
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

              {/* Equipment Card */}
              <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                <div className="flex min-w-0 items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      activeRecord.equipment?.image ||
                      "/images/hero-equipment.jpg"
                    }
                    alt={activeRecord.equipment?.name || "Equipment"}
                    className="size-16 shrink-0 rounded-xl border border-border bg-surface-subtle object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-base font-bold text-foreground">
                      {activeRecord.equipment?.name}
                    </h3>
                    {activeRecord.equipment?.category ? (
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-text-secondary">
                        <Package aria-hidden="true" className="size-3.5 text-primary" />
                        <span>{activeRecord.equipment.category}</span>
                      </p>
                    ) : null}
                  </div>
                </div>

                {equipmentHref ? (
                  <Link
                    href={equipmentHref}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>Equipment Page</span>
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </Link>
                ) : null}
              </section>

              {/* Customer & Owner Parties */}
              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <User aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      Customer
                    </h3>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    {activeRecord.customer?.photoURL ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={activeRecord.customer.photoURL}
                        alt={activeRecord.customer.name}
                        className="size-10 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
                      >
                        <User className="size-4" />
                      </span>
                    )}
                    <div className="min-w-0 text-xs sm:text-sm">
                      <p className="truncate font-semibold text-foreground">
                        {activeRecord.customer?.name || "Verified Customer"}
                      </p>
                      {activeRecord.customer?.email ? (
                        <p className="inline-flex items-center gap-1 break-all text-xs text-text-secondary">
                          <Mail aria-hidden="true" className="size-3 shrink-0" />
                          <span>{activeRecord.customer.email}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <Store aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      Equipment Owner
                    </h3>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    {activeRecord.owner?.photoURL ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={activeRecord.owner.photoURL}
                        alt={activeRecord.owner.name}
                        className="size-10 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-bg text-warning"
                      >
                        <Store className="size-4" />
                      </span>
                    )}
                    <div className="min-w-0 text-xs sm:text-sm">
                      <p className="truncate font-semibold text-foreground">
                        {activeRecord.owner?.name || "Listing Owner"}
                      </p>
                      {activeRecord.owner?.email ? (
                        <p className="inline-flex items-center gap-1 break-all text-xs text-text-secondary">
                          <Mail aria-hidden="true" className="size-3 shrink-0" />
                          <span>{activeRecord.owner.email}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </section>
              </div>

              {/* Booking & Rental Schedule */}
              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <Receipt aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      Booking Information
                    </h3>
                  </div>

                  <dl className="mt-3 space-y-2.5 text-xs sm:text-sm">
                    <div>
                      <dt className="text-text-secondary">Booking ID</dt>
                      <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
                        {activeRecord._id || activeRecord.bookingReference || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-secondary">Booking Date</dt>
                      <dd className="mt-0.5 font-medium text-foreground">
                        {formatDisplayDate(activeRecord.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-secondary">Booking Status</dt>
                      <dd className="mt-1">
                        <OwnerRentalStatusBadge
                          kind="booking"
                          status={activeRecord.bookingStatus}
                          size="sm"
                        />
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <Calendar aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      Rental Information
                    </h3>
                  </div>

                  <dl className="mt-3 space-y-2.5 text-xs sm:text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <dt className="text-text-secondary">Start Date</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {formatDisplayDate(activeRecord.startDate)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-text-secondary">End Date</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {formatDisplayDate(activeRecord.endDate)}
                        </dd>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <dt className="text-text-secondary">Rental Duration</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {formatBookingDuration(
                            activeRecord.startDate,
                            activeRecord.endDate,
                            activeRecord.durationDays
                          )}
                        </dd>
                      </div>

                      {activeRecord.quantity !== null ? (
                        <div>
                          <dt className="text-text-secondary">
                            Required Quantity
                          </dt>
                          <dd className="mt-0.5 font-medium text-foreground tabular-nums">
                            {activeRecord.quantity}{" "}
                            {activeRecord.quantity === 1 ? "unit" : "units"}
                          </dd>
                        </div>
                      ) : null}
                    </div>

                    {activeRecord.rentalType ? (
                      <div>
                        <dt className="text-text-secondary">Rental Type</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {activeRecord.rentalType}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </section>
              </div>

              {/* Payment Summary */}
              <BookingPaymentSummary booking={activeRecord} />

              {/* Delivery Info */}
              {hasDeliverySection ? (
                <section className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <MapPin aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      Delivery Information
                    </h3>
                  </div>

                  <dl className="mt-3 space-y-2.5 text-xs sm:text-sm">
                    {activeRecord.contactNumber ? (
                      <div>
                        <dt className="text-text-secondary">Contact Number</dt>
                        <dd className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-foreground">
                          <Phone aria-hidden="true" className="size-3.5 text-primary" />
                          <span>{activeRecord.contactNumber}</span>
                        </dd>
                      </div>
                    ) : null}

                    {activeRecord.deliveryAddress ? (
                      <div>
                        <dt className="text-text-secondary">Delivery Address</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {activeRecord.deliveryAddress}
                        </dd>
                      </div>
                    ) : null}

                    {activeRecord.additionalNotes ? (
                      <div>
                        <dt className="text-text-secondary">Additional Notes</dt>
                        <dd className="mt-0.5 text-text-secondary">
                          {activeRecord.additionalNotes}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </section>
              ) : null}

              {/* Admin Internal Governance Note */}
              <section className="rounded-xl border border-border bg-background p-4">
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Administrator Governance Note
                </h3>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Record verification checks or dispute notes (recorded in the platform Event Log without altering Stripe payment state).
                </p>
                <div className="mt-3 space-y-2.5">
                  <textarea
                    rows={2}
                    maxLength={500}
                    disabled={isSavingNote}
                    placeholder="Add internal operational or verification note..."
                    value={
                      noteDraft.id === rentalId
                        ? noteDraft.value
                        : activeRecord.adminNote || ""
                    }
                    onChange={(e) =>
                      setNoteDraft({ id: rentalId, value: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      loading={isSavingNote}
                      onClick={async () => {
                        if (!rentalId || isSavingNote) return;
                        setIsSavingNote(true);
                        try {
                          const activeToken =
                            token ||
                            (typeof getToken === "function"
                              ? await getToken()
                              : null);
                          const val =
                            noteDraft.id === rentalId
                              ? noteDraft.value
                              : activeRecord.adminNote || "";
                          const res = await updateAdminRentalNote(
                            rentalId,
                            { adminNote: val },
                            { token: activeToken }
                          );
                          setDetailState((prev) => ({
                            ...prev,
                            loadedId: rentalId,
                            fetched: res.record,
                          }));
                          onUpdated?.();
                          showToast({
                            title: "Governance note saved",
                            description: res.message,
                            variant: "success",
                          });
                        } catch (err) {
                          showToast({
                            title: "Save failed",
                            description:
                              err instanceof Error
                                ? err.message
                                : "Unable to save rental note.",
                            variant: "error",
                          });
                        } finally {
                          setIsSavingNote(false);
                        }
                      }}
                    >
                      Save Note
                    </Button>
                  </div>
                </div>
              </section>
            </div>

            <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-background px-5 py-3.5 sm:rounded-b-2xl sm:px-6">
              <Button variant="primary" size="md" onClick={onClose}>
                Close
              </Button>
            </footer>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
