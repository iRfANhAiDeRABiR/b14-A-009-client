import { sanitizeRedirectPath } from "./authValidation.js";

export const USER_ROLES = {
  CUSTOMER: "customer",
  OWNER: "owner",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  [USER_ROLES.CUSTOMER]: "Customer",
  [USER_ROLES.OWNER]: "Owner",
  [USER_ROLES.ADMIN]: "Admin",
};

export const ROLE_BADGE_VARIANTS = {
  [USER_ROLES.CUSTOMER]: "primary",
  [USER_ROLES.OWNER]: "warning",
  [USER_ROLES.ADMIN]: "success",
};

export const ROLE_DASHBOARD_HOME = {
  [USER_ROLES.CUSTOMER]: "/dashboard/customer",
  [USER_ROLES.OWNER]: "/dashboard/owner",
  [USER_ROLES.ADMIN]: "/dashboard/admin",
};

export const BACK_TO_MARKETPLACE_ITEM = {
  label: "Back to Marketplace",
  href: "/",
  icon: "marketplace",
  description: "Return to public GearNest catalog and homepage",
};

export const CUSTOMER_SIDEBAR_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard/customer",
    icon: "overview",
    description: "Summary of rentals, favorites, and customer profile",
  },
  {
    label: "My Rentals",
    href: "/dashboard/customer/my-rentals",
    icon: "rentals",
    description: "Track pending payments, active bookings, and rental history",
  },
  {
    label: "Favorites",
    href: "/dashboard/customer/favorites",
    icon: "favorites",
    description: "View and book equipment saved in your account",
  },
  {
    label: "My Profile",
    href: "/dashboard/customer/profile",
    icon: "profile",
    description: "Account identity, avatar, and verified contact settings",
  },
];

export const OWNER_SIDEBAR_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard/owner",
    icon: "overview",
    description: "Fleet listings summary, approvals, and rental demand",
  },
  {
    label: "Add Equipment",
    href: "/dashboard/owner/add-equipment",
    icon: "add",
    description: "Submit new machinery or production gear for marketplace review",
  },
  {
    label: "My Equipment",
    href: "/dashboard/owner/my-equipment",
    icon: "equipment",
    description: "Manage specs, daily rates, and inventory availability",
  },
  {
    label: "My Equipment Rental",
    href: "/dashboard/owner/rentals",
    icon: "rentals",
    description: "Review active customer bookings and delivery schedules",
  },
  {
    label: "My Profile",
    href: "/dashboard/owner/profile",
    icon: "profile",
    description: "Manage owner display profile and dispatch details",
  },
];

export const ADMIN_SIDEBAR_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard/admin",
    icon: "overview",
    description: "Marketplace moderation overview and administrative workspace",
  },
  {
    label: "All Users",
    href: "/dashboard/admin/users",
    icon: "users",
    description: "Audit registered accounts and assign marketplace roles",
  },
  {
    label: "All Equipment",
    href: "/dashboard/admin/equipment",
    icon: "equipment",
    description: "Approve, reject, or inspect submitted equipment listings",
  },
  {
    label: "All Rentals",
    href: "/dashboard/admin/rentals",
    icon: "rentals",
    description: "Monitor platform bookings, statuses, and settlements",
  },
  {
    label: "My Profile",
    href: "/dashboard/admin/profile",
    icon: "profile",
    description: "Administrator session identity and profile details",
  },
];

export const ROLE_NAV_LINKS = {
  [USER_ROLES.CUSTOMER]: CUSTOMER_SIDEBAR_ITEMS,
  [USER_ROLES.OWNER]: OWNER_SIDEBAR_ITEMS,
  [USER_ROLES.ADMIN]: ADMIN_SIDEBAR_ITEMS,
};

export function normalizeUserRole(rawRole) {
  const normalized = String(rawRole || "").trim().toLowerCase();
  if (normalized === USER_ROLES.ADMIN) return USER_ROLES.ADMIN;
  if (normalized === USER_ROLES.OWNER) return USER_ROLES.OWNER;
  return USER_ROLES.CUSTOMER;
}

