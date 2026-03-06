import type { AxiosError } from "axios";

export type ApiError = {
  message?: string;
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<ApiError>;
  return axiosError?.response?.data?.message || fallback;
};

export const formatDateTime = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export type DashboardScope = "ADMIN" | "SUPER_ADMIN";

export const getScopeBasePath = (scope: DashboardScope) => {
  return scope === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/dashboard/admin";
};

export const getScopeLabel = (scope: DashboardScope) => {
  return scope === "SUPER_ADMIN" ? "Super Admin" : "Admin";
};
