"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/src/hooks/useAuth";
import { getDashboardPathByRole } from "@/src/lib/auth/dashboardRole";

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    router.replace(getDashboardPathByRole(user.role));
  }, [router, user?.role]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
      Loading dashboard...
    </div>
  );
};

export default DashboardPage;
