// API endpoints
export const API_ENDPOINTS = {
  HEALTH: "/api/health",
} as const;

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  ABOUT: "/about",
  PRICING: "/pricing",
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.SETTINGS,
] as const;

// Auth routes that should redirect to dashboard if authenticated
export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
] as const;
