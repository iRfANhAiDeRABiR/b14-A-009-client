"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { formatDisplayDate, getRoleBadgeVariant } from "@/lib/adminUtils";
import { getAdminUserById } from "@/services/adminUserService";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function UserDetailsModal({ userRecord, onClose }) {
  const isOpen = Boolean(userRecord);
  const prefersReducedMotion = useReducedMotion();
  const { token } = useAuth();
  const closeButtonRef = React.useRef(null);

  const userId = userRecord?._id || "";

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
    if (!userId) return undefined;

    let active = true;

    getAdminUserById(userId, { token })
      .then((detailed) => {
        if (!active) return;
        setDetailState({
          loadedId: userId,
          fetched: detailed,
          error: null,
          errorStatus: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setDetailState({
          loadedId: userId,
          fetched: null,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load extended user profile.",
          errorStatus: error?.status || null,
        });
      });

    return () => {
      active = false;
    };
  }, [userId, token]);

  const isLoadingDetails = Boolean(
    userId && detailState.loadedId !== userId
  );

  const activeUser =
    detailState.loadedId === userId && detailState.fetched
      ? { ...userRecord, ...detailState.fetched }
      : userRecord;

  const showAuthAlert =
    detailState.loadedId === userId &&
    detailState.error &&
    (detailState.errorStatus === 401 || detailState.errorStatus === 403);

  return (
    <AnimatePresence>
      {isOpen && activeUser ? (
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
            aria-labelledby="admin-user-details-title"
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
            className="relative z-10 flex h-dvh w-full max-w-lg flex-col bg-surface shadow-md sm:h-auto sm:max-h-[90dvh] sm:rounded-2xl sm:border sm:border-border"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="admin-user-details-title"
                  className="font-heading text-lg font-bold text-foreground sm:text-xl"
                >
                  User Account Details
                </h2>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Read-only user record permitted for Administrator governance.
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close user details modal"
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
              {isLoadingDetails ? (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-secondary">
                  <Loader2
                    aria-hidden="true"
                    className="size-3.5 animate-spin text-primary"
                  />
                  <span>Refreshing account details from backend...</span>
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

              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-4">
                {activeUser.photoURL ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeUser.photoURL}
                    alt={`${activeUser.name} avatar`}
                    className="size-16 shrink-0 rounded-full border border-border bg-surface-subtle object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-16 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
                  >
                    <User className="size-7" />
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-heading text-base font-bold text-foreground">
                      {activeUser.name}
                    </h3>
                    <Badge
                      variant={getRoleBadgeVariant(activeUser.role)}
                      dot
                      size="sm"
                    >
                      {activeUser.role}
                    </Badge>
                    {activeUser.accountStatus ? (
                      <Badge variant="neutral" size="sm">
                        {activeUser.accountStatus}
                      </Badge>
                    ) : null}
                  </div>

                  {activeUser.email ? (
                    <p className="mt-1 inline-flex items-center gap-1.5 break-all text-xs text-text-secondary sm:text-sm">
                      <Mail aria-hidden="true" className="size-3.5 text-primary" />
                      <span>{activeUser.email}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              <dl className="grid gap-3 rounded-xl border border-border bg-background p-4 text-xs sm:grid-cols-2 sm:text-sm">
                <div>
                  <dt className="text-text-secondary">User ID</dt>
                  <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
                    {activeUser._id || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-text-secondary">Registration Date</dt>
                  <dd className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-foreground">
                    <Calendar aria-hidden="true" className="size-3.5 text-primary" />
                    <span>{formatDisplayDate(activeUser.createdAt)}</span>
                  </dd>
                </div>

                {activeUser.phone ? (
                  <div>
                    <dt className="text-text-secondary">Phone Number</dt>
                    <dd className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-foreground">
                      <Phone aria-hidden="true" className="size-3.5 text-primary" />
                      <span>{activeUser.phone}</span>
                    </dd>
                  </div>
                ) : null}

                {activeUser.address ? (
                  <div>
                    <dt className="text-text-secondary">Address</dt>
                    <dd className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-foreground">
                      <MapPin aria-hidden="true" className="size-3.5 text-primary" />
                      <span>{activeUser.address}</span>
                    </dd>
                  </div>
                ) : null}

                {activeUser.provider ? (
                  <div>
                    <dt className="text-text-secondary">Auth Provider</dt>
                    <dd className="mt-0.5 inline-flex items-center gap-1.5 font-medium capitalize text-foreground">
                      <ShieldCheck
                        aria-hidden="true"
                        className="size-3.5 text-primary"
                      />
                      <span>{activeUser.provider}</span>
                    </dd>
                  </div>
                ) : null}

                {activeUser.emailVerified !== null ? (
                  <div>
                    <dt className="text-text-secondary">Email Verification</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {activeUser.emailVerified ? "Verified" : "Unverified"}
                    </dd>
                  </div>
                ) : null}
              </dl>
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
