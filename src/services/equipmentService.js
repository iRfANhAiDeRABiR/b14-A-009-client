import {
  DEMO_CATALOG_EQUIPMENT,
  DEMO_FEATURED_EQUIPMENT,
  DEMO_RECENTLY_ADDED_EQUIPMENT,
} from "@/data/demoEquipment";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

function isApprovedEquipment(item) {
  return !item?.status || String(item.status).toLowerCase() === "approved";
}

function normalizeEquipmentItem(item) {
  if (!item || typeof item !== "object") return null;
  if (!isApprovedEquipment(item)) return null;

  const images =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images.filter(Boolean)
      : item.image
        ? [item.image]
        : [];

  return {
    ...item,
    _id: item._id || item.id,
    image: item.image || images[0] || "/images/hero-equipment.jpg",
    images: images.length > 0 ? images : ["/images/hero-equipment.jpg"],
    availableQuantity:
      typeof item.availableQuantity === "number"
        ? item.availableQuantity
        : Number(item.availableQuantity) || 0,
    rentalPrice:
      typeof item.rentalPrice === "number"
        ? item.rentalPrice
        : Number(item.rentalPrice) || 0,
    rentalType: item.rentalType || "Daily",
    rentalTerms:
      item.rentalTerms ||
      item.terms ||
      "Standard GearNest equipment inspection, safe operation, and timely return terms apply.",
    owner: item.owner || {
      name: item.ownerName || "GearNest Equipment Owner",
      photo: item.ownerPhoto || "",
      locationLabel: item.location || "",
      verifiedNote: "Marketplace Owner Profile",
    },
  };
}

function normalizeEquipmentList(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.equipment)
        ? payload.equipment
        : [];

  return list.map(normalizeEquipmentItem).filter(Boolean);
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
 * Simulate backend search, filtering, sorting, and pagination on the
 * development fallback dataset when the Express API is not available.
 */
function queryDemoEquipment(filters = {}) {
  const search = String(filters.search || "").trim().toLowerCase();
  const category = String(filters.category || "").trim();
  const rentalType = String(filters.rentalType || "").trim();
  const minPrice =
    filters.minPrice !== "" && filters.minPrice !== undefined
      ? Number(filters.minPrice)
      : null;
  const maxPrice =
    filters.maxPrice !== "" && filters.maxPrice !== undefined
      ? Number(filters.maxPrice)
      : null;
  const availability = String(filters.availability || "").trim().toLowerCase();
  const sort = String(filters.sort || "featured").trim();
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Number(filters.limit) || 9);

  let filtered = DEMO_CATALOG_EQUIPMENT.filter(isApprovedEquipment);

  if (search) {
    filtered = filtered.filter((item) => {
      const name = String(item.name || item.title || "").toLowerCase();
      const location = String(item.location || "").toLowerCase();
      const itemCategory = String(item.category || "").toLowerCase();
      return (
        name.includes(search) ||
        location.includes(search) ||
        itemCategory.includes(search)
      );
    });
  }

  if (category) {
    filtered = filtered.filter(
      (item) => String(item.category).toLowerCase() === category.toLowerCase()
    );
  }

  if (rentalType) {
    filtered = filtered.filter(
      (item) =>
        String(item.rentalType).toLowerCase() === rentalType.toLowerCase()
    );
  }

  if (minPrice !== null && !Number.isNaN(minPrice)) {
    filtered = filtered.filter((item) => Number(item.rentalPrice) >= minPrice);
  }

  if (maxPrice !== null && !Number.isNaN(maxPrice)) {
    filtered = filtered.filter((item) => Number(item.rentalPrice) <= maxPrice);
  }

  if (availability === "available") {
    filtered = filtered.filter((item) => Number(item.availableQuantity) > 0);
  } else if (availability === "unavailable") {
    filtered = filtered.filter((item) => Number(item.availableQuantity) === 0);
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_asc") {
      return Number(a.rentalPrice) - Number(b.rentalPrice);
    }
    if (sort === "price_desc") {
      return Number(b.rentalPrice) - Number(a.rentalPrice);
    }
    if (sort === "newest") {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    }
    const featuredDelta =
      Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDelta !== 0) return featuredDelta;
    return (
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
    );
  });

  const totalItems = sorted.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const data = sorted.slice(start, start + limit);

  return {
    success: true,
    data,
    pagination: {
      currentPage,
      limit,
      totalItems,
      totalPages,
    },
  };
}

