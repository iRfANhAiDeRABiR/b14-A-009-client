import { EquipmentCardSkeleton } from "@/components/equipment/EquipmentCard";

export function EquipmentLoading({ count = 9 }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading equipment inventory"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <EquipmentCardSkeleton key={index} />
      ))}
    </div>
  );
}
