"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  CreditCard,
  Home,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Package,
  UserRound,
  X,
} from "lucide-react";
import useAuth from "@/src/hooks/useAuth";
import { useLogOutMutation } from "@/src/redux/features/auth/authApi";
import { getDashboardPathByRole, normalizeUserRole } from "@/src/lib/auth/dashboardRole";

const navItems = [
  {
    href: "/dashboard/user",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/user/orders",
    label: "My Orders",
    icon: Package,
  },
  {
    href: "/dashboard/user/payments",
    label: "Payment History",
    icon: CreditCard,
  },
  {
    href: "/dashboard/user/profile",
    label: "Update Profile",
    icon: UserRound,
  },
  {
    href: "/dashboard/user/change-password",
    label: "Change Password",
    icon: LockKeyhole,
  },
];

type UserDashboardShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function UserDashboardShell({ title, description, children }: UserDashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [logout, { isLoading: isLoggingOut }] = useLogOutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = normalizeUserRole(user?.role);

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    if (!userRole) {
      router.replace("/");
      return;
    }

    if (userRole !== "USER") {
      router.replace(getDashboardPathByRole(userRole));
    }
  }, [router, user?.role, userRole]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  if (!userRole || userRole !== "USER") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        Checking dashboard access...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-r from-sky-100 via-white to-emerald-100 p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-200/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-emerald-200/40 blur-2xl" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">User Portal</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
              <p className="mt-2 text-slate-600">{description}</p>
              <p className="mt-3 text-sm font-medium text-slate-700">Signed in as: {user?.name || user?.email || "User"}</p>
            </div>

            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm"
        >
          <span>Dashboard Menu</span>
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {mobileMenuOpen ? (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[270px_1fr]">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
