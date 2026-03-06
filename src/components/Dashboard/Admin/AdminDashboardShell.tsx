"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Settings,
  Tag,
  Users,
  Wrench,
  X,
} from "lucide-react";
import useAuth from "@/src/hooks/useAuth";
import { useLogOutMutation } from "@/src/redux/features/auth/authApi";
import { getDashboardPathByRole, normalizeUserRole } from "@/src/lib/auth/dashboardRole";
import { DashboardScope, getScopeBasePath, getScopeLabel } from "./utils";

type AdminDashboardShellProps = {
  scope: DashboardScope;
  title: string;
  description: string;
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

export default function AdminDashboardShell({ scope, title, description, children }: AdminDashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [logout, { isLoading: isLoggingOut }] = useLogOutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = normalizeUserRole(user?.role);
  const basePath = getScopeBasePath(scope);

  const navItems = useMemo<NavItem[]>(() => {
    const core: NavItem[] = [
      { href: basePath, label: "Overview", icon: LayoutDashboard, exact: true },
      { href: `${basePath}/orders`, label: "Orders", icon: Package },
      { href: `${basePath}/users`, label: "Users", icon: Users },
      { href: `${basePath}/contacts`, label: "Contacts", icon: Mail },
      { href: `${basePath}/notifications`, label: "Notifications", icon: Bell },
      { href: `${basePath}/promo-codes`, label: "Promo Codes", icon: Tag },
      { href: `${basePath}/catalog`, label: "Catalog Tools", icon: Wrench },
    ];

    if (scope === "SUPER_ADMIN") {
      core.push({ href: `${basePath}/web-settings`, label: "Web Settings", icon: Settings });
    }

    return core;
  }, [basePath, scope]);

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    if (!userRole) {
      router.replace("/");
      return;
    }

    if (userRole !== scope) {
      router.replace(getDashboardPathByRole(userRole));
    }
  }, [router, scope, user?.role, userRole]);

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

  if (!userRole || userRole !== scope) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        Checking dashboard access...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-3xl border border-primary/15 bg-linear-to-br from-primary/12 via-white to-primary/5 p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-12 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {getScopeLabel(scope)} Dashboard
            </span>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
            <p className="mt-3 text-sm font-medium text-slate-700">Signed in as: {user?.name || user?.email || getScopeLabel(scope)}</p>
          </div>

          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <section className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm"
        >
          <span>Dashboard Menu</span>
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {mobileMenuOpen ? (
          <div className="mt-2 rounded-2xl border border-primary/20 bg-white p-2 shadow-sm">
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
                        ? "bg-primary text-white shadow"
                        : "text-slate-700 hover:bg-primary/10 hover:text-primary"
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[290px_1fr]">
        <aside className="hidden h-fit rounded-3xl border border-primary/15 bg-white p-3 shadow-sm lg:block lg:sticky lg:top-24">
          <div className="mb-2 rounded-2xl bg-primary/8 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Control Center</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{getScopeLabel(scope)} Access</p>
            <p className="text-xs text-slate-600">Manage users, orders, and platform operations.</p>
          </div>

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
                      ? "bg-primary text-white shadow"
                      : "text-slate-700 hover:bg-primary/10 hover:text-primary"
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
