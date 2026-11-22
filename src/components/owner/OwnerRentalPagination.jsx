"use client";

import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";

export function OwnerRentalPagination({ pagination, onPageChange }) {
  return (
    <EquipmentPagination
      pagination={pagination}
      onPageChange={onPageChange}
      itemLabel="rental bookings"
      ariaLabel="Owner equipment rentals pagination"
      className="border-t border-border bg-background px-5 py-4"
    />
  );
}
