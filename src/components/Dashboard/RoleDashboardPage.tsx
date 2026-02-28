"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/src/hooks/useAuth";
import { AppUserRole, getDashboardPathByRole, normalizeUserRole } from "@/src/lib/auth/dashboardRole";

type RoleDashboardPageProps = {
  requiredRole: AppUserRole;
  title: string;
  description: string;
};

const RoleDashboardPage = ({ requiredRole, title, description }: RoleDashboardPageProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const userRole = normalizeUserRole(user?.role);

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    if (!userRole) {
      router.replace("/");
      return;
    }

    if (userRole !== requiredRole) {
      router.replace(getDashboardPathByRole(userRole));
    }
  }, [requiredRole, router, user?.role, userRole]);

  if (!userRole || userRole !== requiredRole) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        Checking dashboard access...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Role Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
};

export default RoleDashboardPage;
