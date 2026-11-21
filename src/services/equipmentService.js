import {
  DEMO_FEATURED_EQUIPMENT,
  DEMO_RECENTLY_ADDED_EQUIPMENT,
} from "@/data/demoEquipment";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function normalizeEquipmentList(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.equipment)
        ? payload.equipment
        : [];

  return list.filter(
    (item) => !item?.status || String(item.status).toLowerCase() === "approved"
  );
}

async function fetchEquipmentEndpoint(path, fallbackItems, limit) {
  if (!API_BASE_URL) {
    return {
      items: fallbackItems.slice(0, limit),
      source: "demo",
      error: null,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Equipment API responded with status ${response.status}`);
    }

    const json = await response.json();
    const items = normalizeEquipmentList(json).slice(0, limit);

    return {
      items,
      source: "api",
      error: null,
    };
  } catch (error) {
    return {
      items: fallbackItems.slice(0, limit),
      source: "demo",
      error:
        error instanceof Error
          ? error.message
          : "Unable to reach equipment service.",
    };
  }
}

/**
 * Fetch up to `limit` approved featured equipment items from Express/MongoDB:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/equipment/featured?limit=6
 * Falls back transparently to demo items when the backend is unavailable.
 */
export async function getFeaturedEquipment({ limit = 6 } = {}) {
  const safeLimit = Math.max(1, Number(limit) || 6);
  return fetchEquipmentEndpoint(
    `/api/equipment/featured?limit=${safeLimit}`,
    DEMO_FEATURED_EQUIPMENT,
    safeLimit
  );
}

/**
 * Fetch up to `limit` approved recently added equipment items from Express/MongoDB:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/equipment/recent?limit=4
 * Falls back transparently to demo items when the backend is unavailable.
 */
export async function getRecentlyAddedEquipment({ limit = 4 } = {}) {
  const safeLimit = Math.max(1, Number(limit) || 4);
  return fetchEquipmentEndpoint(
    `/api/equipment/recent?limit=${safeLimit}`,
    DEMO_RECENTLY_ADDED_EQUIPMENT,
    safeLimit
  );
}
