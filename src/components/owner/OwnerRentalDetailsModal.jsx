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
  Pencil,
  Phone,
  Receipt,
  User,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  formatBookingDuration,
  formatDisplayDate,
} from "@/lib/ownerUtils";
import { getOwnerRentalById } from "@/services/bookingService";
import { BookingPaymentSummary } from "@/components/customer/BookingPaymentSummary";
import { OwnerRentalStatusBadge } from "@/components/owner/OwnerRentalStatusBadge";
import { Button } from "@/components/ui/Button";

export function OwnerRentalDetailsModal({ rental, onClose }) {
  const isOpen = Boolean(rental);
  const prefersReducedMotion = useReducedMotion();
  const { token } = useAuth();
  const closeButtonRef = React.useRef(null);

  const rentalId = rental?._id || "";

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
    if (!rentalId) return undefined;

    let active = true;

    getOwnerRentalById(rentalId, { token })
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
              : "Unable to load supplementary booking details.",
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
  const publicListingHref = equipmentId
    ? `/equipment/${encodeURIComponent(equipmentId)}`
    : "";
  const editListingHref = equipmentId
    ? `/dashboard/owner/my-equipment/edit/${encodeURIComponent(equipmentId)}`
    : "";

  const hasDeliverySection = Boolean(
    activeRecord?.deliveryAddress || activeRecord?.additionalNotes
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
            aria-labelledby="owner-rental-details-title"
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
                    id="owner-rental-details-title"
                    className="font-heading text-lg font-bold text-foreground sm:text-xl"
                  >
                    Rental Booking Details
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
                  <span>Refreshing booking details from server...</span>
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

              {/* Equipment Information */}
              <section
                aria-labelledby="owner-rental-equipment-heading"
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background p-4"
              >
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
                    <h3
                      id="owner-rental-equipment-heading"
                      className="truncate font-heading text-base font-bold text-foreground"
                    >
                      {activeRecord.equipment?.name}
                    </h3>
                    {activeRecord.equipment?.category ? (
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-text-secondary">
                        <Package
                          aria-hidden="true"
                          className="size-3.5 text-primary"
                        />
                        <span>{activeRecord.equipment.category}</span>
                      </p>
                    ) : null}
                    {activeRecord.equipment?.location ? (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-secondary">
                        <MapPin
                          aria-hidden="true"
                          className="size-3.5 text-primary"
                        />
                        <span>{activeRecord.equipment.location}</span>
                      </p>
                    ) : null}
                    {equipmentId ? (
                      <p className="mt-0.5 font-mono text-[11px] text-muted">
                        Listing ID: {equipmentId}
                      </p>
                    ) : null}
                  </div>
                </div>

                {editListingHref || publicListingHref ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {editListingHref ? (
                      <Link
                        href={editListingHref}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Pencil aria-hidden="true" className="size-3.5" />
                        <span>Manage Listing</span>
                      </Link>
                    ) : null}
                    {publicListingHref ? (
                      <Link
                        href={publicListingHref}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span>Public View</span>
                        <ExternalLink aria-hidden="true" className="size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </section>

              {/* Customer Information */}
              <section
                aria-labelledby="owner-rental-customer-heading"
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center gap-2 border-b border-border pb-2.5">
                  <User aria-hidden="true" className="size-4 text-primary" />
                  <h3
                    id="owner-rental-customer-heading"
                    className="font-heading text-sm font-semibold text-foreground"
                  >
                    Customer Information
                  </h3>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3.5">
                  {activeRecord.customer?.photoURL ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={activeRecord.customer.photoURL}
                      alt={activeRecord.customer.name || "Customer avatar"}
                      className="size-12 shrink-0 rounded-full border border-border bg-surface-subtle object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
                    >
                      <User className="size-5" />
                    </span>
                  )}

                  <dl className="grid flex-1 gap-2.5 text-xs sm:grid-cols-2 sm:text-sm">
                    <div>
                      <dt className="text-text-secondary">Customer Name</dt>
                      <dd className="mt-0.5 font-semibold text-foreground">
                        {activeRecord.customer?.name || "Verified Customer"}
                      </dd>
                    </div>

                    {activeRecord.customer?.email ? (
                      <div>
                        <dt className="text-text-secondary">Customer Email</dt>
                        <dd className="mt-0.5 inline-flex items-center gap-1.5 break-all font-medium text-foreground">
                          <Mail
                            aria-hidden="true"
                            className="size-3.5 shrink-0 text-primary"
                          />
                          <span>{activeRecord.customer.email}</span>
                        </dd>
                      </div>
                    ) : null}

                    {activeRecord.contactNumber ? (
                      <div>
                        <dt className="text-text-secondary">Contact Number</dt>
                        <dd className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-foreground">
                          <Phone
                            aria-hidden="true"
                            className="size-3.5 shrink-0 text-primary"
                          />
                          <span>{activeRecord.contactNumber}</span>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </section>

              {/* Booking & Rental Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <section
                  aria-labelledby="owner-rental-booking-info-heading"
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <Receipt
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    <h3
                      id="owner-rental-booking-info-heading"
                      className="font-heading text-sm font-semibold text-foreground"
                    >
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

                <section
                  aria-labelledby="owner-rental-period-heading"
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <Calendar
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    <h3
                      id="owner-rental-period-heading"
                      className="font-heading text-sm font-semibold text-foreground"
                    >
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
                        <dt className="text-text-secondary">Duration</dt>
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

              {/* Delivery Information */}
              {hasDeliverySection ? (
                <section
                  aria-labelledby="owner-rental-delivery-heading"
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-2.5">
                    <MapPin
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    <h3
                      id="owner-rental-delivery-heading"
                      className="font-heading text-sm font-semibold text-foreground"
                    >
                      Delivery Information
                    </h3>
                  </div>

                  <dl className="mt-3 space-y-2.5 text-xs sm:text-sm">
                    {activeRecord.deliveryAddress ? (
                      <div>
                        <dt className="text-text-secondary">
                          Delivery Address
                        </dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {activeRecord.deliveryAddress}
                        </dd>
                      </div>
                    ) : null}

                    {activeRecord.additionalNotes ? (
                      <div>
                        <dt className="text-text-secondary">
                          Additional Notes
                        </dt>
                        <dd className="mt-0.5 text-text-secondary">
                          {activeRecord.additionalNotes}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </section>
              ) : null}
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
