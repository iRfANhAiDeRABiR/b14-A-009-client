"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";

export function EquipmentGrid({ items }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <EquipmentCard
            key={item._id || item.id || index}
            item={item}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item, index) => (
        <EquipmentCard
          key={item._id || item.id || index}
          item={item}
          index={index}
        />
      ))}
    </motion.div>
  );
}
