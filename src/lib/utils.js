import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names conditionally without style conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