/**
 * Fetch a single approved equipment record by ID:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/equipment/:id
 */
export async function getEquipmentById(id, { token } = {}) {
  const cleanId = decodeURIComponent(String(id || "")).trim();
  if (!cleanId) {
    return { item: null, notFound: true, source: "demo", error: null };
  }

  const fallbackMatch = normalizeEquipmentItem(
    DEMO_CATALOG_EQUIPMENT.find(
      (entry) => String(entry._id || entry.id) === cleanId
    )
  );

  if (!API_BASE_URL) {
    return {
      item: fallbackMatch,
      notFound: !fallbackMatch,
      source: "demo",
      error: null,
    };
  }

  try {
    const headers = { Accept: "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/equipment/${encodeURIComponent(cleanId)}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return { item: null, notFound: true, source: "api", error: null };
    }

    if (!response.ok) {
      throw new Error(`Equipment API responded with status ${response.status}`);
    }

    const json = await response.json();
    const rawItem = json?.data || json?.equipment || json;
    const item = normalizeEquipmentItem(rawItem);

    if (!item) {
      return { item: null, notFound: true, source: "api", error: null };
    }

    return {
      item,
      notFound: false,
      source: "api",
      error: null,
    };
  } catch (error) {
    return {
      item: fallbackMatch,
      notFound: !fallbackMatch,
      source: "demo",
      error:
        error instanceof Error
          ? error.message
          : "Unable to load equipment details from server.",
    };
  }
}

/**
 * Fetch paginated, filtered, and sorted approved equipment from Express/MongoDB:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/equipment?search=...&category=...&page=1&limit=9
 */
export async function getEquipment(filters = {}) {
  const params = new URLSearchParams();
  const limit = Math.max(1, Number(filters.limit) || 9);
  const page = Math.max(1, Number(filters.page) || 1);

  if (filters.search && String(filters.search).trim()) {
    params.set("search", String(filters.search).trim());
  }
  if (filters.category && String(filters.category).trim()) {
    params.set("category", String(filters.category).trim());
  }
  if (filters.rentalType && String(filters.rentalType).trim()) {
    params.set("rentalType", String(filters.rentalType).trim());
  }
  if (filters.minPrice !== "" && filters.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== "" && filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.availability && String(filters.availability).trim()) {
    params.set("availability", String(filters.availability).trim());
  }
  if (filters.sort && String(filters.sort).trim()) {
    params.set("sort", String(filters.sort).trim());
  }
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (!API_BASE_URL) {
    const demoResult = queryDemoEquipment({ ...filters, page, limit });
    return {
      items: demoResult.data,
      pagination: demoResult.pagination,
      source: "demo",
      error: null,
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/equipment?${params.toString()}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Equipment API responded with status ${response.status}`);
    }

    const json = await response.json();
    const items = normalizeEquipmentList(json);
    const totalItems =
      typeof json?.pagination?.totalItems === "number"
        ? json.pagination.totalItems
        : items.length;
    const responseLimit =
      typeof json?.pagination?.limit === "number" ? json.pagination.limit : limit;
    const totalPages =
      typeof json?.pagination?.totalPages === "number"
        ? json.pagination.totalPages
        : totalItems === 0
          ? 0
          : Math.ceil(totalItems / responseLimit);

    return {
      items,
      pagination: {
        currentPage: json?.pagination?.currentPage || page,
        limit: responseLimit,
        totalItems,
        totalPages,
      },
      source: "api",
      error: null,
    };
  } catch (error) {
    const demoResult = queryDemoEquipment({ ...filters, page, limit });
    return {
      items: demoResult.data,
      pagination: demoResult.pagination,
      source: "demo",
      error:
        error instanceof Error
          ? error.message
          : "Unable to load equipment from server.",
    };
  }
}

/**
 * Fetch up to `limit` approved featured equipment items from Express/MongoDB:
 * GET {NEXT_PUBLIC_API_BASE_URL}/api/equipment/featured?limit=6
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
 */
export async function getRecentlyAddedEquipment({ limit = 4 } = {}) {
  const safeLimit = Math.max(1, Number(limit) || 4);
  return fetchEquipmentEndpoint(
    `/api/equipment/recent?limit=${safeLimit}`,
    DEMO_RECENTLY_ADDED_EQUIPMENT,
    safeLimit
  );
}
