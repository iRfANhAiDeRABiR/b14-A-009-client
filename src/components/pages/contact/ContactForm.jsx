"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, RotateCcw, Send } from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { validateEmail } from "@/lib/authValidation";
import { submitContactMessage } from "@/services/contactService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const INQUIRY_TYPES = [
  "General Inquiry",
  "Equipment Rental",
  "Equipment Listing",
  "Payment Support",
  "Technical Support",
  "Other",
];

const INITIAL_CONTACT_VALUES = {
  name: "",
  email: "",
  inquiryType: "",
  subject: "",
  message: "",
};

function validateContactForm(values = {}) {
  const errors = {};

  const cleanName = String(values.name || "").trim();
  if (!cleanName) {
    errors.name = "Full name is required.";
  } else if (cleanName.length < 2) {
    errors.name = "Please enter your full name (at least 2 characters).";
  }

  const emailErr = validateEmail(values.email);
  if (emailErr) {
    errors.email = emailErr;
  }

  const cleanType = String(values.inquiryType || "").trim();
  if (!INQUIRY_TYPES.includes(cleanType)) {
    errors.inquiryType = "Please choose an inquiry type.";
  }

  const cleanSubject = String(values.subject || "").trim();
  if (!cleanSubject) {
    errors.subject = "Subject is required.";
  } else if (cleanSubject.length < 3) {
    errors.subject = "Please enter a brief subject (at least 3 characters).";
  }

  const cleanMessage = String(values.message || "").trim();
  if (!cleanMessage) {
    errors.message = "Message is required.";
  } else if (cleanMessage.length < 10) {
    errors.message = "Please enter a detailed message (at least 10 characters).";
  }

  return errors;
}

export function ContactForm() {
  const { showToast } = useToast();
  const submitLockRef = React.useRef(false);
  const errorBannerRef = React.useRef(null);

  const [values, setValues] = React.useState(INITIAL_CONTACT_VALUES);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleFieldChange = (field) => (event) => {
    const nextValue = event.target.value;
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting || submitLockRef.current) return;

    const errors = validateContactForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Please fix the highlighted fields before sending.");
      setTimeout(() => errorBannerRef.current?.focus(), 0);
      return;
    }

    submitLockRef.current = true;
    setFormError("");
    setIsSubmitting(true);

    try {
      await submitContactMessage(values);

      setValues(INITIAL_CONTACT_VALUES);
      setFieldErrors({});
      setIsSubmitted(true);

      showToast({
        title: "Message submitted",
        description: "Thank you for contacting GearNest.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit your contact inquiry right now.";
      setFormError(message);
      showToast({
        title: "Submission failed",
        description: message,
        variant: "error",
      });
      setTimeout(() => errorBannerRef.current?.focus(), 0);
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card padding="lg" className="rounded-2xl text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-success-border bg-success-bg text-success"
        >
          <CheckCircle2 className="size-8" />
        </span>

        <h2 className="type-section-title mt-5 text-foreground">
          Thank You for Contacting GearNest!
        </h2>
        <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
          Your message has been submitted successfully.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsSubmitted(false)}
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            <span>Send Another Message</span>
          </Button>
          <Button href="/equipment" variant="outline" size="md">
            Explore Equipment
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="rounded-2xl">
      <div className="mb-6">
        <p className="type-label text-primary">Inquiry Form</p>
        <h2 className="type-card-title mt-1.5 text-xl text-foreground">
          Send Us a Message
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Fill out the fields below and submit your inquiry directly to the GearNest platform team.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError ? (
          <div
            ref={errorBannerRef}
            tabIndex={-1}
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-xs leading-relaxed text-danger focus:outline-none focus:ring-2 focus:ring-danger/40 sm:text-sm"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <span>{formError}</span>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="contact-name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="Your full name"
            required
            disabled={isSubmitting}
            value={values.name}
            onChange={handleFieldChange("name")}
            error={fieldErrors.name}
          />

          <Input
            id="contact-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            required
            disabled={isSubmitting}
            value={values.email}
            onChange={handleFieldChange("email")}
            error={fieldErrors.email}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-inquiry-type"
              className="flex items-center gap-1 text-sm font-medium text-foreground"
            >
              <span>Inquiry Type</span>
              <span aria-hidden="true" className="text-danger">
                *
              </span>
            </label>
            <select
              id="contact-inquiry-type"
              name="inquiryType"
              required
              disabled={isSubmitting}
              value={values.inquiryType}
              onChange={handleFieldChange("inquiryType")}
              aria-invalid={Boolean(fieldErrors.inquiryType) || undefined}
              aria-describedby={
                fieldErrors.inquiryType ? "contact-inquiry-type-error" : undefined
              }
              className="min-h-11 w-full cursor-pointer rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70"
            >
              <option value="">Select inquiry type...</option>
              {INQUIRY_TYPES.map((typeOption) => (
                <option key={typeOption} value={typeOption}>
                  {typeOption}
                </option>
              ))}
            </select>
            {fieldErrors.inquiryType ? (
              <p
                id="contact-inquiry-type-error"
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-danger"
              >
                <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
                <span>{fieldErrors.inquiryType}</span>
              </p>
            ) : null}
          </div>

          <Input
            id="contact-subject"
            name="subject"
            type="text"
            label="Subject"
            placeholder="Brief summary of your question"
            required
            disabled={isSubmitting}
            value={values.subject}
            onChange={handleFieldChange("subject")}
            error={fieldErrors.subject}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-message"
            className="flex items-center gap-1 text-sm font-medium text-foreground"
          >
            <span>Message</span>
            <span aria-hidden="true" className="text-danger">
              *
            </span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={isSubmitting}
            placeholder="Describe your equipment rental question, listing inquiry, or support need..."
            value={values.message}
            onChange={handleFieldChange("message")}
            aria-invalid={Boolean(fieldErrors.message) || undefined}
            aria-describedby={
              fieldErrors.message ? "contact-message-error" : undefined
            }
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-xs transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70 sm:text-sm"
          />
          {fieldErrors.message ? (
            <p
              id="contact-message-error"
              role="alert"
              className="flex items-center gap-1.5 text-xs font-medium text-danger"
            >
              <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
              <span>{fieldErrors.message}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs text-text-secondary">
            Required fields are marked with <span className="text-danger">*</span>
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
          >
            {!isSubmitting ? <Send aria-hidden="true" className="size-4" /> : null}
            <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
