export const SITE_NAME = "TR Tuition";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_API?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";
