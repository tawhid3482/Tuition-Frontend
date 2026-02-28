export type AppUserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "USER";

const rolePathMap: Record<AppUserRole, string> = {
  SUPER_ADMIN: "/dashboard/super-admin",
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  USER: "/dashboard/user",
};

export const normalizeUserRole = (role: unknown): AppUserRole | null => {
  if (typeof role !== "string") {
    return null;
  }

  const normalized = role.trim().toUpperCase();

  if (normalized === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (normalized === "ADMIN") return "ADMIN";
  if (normalized === "MANAGER") return "MANAGER";
  if (normalized === "USER") return "USER";

  return null;
};

export const getDashboardPathByRole = (role: unknown) => {
  const normalized = normalizeUserRole(role);
  return normalized ? rolePathMap[normalized] : "/dashboard/user";
};
