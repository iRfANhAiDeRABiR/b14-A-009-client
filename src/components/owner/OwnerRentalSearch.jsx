"use client";

import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";

export function OwnerRentalSearch({ value = "", onSearchChange }) {
  return (
    <EquipmentSearch
      id="owner-rental-search"
      value={value}
      onSearchChange={onSearchChange}
      placeholder="Search by customer or equipment name..."
      ariaLabel="Search equipment rentals"
      srLabel="Search rentals by customer name, equipment name, or booking ID"
      clearLabel="Clear rental search"
      debounceMs={400}
    />
  );
}