export function getRoleLabel(role) {
  return ROLE_LABELS[normalizeUserRole(role)] || "Customer";
}

export function getRoleBadgeVariant(role) {
  return ROLE_BADGE_VARIANTS[normalizeUserRole(role)] || "primary";
}

export function getDashboardHomeByRole(role) {
  return ROLE_DASHBOARD_HOME[normalizeUserRole(role)] || "/dashboard/customer";
}

export function getRoleNavLinks(role) {
  return (
    ROLE_NAV_LINKS[normalizeUserRole(role)] ||
    ROLE_NAV_LINKS[USER_ROLES.CUSTOMER]
  );
}

export function isRoleAllowed(userRole, allowedRoles) {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return true;
  }
  const normalizedUserRole = normalizeUserRole(userRole);
  return allowedRoles
    .map((role) => String(role || "").trim().toLowerCase())
    .includes(normalizedUserRole);
}

export function isRoleAuthorizedForPath(userRole, pathname) {
  const cleanPath = String(pathname || "").split("?")[0];
  const normalized = normalizeUserRole(userRole);

  if (cleanPath === "/dashboard/admin" || cleanPath.startsWith("/dashboard/admin/")) {
    return normalized === USER_ROLES.ADMIN;
  }
  if (cleanPath === "/dashboard/owner" || cleanPath.startsWith("/dashboard/owner/")) {
    return normalized === USER_ROLES.OWNER;
  }
  if (
    cleanPath === "/dashboard/customer" ||
    cleanPath.startsWith("/dashboard/customer/")
  ) {
    return normalized === USER_ROLES.CUSTOMER;
  }
  return true;
}

/**
 * Resolve where an authenticated user should go after login or registration:
 * 1. Validate callbackURL as a safe internal path (blocking open redirects & /login loops).
 * 2. If callbackURL points to another role's dashboard, redirect to user's own dashboard.
 * 3. Otherwise follow valid authorized callbackURL, or default to user's role dashboard.
 */
export function resolvePostLoginRedirect(callbackURL, userRole) {
  const defaultDashboard = getDashboardHomeByRole(userRole);
  const safePath = sanitizeRedirectPath(callbackURL, "");

  if (!safePath || safePath === "/") {
    return defaultDashboard;
  }

  const basePath = safePath.split("?")[0];
  if (basePath === "/dashboard" || basePath === "/dashboard/") {
    return defaultDashboard;
  }

  if (basePath.startsWith("/dashboard/")) {
    return isRoleAuthorizedForPath(userRole, basePath)
      ? safePath
      : defaultDashboard;
  }

  return safePath;
}

const SEGMENT_LABELS = {
  dashboard: "Dashboard",
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
  "my-rentals": "My Rentals",
  favorites: "Favorites",
  profile: "My Profile",
  "add-equipment": "Add Equipment",
  "my-equipment": "My Equipment",
  edit: "Edit Equipment",
  rentals: "Rentals",
  users: "All Users",
  equipment: "All Equipment",
};

export function getDashboardBreadcrumbs(pathname = "/dashboard", role = null) {
  const cleanPath = String(pathname || "/dashboard").split("?")[0];
  const segments = cleanPath.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return [{ label: "Dashboard", href: "/dashboard", current: true }];
  }

  const normalizedRole = role ? normalizeUserRole(role) : null;
  const crumbs = [];
  let acc = "";

  segments.forEach((segment, index) => {
    acc += `/${segment}`;
    const isLast = index === segments.length - 1;
    let label =
      SEGMENT_LABELS[segment] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    if (segment === "rentals" && normalizedRole === USER_ROLES.OWNER) {
      label = "My Equipment Rental";
    } else if (segment === "rentals" && normalizedRole === USER_ROLES.ADMIN) {
      label = "All Rentals";
    }

    crumbs.push({
      label,
      href: acc,
      current: isLast,
    });
  });

  return crumbs;
}
