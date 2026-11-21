"use client";

import { EquipmentSearch } from "@/components/equipment/EquipmentSearch";

export function FavoriteSearch({ value = "", onSearchChange }) {
  return (
    <EquipmentSearch
      id="favorite-equipment-search"
      value={value}
      onSearchChange={onSearchChange}
      placeholder="Search saved equipment by name or location..."
      ariaLabel="Search saved favorite equipment"
      srLabel="Search saved favorites by equipment name or location"
      clearLabel="Clear favorites search"
      debounceMs={300}
    />
  );
}
