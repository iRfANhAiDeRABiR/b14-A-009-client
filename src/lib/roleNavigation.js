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

export const ROLE_NAV_LINKS = {
  [USER_ROLES.CUSTOMER]: [
    {
      label: "Customer Dashboard",
      href: "/dashboard/customer",
      description: "Overview of active rentals and account activity",
    },
    {
      label: "My Rentals",
      href: "/dashboard/customer/rentals",
      description: "Track pending payments, active bookings, and past hires",
    },
    {
      label: "Favorites",
      href: "/dashboard/customer/favorites",
      description: "Saved equipment ready for quick booking",
    },
    {
      label: "Profile",
      href: "/dashboard/customer/profile",
      description: "Account identity, photo, and contact details",
    },
  ],
  [USER_ROLES.OWNER]: [
    {
      label: "Owner Dashboard",
      href: "/dashboard/owner",
      description: "Inventory status, rental volume, and earnings overview",
    },
    {
      label: "Add Equipment",
      href: "/dashboard/owner/add-equipment",
      description: "Publish a new machine or gear listing for approval",
    },
    {
      label: "My Equipment",
      href: "/dashboard/owner/my-equipment",
      description: "Edit specs, quantities, and pricing across your fleet",
    },
    {
      label: "My Equipment Rental",
      href: "/dashboard/owner/rentals",
      description: "Monitor incoming customer reservations and schedules",
    },
    {
      label: "My Profile",
      href: "/dashboard/owner/profile",
      description: "Manage owner display identity and contact details",
    },
  ],
  [USER_ROLES.ADMIN]: [
    {
      label: "Admin Dashboard",
      href: "/dashboard/admin",
      description: "Platform analytics, moderation queue, and KPI summary",
    },
    {
      label: "All Users",
      href: "/dashboard/admin/users",
      description: "Review accounts and manage Customer, Owner, or Admin roles",
    },
    {
      label: "All Equipment",
      href: "/dashboard/admin/equipment",
      description: "Approve, reject, or audit marketplace equipment listings",
    },
    {
      label: "All Rentals",
      href: "/dashboard/admin/rentals",
      description: "Inspect platform-wide bookings and settlement statuses",
    },
    {
      label: "My Profile",
      href: "/dashboard/admin/profile",
      description: "Administrator profile and session overview",
    },
  ],
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
  return ROLE_NAV_LINKS[normalizeUserRole(role)] || ROLE_NAV_LINKS[USER_ROLES.CUSTOMER];
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
  const path = String(pathname || "");
  const normalized = normalizeUserRole(userRole);

  if (path.startsWith("/dashboard/admin")) {
    return normalized === USER_ROLES.ADMIN;
  }
  if (path.startsWith("/dashboard/owner")) {
    return normalized === USER_ROLES.OWNER;
  }
  if (path.startsWith("/dashboard/customer")) {
    return normalized === USER_ROLES.CUSTOMER;
  }
  return true;
}
