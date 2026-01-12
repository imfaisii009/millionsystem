export type { Database } from "./database.types";

// User related types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

// Common component props
export interface ChildrenProps {
  children: React.ReactNode;
}
