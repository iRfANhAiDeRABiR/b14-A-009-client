"use client";

import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";

export function BookingHistoryPagination({ pagination, onPageChange }) {
  return (
    <EquipmentPagination
      pagination={pagination}
      onPageChange={onPageChange}
      itemLabel="bookings"
      ariaLabel="Booking history pagination"
      className="border-t border-border bg-background px-5 py-4"
    />
  );
}
