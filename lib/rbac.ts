export const ADMIN_ROLES = [
  "Admin",
  "Travel Manager",
  "Content Manager",
  "Support Agent",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_MODULES = [
  "destinations",
  "packages",
  "itineraries",
  "hotels",
  "activities",
  "bookings",
  "customers",
  "enquiries",
  "reviews",
  "offers",
  "coupons",
  "content",
  "users",
  "settings",
  "audit",
] as const;

export type AdminModule = (typeof ADMIN_MODULES)[number];

export type AdminAction = "CREATE" | "READ" | "UPDATE" | "ARCHIVE" | "DELETE";

// Module Display Metadata
export interface ModuleMeta {
  id: AdminModule;
  label: string;
  description: string;
  iconName: string;
}

export const ADMIN_MODULE_LIST: ModuleMeta[] = [
  { id: "destinations", label: "Destinations", description: "Countries, regions, guides & factual tourism data", iconName: "MapPin" },
  { id: "packages", label: "Packages", description: "Holiday packages, verified allotments & live pricing", iconName: "Briefcase" },
  { id: "itineraries", label: "Itineraries", description: "Day-by-day plans, transfers, meal plans & logistics", iconName: "Calendar" },
  { id: "hotels", label: "Hotels", description: "Pre-contracted partner hotels, star ratings & room allocations", iconName: "Building2" },
  { id: "activities", label: "Activities", description: "Monuments, desert safaris, cruise tours & local excursions", iconName: "Compass" },
  { id: "bookings", label: "Bookings", description: "Confirmed reservations, vouchers, status & passengers", iconName: "Ticket" },
  { id: "customers", label: "Customers", description: "Customer accounts, traveler preferences & history", iconName: "Users" },
  { id: "enquiries", label: "Enquiries", description: "Custom holiday inquiries, lead follow-ups & callback requests", iconName: "MessageSquare" },
  { id: "reviews", label: "Reviews", description: "Customer ratings, testimonials & verified traveler reviews", iconName: "Star" },
  { id: "offers", label: "Offers", description: "Seasonal deals, early-bird incentives & promotional banners", iconName: "Percent" },
  { id: "coupons", label: "Coupons", description: "Promo codes, discounts, minimum order caps & usage limits", iconName: "Tag" },
  { id: "content", label: "Content", description: "Editorial articles, travel advisories, guides & policies", iconName: "FileText" },
  { id: "users", label: "Users & Staff", description: "Employee management, roles, and administrative credentials", iconName: "UserCheck" },
  { id: "settings", label: "Settings", description: "Company registration, GST, contact info & policy defaults", iconName: "Settings" },
  { id: "audit", label: "Audit Log", description: "Full immutable log of administrative creations, edits & deletions", iconName: "ShieldCheck" },
];

// RBAC Permissions Mapping
const PERMISSIONS: Record<AdminRole, Record<AdminModule, AdminAction[]>> = {
  Admin: {
    destinations: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    packages: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    itineraries: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    hotels: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    activities: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    bookings: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    customers: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    enquiries: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    reviews: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    offers: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    coupons: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    content: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    users: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    settings: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    audit: ["READ"],
  },
  "Travel Manager": {
    destinations: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    packages: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    itineraries: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    hotels: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    activities: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    bookings: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    customers: ["READ"],
    enquiries: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    reviews: ["READ"],
    offers: ["READ"],
    coupons: ["READ"],
    content: ["READ"],
    users: [],
    settings: ["READ"],
    audit: ["READ"],
  },
  "Content Manager": {
    destinations: ["READ", "UPDATE"],
    packages: ["READ", "UPDATE"],
    itineraries: ["READ", "UPDATE"],
    hotels: ["READ"],
    activities: ["READ", "UPDATE"],
    bookings: [],
    customers: [],
    enquiries: [],
    reviews: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    offers: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    coupons: ["CREATE", "READ", "UPDATE", "ARCHIVE"],
    content: ["CREATE", "READ", "UPDATE", "ARCHIVE", "DELETE"],
    users: [],
    settings: ["READ"],
    audit: ["READ"],
  },
  "Support Agent": {
    destinations: ["READ"],
    packages: ["READ"],
    itineraries: ["READ"],
    hotels: ["READ"],
    activities: ["READ"],
    bookings: ["READ", "UPDATE"],
    customers: ["READ", "UPDATE"],
    enquiries: ["READ", "UPDATE"],
    reviews: ["READ"],
    offers: ["READ"],
    coupons: ["READ"],
    content: ["READ"],
    users: [],
    settings: ["READ"],
    audit: ["READ"],
  },
};

/**
 * Check if a role has permission for a specific action on a module
 */
export function hasPermission(
  role: string | null | undefined,
  module: AdminModule,
  action: AdminAction
): boolean {
  if (!role) return false;
  const normalizedRole = (
    role === "ADMIN" ? "Admin" : role === "AGENT" ? "Support Agent" : role
  ) as AdminRole;

  const rolePerms = PERMISSIONS[normalizedRole];
  if (!rolePerms) return false;

  const allowedActions = rolePerms[module] || [];
  return allowedActions.includes(action);
}

/**
 * Get all readable modules for a given role
 */
export function getAccessibleModules(role: string): AdminModule[] {
  const normalizedRole = (
    role === "ADMIN" ? "Admin" : role === "AGENT" ? "Support Agent" : role
  ) as AdminRole;

  const rolePerms = PERMISSIONS[normalizedRole];
  if (!rolePerms) return [];

  return (Object.keys(rolePerms) as AdminModule[]).filter(
    (mod) => (rolePerms[mod] || []).length > 0
  );
}

/**
 * Get human-readable description of role capabilities
 */
export function getRoleDescription(role: AdminRole): string {
  switch (role) {
    case "Admin":
      return "Full administrative authority across all modules, inventory, pricing, user credentials, and corporate configuration.";
    case "Travel Manager":
      return "Direct control over destinations, holiday catalogue, hotel contracts, live allotments, and tour bookings.";
    case "Content Manager":
      return "Responsible for destination editorial guides, promotional offers, discount coupons, advisories, and traveler reviews.";
    case "Support Agent":
      return "Operational handling for incoming customer travel enquiries, booking modifications, passenger assistance, and callbacks.";
    default:
      return "Standard access";
  }
}
