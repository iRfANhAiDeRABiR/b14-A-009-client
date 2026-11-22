"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CalendarCheck,
  ChevronRight,
  Lock,
  MapPin,
  PackageSearch,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { buildLoginRedirectUrl } from "@/lib/authBoundary";
import { formatCurrencyBDT } from "@/lib/rentalPricing";
import { useEquipmentDetails } from "@/hooks/useEquipmentDetails";
import { useFavorites } from "@/hooks/useFavorites";
import { BookingModal } from "@/components/equipment/BookingModal";
import { EquipmentGallery } from "@/components/equipment/EquipmentGallery";
import { EquipmentOwnerCard } from "@/components/equipment/EquipmentOwnerCard";
import { EquipmentSpecifications } from "@/components/equipment/EquipmentSpecifications";
import { FavoriteButton } from "@/components/equipment/FavoriteButton";
import { RentalTerms } from "@/components/equipment/RentalTerms";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

function getAvailabilityBadge(quantity, statusLabel) {
  if (quantity <= 0) {
    return { label: "Unavailable", variant: "danger" };
  }
  const normalized = String(statusLabel || "").toLowerCase();
  if (normalized.includes("limited")) {
    return { label: "Limited Stock", variant: "warning" };
  }
  return { label: "Available", variant: "success" };
}

