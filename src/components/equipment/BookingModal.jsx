"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Calendar, Lock, ShieldCheck, X } from "lucide-react";

import { buildLoginRedirectUrl } from "@/lib/authBoundary";
import {
  calculateRentalEstimate,
  getTodayDateString,
} from "@/lib/rentalPricing";
import {
  checkBookingAvailability,
  createBooking,
} from "@/services/bookingService";
import { useToast } from "@/context/ToastContext";
import { BookingSummary } from "@/components/equipment/BookingSummary";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function validatePhoneNumber(rawPhone) {
  const trimmed = String(rawPhone || "").trim();
  if (!trimmed) return "Contact number is required.";
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return "Enter a valid phone number (7 to 15 digits, e.g., 01XXXXXXXXX).";
  }
  if (!/^\+?[0-9\s\-()]+$/.test(trimmed)) {
    return "Contact number contains invalid characters.";
  }
  return "";
}

export function BookingModal({
  isOpen,
  onClose,
  equipment,
  auth,
  equipmentPath,
}) {
  const prefersReducedMotion = useReducedMotion();
  const { showToast } = useToast();
  const closeButtonRef = React.useRef(null);
  const errorBannerRef = React.useRef(null);

  const today = React.useMemo(() => getTodayDateString(), []);
  const maxAvailable = Math.max(0, Number(equipment?.availableQuantity) || 0);

  const [formValues, setFormValues] = React.useState({
    startDate: "",
    endDate: "",
    quantity: "1",
    contactNumber: "",
    deliveryAddress: "",
    additionalNotes: "",
  });
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [submissionError, setSubmissionError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Manage keyboard Escape, body scroll lock, and initial focus when modal opens.
  React.useEffect(() => {
    if (!isOpen) return;

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

  const parsedQuantity = Number(formValues.quantity);

  const estimate = React.useMemo(
    () =>
      calculateRentalEstimate({
        rentalPrice: equipment?.rentalPrice || 0,
        rentalType: equipment?.rentalType || "Daily",
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        quantity: Number.isInteger(parsedQuantity) ? parsedQuantity : 0,
      }),
    [
      equipment?.rentalPrice,
      equipment?.rentalType,
      formValues.endDate,
      formValues.startDate,
      parsedQuantity,
    ]
  );

  const setField = (field) => (event) => {
    const value = event.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (submissionError) {
      setSubmissionError("");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formValues.startDate) {
      errors.startDate = "Rental start date is required.";
    } else if (formValues.startDate < today) {
      errors.startDate = "Rental start date cannot be in the past.";
    }

    if (!formValues.endDate) {
      errors.endDate = "Rental end date is required.";
    } else if (formValues.endDate < today) {
      errors.endDate = "Rental end date cannot be in the past.";
    } else if (
      formValues.startDate &&
      formValues.endDate < formValues.startDate
    ) {
      errors.endDate = "Rental end date cannot be earlier than start date.";
    }

    const qtyNum = Number(formValues.quantity);
    if (formValues.quantity === "" || Number.isNaN(qtyNum)) {
      errors.quantity = "Required quantity must be a number.";
    } else if (!Number.isInteger(qtyNum) || qtyNum < 1) {
      errors.quantity = "Quantity must be a positive whole number (at least 1).";
    } else if (qtyNum > maxAvailable) {
      errors.quantity = `Only ${maxAvailable} ${
        maxAvailable === 1 ? "unit is" : "units are"
      } currently available.`;
    }

    const phoneError = validatePhoneNumber(formValues.contactNumber);
    if (phoneError) {
      errors.contactNumber = phoneError;
    }

    const trimmedAddress = formValues.deliveryAddress.trim();
    if (!trimmedAddress) {
      errors.deliveryAddress = "Delivery address is required.";
    } else if (trimmedAddress.length < 5) {
      errors.deliveryAddress =
        "Please provide a complete delivery address (at least 5 characters).";
    }

    return errors;
  };

  const handleConfirmBooking = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmissionError("Please fix the highlighted fields before continuing.");
      setTimeout(() => errorBannerRef.current?.focus(), 0);
      return;
    }

    if (String(equipment?.status || "").toLowerCase() !== "approved") {
      setSubmissionError("Only approved equipment listings can be booked.");
      return;
    }

    setSubmissionError("");
    setIsSubmitting(true);

    try {
      const activeToken =
        auth?.token ||
        (typeof auth?.getToken === "function" ? await auth.getToken() : null);

      if (!auth?.isAuthenticated || !activeToken) {
        const message =
          "Authentication required: please log in to check live availability and reserve equipment.";
        setSubmissionError(message);
        showToast({
          title: "Sign in required",
          description: "Log in to your GearNest customer account to book.",
          variant: "warning",
        });
        setTimeout(() => errorBannerRef.current?.focus(), 0);
        return;
      }

      const availability = await checkBookingAvailability({
        equipmentId: equipment._id,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        quantity: Number(formValues.quantity),
        token: activeToken,
      });

      if (availability && availability.available === false) {
        const msg =
          availability.message ||
          "This equipment is unavailable for the selected dates and quantity.";
        setSubmissionError(msg);
        showToast({
          title: "Equipment unavailable",
          description: msg,
          variant: "warning",
        });
        return;
      }

      const bookingResult = await createBooking({
        equipmentId: equipment._id,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        quantity: Number(formValues.quantity),
        contactNumber: formValues.contactNumber.trim(),
        deliveryAddress: formValues.deliveryAddress.trim(),
        additionalNotes: formValues.additionalNotes.trim(),
        token: activeToken,
      });

      if (
        bookingResult?.checkoutUrl &&
        (/^https:\/\//i.test(bookingResult.checkoutUrl) ||
          bookingResult.checkoutUrl.startsWith("/"))
      ) {
        window.location.assign(bookingResult.checkoutUrl);
        return;
      }

      showToast({
        title: "Booking created",
        description:
          "Reservation created. Stripe checkout URL is not available yet.",
        variant: "neutral",
      });
      setSubmissionError(
        "Booking was submitted, but no Stripe checkoutUrl was returned by the server yet."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to complete booking request.";
      setSubmissionError(message);
      showToast({
        title: "Booking not completed",
        description: message,
        variant: "error",
      });
      setTimeout(() => errorBannerRef.current?.focus(), 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginHref = buildLoginRedirectUrl(equipmentPath);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          role="presentation"
        >
          {/* Scrim */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!isSubmitting) onClose();
            }}
            className="fixed inset-0 bg-[#18221E]/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, scale: 0.97, y: 12 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.97, y: 8 }
            }
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-md"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="type-label text-[11px] text-primary">
                  Rental Reservation
                </p>
                <h2
                  id="booking-modal-title"
                  className="type-card-title mt-0.5 text-xl text-foreground"
                >
                  Reserve This Equipment
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                aria-label="Close booking modal"
                className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <form
              onSubmit={handleConfirmBooking}
              noValidate
              className="flex flex-1 flex-col overflow-y-auto"
            >
              <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-12">
                {/* Left: Form Inputs */}
                <div className="space-y-4 lg:col-span-7">
                  {submissionError ? (
                    <div
                      ref={errorBannerRef}
                      tabIndex={-1}
                      role="alert"
                      className="rounded-xl border border-danger-border bg-danger-bg p-3.5 text-xs leading-relaxed text-danger focus:outline-none focus:ring-2 focus:ring-danger/40"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0"
                        />
                        <div className="space-y-1.5">
                          <p className="font-semibold">{submissionError}</p>
                          {!auth?.isAuthenticated ? (
                            <Link
                              href={loginHref}
                              className="inline-flex items-center gap-1 font-semibold underline hover:no-underline"
                            >
                              <Lock aria-hidden="true" className="size-3" />
                              <span>Go to Sign In</span>
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      id="booking-start-date"
                      name="startDate"
                      type="date"
                      label="Rental Start Date"
                      required
                      min={today}
                      value={formValues.startDate}
                      onChange={setField("startDate")}
                      error={fieldErrors.startDate}
                      leftIcon={<Calendar className="size-4" />}
                    />

                    <Input
                      id="booking-end-date"
                      name="endDate"
                      type="date"
                      label="Rental End Date"
                      required
                      min={formValues.startDate || today}
                      value={formValues.endDate}
                      onChange={setField("endDate")}
                      error={fieldErrors.endDate}
                      leftIcon={<Calendar className="size-4" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      id="booking-quantity"
                      name="quantity"
                      type="number"
                      label="Required Quantity"
                      required
                      min={1}
                      max={maxAvailable}
                      step={1}
                      inputMode="numeric"
                      value={formValues.quantity}
                      onChange={setField("quantity")}
                      error={fieldErrors.quantity}
                      helperText={`Max available: ${maxAvailable} ${
                        maxAvailable === 1 ? "unit" : "units"
                      }`}
                    />

                    <Input
                      id="booking-contact-number"
                      name="contactNumber"
                      type="tel"
                      label="Contact Number"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formValues.contactNumber}
                      onChange={setField("contactNumber")}
                      error={fieldErrors.contactNumber}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="booking-delivery-address"
                      className="flex items-center gap-1 text-sm font-medium text-foreground"
                    >
                      <span>Delivery Address</span>
                      <span aria-hidden="true" className="text-danger">
                        *
                      </span>
                    </label>
                    <textarea
                      id="booking-delivery-address"
                      name="deliveryAddress"
                      rows={3}
                      required
                      placeholder="Street, area, city, and site access instructions..."
                      value={formValues.deliveryAddress}
                      onChange={setField("deliveryAddress")}
                      aria-invalid={
                        Boolean(fieldErrors.deliveryAddress) || undefined
                      }
                      aria-describedby={
                        fieldErrors.deliveryAddress
                          ? "booking-delivery-address-error"
                          : undefined
                      }
                      className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                    />
                    {fieldErrors.deliveryAddress ? (
                      <p
                        id="booking-delivery-address-error"
                        role="alert"
                        className="text-xs font-medium text-danger"
                      >
                        {fieldErrors.deliveryAddress}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="booking-additional-notes"
                      className="text-sm font-medium text-foreground"
                    >
                      Additional Notes{" "}
                      <span className="text-xs font-normal text-text-secondary">
                        (Optional)
                      </span>
                    </label>
                    <textarea
                      id="booking-additional-notes"
                      name="additionalNotes"
                      rows={2}
                      placeholder="Preferred delivery window or operator notes..."
                      value={formValues.additionalNotes}
                      onChange={setField("additionalNotes")}
                      className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Right: Live Summary + Calculator */}
                <div className="lg:col-span-5">
                  <BookingSummary
                    equipmentName={equipment?.name}
                    startDate={formValues.startDate}
                    endDate={formValues.endDate}
                    quantity={parsedQuantity}
                    estimate={estimate}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                <p className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                  <ShieldCheck
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary"
                  />
                  <span>
                    Backend verifies availability &amp; pricing before Stripe
                    checkout
                  </span>
                </p>

                <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    disabled={isSubmitting}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={isSubmitting}
                    disabled={maxAvailable <= 0}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
