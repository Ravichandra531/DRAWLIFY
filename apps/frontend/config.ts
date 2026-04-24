/**
 * Single source of truth for all URLs used by the frontend.
 * Override via environment variables for staging / production.
 */
export const HTTP_BACKEND =
  process.env.NEXT_PUBLIC_HTTP_BACKEND ?? 'http://localhost:3001';

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080';

// Alias kept for backward compat with imports that use BACKEND_URL
export const BACKEND_URL = HTTP_BACKEND;