function EquipmentDetailsSkeleton() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <Skeleton variant="text" className="mb-6 w-56" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card padding="sm" className="rounded-2xl">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="aspect-[4/3] rounded-lg" />
              </div>
            </Card>
          </div>
          <div className="space-y-4 lg:col-span-5">
            <Card className="rounded-2xl space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton variant="text" className="h-9 w-4/5" />
              <Skeleton variant="text" className="w-40" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function EquipmentDetails({ equipmentId }) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);

  const auth = useAuth();
  const { item, notFound, source, error, loading, retry } =
    useEquipmentDetails(equipmentId, {
      token: auth.token,
      authLoading: auth.isLoading || !auth.isAuthenticated,
    });

  const currentPath = `/equipment/${encodeURIComponent(equipmentId || "")}`;
  const loginRedirectUrl = buildLoginRedirectUrl(currentPath);

  const {
    isFavorite,
    isLoading: favoriteLoading,
    isNonCustomerRole,
    errorMessage: favoriteError,
    toggleFavorite,
  } = useFavorites({
    equipmentId: item?._id || equipmentId,
    redirectPath: currentPath,
  });

  React.useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace(loginRedirectUrl);
    }
  }, [auth.isAuthenticated, auth.isLoading, loginRedirectUrl, router]);

  if (auth.isLoading || !auth.isAuthenticated || loading) {
    return <EquipmentDetailsSkeleton />;
  }

  if (notFound || !item) {
    return (
      <section className="py-16 sm:py-24">
        <Container size="sm">
          <Card padding="lg" className="flex flex-col items-center rounded-2xl text-center">
            <span
              aria-hidden="true"
              className="flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
            >
              <PackageSearch className="size-7" />
            </span>
            <h1 className="type-page-title mt-5 text-foreground">
              Equipment not found
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              The requested equipment item could not be found or is not approved
              for public listing.
            </p>
            {error ? (
              <p className="mt-2 text-xs text-warning">{error}</p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href="/equipment" variant="primary" size="md">
                <ArrowLeft aria-hidden="true" className="size-4" />
                <span>Browse All Equipment</span>
              </Button>
              <Button variant="outline" size="md" onClick={retry}>
                <RefreshCw aria-hidden="true" className="size-4" />
                <span>Retry</span>
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    );
  }

  const availability = getAvailabilityBadge(
    item.availableQuantity,
    item.availabilityStatus
  );
  const canBook =
    item.availableQuantity > 0 &&
    String(item.status || "approved").toLowerCase() === "approved";

  const entranceProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <>
      <section className="py-8 sm:py-12">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-text-secondary">
              <li>
                <Link
                  href="/"
                  className="cursor-pointer transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5 text-muted" />
              </li>
              <li>
                <Link
                  href="/equipment"
                  className="cursor-pointer transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
                >
                  All Equipment
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5 text-muted" />
              </li>
              <li aria-current="page" className="truncate font-semibold text-primary">
                {item.name}
              </li>
            </ol>
          </nav>

          {/* Auth boundary & API fallback status notices */}
          {!auth.isAuthenticated ? (
            <div
              role="note"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-secondary/50 px-4 py-3 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2.5 text-foreground">
                <Lock aria-hidden="true" className="size-4 shrink-0 text-primary" />
                <span>
                  <strong className="font-semibold">Private Route Boundary:</strong>{" "}
                  Authentication will enforce sign-in here in Commit 08. Saving
                  favorites and creating bookings fail closed until you sign in.
                </span>
              </div>
              <Button href={loginRedirectUrl} variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-sm text-warning"
            >
              <div className="flex items-center gap-2">
                <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
                <span>
                  Live equipment endpoint unavailable ({error}). Displaying
                  development fallback data.
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={retry}>
                <RefreshCw aria-hidden="true" className="size-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          ) : null}

          {/* Unified 2-Column Product Layout with Side-by-Side Row Alignment */}
          <motion.div
            {...entranceProps}
            className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8"
          >
            {/* Row 1: Image Gallery (Left) & Pricing / Booking Actions (Right) */}
            <div className="min-w-0 lg:col-span-7">
              <EquipmentGallery
                images={item.images}
                name={item.name}
                alt={item.imageAlt}
                className="h-full"
              />
            </div>

            <div className="min-w-0 lg:col-span-5">
              <Card className="flex h-full flex-col justify-between gap-5 rounded-2xl">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="primary" size="md">
                      {item.category}
                    </Badge>
                    <Badge variant={availability.variant} dot size="md">
                      {availability.label}
                    </Badge>
                  </div>

                  <h1 className="type-page-title mt-4 text-foreground">
                    {item.name}
                  </h1>

                  <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary">
                    <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    <span>{item.location}</span>
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-background p-4">
                    <div>
                      <p className="text-xs font-medium text-text-secondary">
                        Rental Price
                      </p>
                      <p className="mt-0.5 font-heading text-2xl font-bold text-primary tabular-nums">
                        {formatCurrencyBDT(item.rentalPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-secondary">
                        Rental Type
                      </p>
                      <p className="mt-1 font-heading text-base font-semibold text-foreground">
                        {item.rentalType}
                      </p>
                    </div>
                    <div className="col-span-2 border-t border-border pt-2.5 text-xs text-text-secondary">
                      Available Quantity:{" "}
                      <span className="font-semibold text-foreground tabular-nums">
                        {item.availableQuantity}{" "}
                        {item.availableQuantity === 1 ? "unit" : "units"}
                      </span>
                      {source === "demo" ? (
                        <span className="ml-2 rounded bg-surface-subtle px-2 py-0.5 text-[11px] font-medium">
                          Demo Record
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={!canBook}
                      onClick={() => setBookingModalOpen(true)}
                    >
                      <CalendarCheck aria-hidden="true" className="size-4" />
                      <span>{canBook ? "Book Now" : "Currently Unavailable"}</span>
                    </Button>

                    <FavoriteButton
                      isFavorite={isFavorite}
                      isLoading={favoriteLoading}
                      disabled={isNonCustomerRole}
                      helperText={
                        isNonCustomerRole
                          ? "Favorites are only available to Customer accounts."
                          : ""
                      }
                      errorMessage={favoriteError}
                      onClick={toggleFavorite}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Row 2: Equipment Description (Left) & Owner Information (Right) */}
            <div className="min-w-0 lg:col-span-7">
              <Card className="flex h-full flex-col rounded-2xl">
                <h2 className="type-card-title text-foreground">
                  Equipment Description
                </h2>
                <p className="type-body mt-3 text-text-secondary">
                  {item.description}
                </p>
              </Card>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <EquipmentOwnerCard
                owner={item.owner}
                location={item.location}
                isAuthenticated={auth.isAuthenticated}
                className="h-full"
              />
            </div>

            {/* Row 3: Equipment Specifications (Left) & Rental Terms (Right) */}
            <div className="min-w-0 lg:col-span-7">
              <EquipmentSpecifications equipment={item} className="h-full" />
            </div>

            <div className="min-w-0 lg:col-span-5">
              <RentalTerms
                rentalTerms={item.rentalTerms}
                rentalType={item.rentalType}
                className="h-full"
              />
            </div>
          </motion.div>
        </Container>
      </section>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        equipment={item}
        auth={auth}
        equipmentPath={currentPath}
      />
    </>
  );
}
