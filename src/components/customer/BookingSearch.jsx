"use client";

import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";

export function BookingSearch({ value = "", onSearchChange }) {
  return (
    <EquipmentSearch
      id="booking-history-search"
      value={value}
      onSearchChange={onSearchChange}
      placeholder="Search by equipment name or booking ID..."
      ariaLabel="Search rental history"
      srLabel="Search rental bookings by equipment name or booking reference ID"
      clearLabel="Clear booking search"
      debounceMs={400}
    />
  );
}
