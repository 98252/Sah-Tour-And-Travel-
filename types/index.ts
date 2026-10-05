export type ButtonVariant =
  | "default"
  | "luxury"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

export type BadgeVariant =
  | "default"
  | "verified"
  | "luxury"
  | "teal"
  | "outline"
  | "destructive"
  | "warning"
  | "subtle";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface TravelSearchQuery {
  destination?: string;
  departureCity?: string;
  travelDate?: string;
  duration?: string;
  category?: string;
  budget?: number;
}
