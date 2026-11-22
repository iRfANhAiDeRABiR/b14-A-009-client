"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import {
  getPaymentPollDelayMs,
  isApprovedStripeCheckoutUrl,
  isValidStripeSessionId,
  MAX_PAYMENT_POLL_ATTEMPTS,
  PAYMENT_VERIFICATION_STATES,
} from "@/lib/paymentUtils";
import {
  createCheckoutSession,
  getBookingPaymentStatus,
  getPaymentSession,
  verifyPaymentSession,
} from "@/services/paymentService";

export function usePaymentStatus({ mode = "verify" } = {}) {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { user, token, getToken, isLoading: isAuthLoading, isAuthenticated } =
    useAuth();

  const sessionId = String(searchParams.get("session_id") || "").trim();
  const bookingId = String(
    searchParams.get("bookingIntentId") || searchParams.get("booking_id") || ""
  ).trim();

  const [refreshTick, setRefreshTick] = React.useState(0);
  const [pollAttempts, setPollAttempts] = React.useState(0);
  const [isRetryingCheckout, setIsRetryingCheckout] = React.useState(false);
  const verifiedSyncSessionRef = React.useRef("");

  const hasLookupKey = Boolean(
    (sessionId && isValidStripeSessionId(sessionId)) || bookingId
  );

  const requestKey = `${mode}|${user?.id || user?.email || "guest"}|${sessionId}|${bookingId}|${refreshTick}|${
    token ? "auth" : "anon"
  }`;

  const [state, setState] = React.useState({
    loadedKey: "",
    verificationState: PAYMENT_VERIFICATION_STATES.VERIFYING,
    sessionData: null,
    error: null,
    errorStatus: null,
  });

  React.useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return undefined;

    if (!hasLookupKey) {
      return undefined;
    }

    let active = true;

    const hasValidSession = Boolean(sessionId && isValidStripeSessionId(sessionId));
    if (!hasValidSession && mode === "cancel") {
      return undefined;
    }

    const verifyPromise = hasValidSession
      ? getPaymentSession(sessionId, { token })
      : getBookingPaymentStatus(bookingId, { token });

    verifyPromise
      .then(async (normalized) => {
        if (!active) return;

        // If on /payment/success and webhook hasn't confirmed yet, perform one direct Stripe session verification sync
        if (
          mode === "verify" &&
          hasValidSession &&
          normalized?.verificationState === PAYMENT_VERIFICATION_STATES.PROCESSING &&
          verifiedSyncSessionRef.current !== sessionId
        ) {
          verifiedSyncSessionRef.current = sessionId;
          try {
            const synced = await verifyPaymentSession(sessionId, { token });
            if (active && synced) {
              setState({
                loadedKey: requestKey,
                verificationState: synced.verificationState,
                sessionData: synced,
                error: null,
                errorStatus: null,
              });
              return;
            }
          } catch {
            // Keep existing polling flow if direct verification encounters transient error
          }
        }

        setState({
          loadedKey: requestKey,
          verificationState: normalized.verificationState,
          sessionData: normalized,
          error: null,
          errorStatus: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        const status = error?.status || null;
        setState({
          loadedKey: requestKey,
          verificationState:
            status === 400 || status === 403 || status === 404
              ? PAYMENT_VERIFICATION_STATES.INVALID
              : PAYMENT_VERIFICATION_STATES.FAILED,
          sessionData: null,
          error:
            error instanceof Error
              ? error.message
              : "Unable to verify payment status with the backend.",
          errorStatus: status,
        });
      });

    return () => {
      active = false;
    };
  }, [
    bookingId,
    hasLookupKey,
    isAuthLoading,
    isAuthenticated,
    mode,
    requestKey,
    sessionId,
    token,
  ]);

  const isCancelIntentOnly = Boolean(
    mode === "cancel" &&
      !(sessionId && isValidStripeSessionId(sessionId)) &&
      bookingId
  );

  const isLoading = Boolean(
    hasLookupKey &&
      !isCancelIntentOnly &&
      (isAuthLoading || state.loadedKey !== requestKey)
  );

  const resolvedState = !hasLookupKey
    ? PAYMENT_VERIFICATION_STATES.INVALID
    : isCancelIntentOnly
      ? PAYMENT_VERIFICATION_STATES.PROCESSING
      : isLoading
        ? PAYMENT_VERIFICATION_STATES.VERIFYING
        : state.verificationState;

  const resolvedSessionData = isCancelIntentOnly
    ? {
        bookingId,
        bookingReference: bookingId,
        quantity: null,
        totalAmount: null,
        paymentStatus: "Pending",
        canRetryPayment: true,
      }
    : state.sessionData;

  // Bounded backoff polling ONLY on /payment/success when backend is still awaiting webhook confirmation.
  React.useEffect(() => {
    if (
      mode !== "verify" ||
      isLoading ||
      resolvedState !== PAYMENT_VERIFICATION_STATES.PROCESSING ||
      pollAttempts >= MAX_PAYMENT_POLL_ATTEMPTS
    ) {
      return undefined;
    }

    const delayMs = getPaymentPollDelayMs(pollAttempts);
    const timer = setTimeout(() => {
      setPollAttempts((prev) => prev + 1);
      setRefreshTick((prev) => prev + 1);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isLoading, mode, pollAttempts, resolvedState]);

  const retryVerification = () => {
    if (!hasLookupKey) return;
    setPollAttempts(0);
    setRefreshTick((prev) => prev + 1);
  };

  const handleRetryPayment = async () => {
    const targetBookingId = state.sessionData?.bookingId || bookingId;
    if (!targetBookingId || isRetryingCheckout) return;

    setIsRetryingCheckout(true);
    try {
      const activeToken =
        token || (typeof getToken === "function" ? await getToken() : null);

      const sessionResult = await createCheckoutSession(
        { bookingIntentId: targetBookingId },
        { token: activeToken }
      );

      if (!isApprovedStripeCheckoutUrl(sessionResult.checkoutUrl)) {
        throw new Error(
          "Server did not return a valid HTTPS Stripe Checkout URL."
        );
      }

      window.location.assign(sessionResult.checkoutUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create a new Stripe Checkout session for this booking.";
      showToast({
        title: "Payment retry unavailable",
        description: message,
        variant: "error",
      });
    } finally {
      setIsRetryingCheckout(false);
    }
  };

  return {
    sessionId,
    bookingId,
    hasLookupKey,
    loading: isLoading,
    verificationState: resolvedState,
    sessionData: resolvedSessionData,
    error: !hasLookupKey
      ? "Missing or invalid payment session reference. Please check your booking status in My Rentals."
      : state.error,
    errorStatus: state.errorStatus,
    pollAttempts,
    maxPollAttempts: MAX_PAYMENT_POLL_ATTEMPTS,
    pollingExhausted: pollAttempts >= MAX_PAYMENT_POLL_ATTEMPTS,
    isRetryingCheckout,
    retryVerification,
    handleRetryPayment,
  };
}
