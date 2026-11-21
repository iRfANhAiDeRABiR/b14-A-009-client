"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardMedia,
  CardTitle,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function getAvailabilityVariant(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("available")) return "success";
  if (normalized.includes("limited") || normalized.includes("low")) return "warning";
  if (normalized.includes("unavailable") || normalized.includes("booked")) {
    return "danger";
  }
  return "neutral";
}

export function EquipmentCard({ item, index = 0 }) {
  const prefersReducedMotion = useReducedMotion();
  const id = item?._id || item?.id || "";
  const detailsHref = `/equipment/${encodeURIComponent(id)}`;
  const availabilityLabel =
    item?.availabilityStatus ||
    (item?.availableQuantity > 0 ? "Available" : "Unavailable");
  const priceDisplay =
    typeof item?.rentalPrice === "number"
      ? `৳${item.rentalPrice.toLocaleString("en-US")}`
      : `৳${item?.rentalPrice || 0}`;

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.12 },
        transition: {
          duration: 0.42,
          delay: Math.min(index * 0.06, 0.3),
          ease: [0.22, 1, 0.36, 1],
        },
        whileHover: { y: -4 },
      };

  return (
    <motion.article {...motionProps} className="h-full">
      <Card
        padding="sm"
        className="group flex h-full flex-col transition-[border-color,box-shadow] duration-200 hover:border-primary/35 hover:shadow-md"
      >
        <Link
          href={detailsHref}
          aria-label={`View details for ${item.name}`}
          className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <CardMedia>
            <Image
              src={item.image}
              alt={item.imageAlt || `${item.name} available for rent on GearNest`}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="absolute top-3 left-3">
              <Badge
                variant={getAvailabilityVariant(availabilityLabel)}
                dot
                size="sm"
                className="bg-surface/95 shadow-xs backdrop-blur-xs"
              >
                {availabilityLabel}
              </Badge>
            </div>
          </CardMedia>
        </Link>

        <CardContent className="mt-4 flex flex-1 flex-col px-1">
          <div className="flex items-center justify-between gap-2">
            <span className="type-label text-[11px] text-primary">
              {item.category}
            </span>
            <span className="rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-text-secondary">
              {item.rentalType}
            </span>
          </div>

          <CardTitle className="mt-2 line-clamp-2 min-h-[2.7rem]">
            <Link
              href={detailsHref}
              className="cursor-pointer transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
            >
              {item.name}
            </Link>
          </CardTitle>

          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-text-secondary">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{item.location}</span>
          </p>
        </CardContent>

        <CardFooter className="mt-5 border-t border-border px-1 pt-4">
          <div>
            <p className="font-heading text-xl font-bold text-primary tabular-nums">
              {priceDisplay}
            </p>
            <p className="text-xs font-medium text-text-secondary">
              per {String(item.rentalType || "Day").toLowerCase()}
            </p>
          </div>

          <Button
            href={detailsHref}
            variant="primary"
            size="sm"
            aria-label={`View details for ${item.name}`}
          >
            <span>View Details</span>
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.article>
  );
}

export function EquipmentCardSkeleton() {
  return (
    <Card padding="sm" className="flex h-full flex-col">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <div className="mt-4 flex flex-1 flex-col gap-2.5 px-1">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-28" />
          <Skeleton variant="text" className="w-14" />
        </div>
        <Skeleton variant="text" className="h-6 w-4/5" />
        <Skeleton variant="text" className="w-32" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border px-1 pt-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton variant="text" className="h-6 w-16" />
          <Skeleton variant="text" className="h-3 w-12" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </Card>
  );
}
