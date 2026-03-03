"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, Package, Truck, Wallet } from "lucide-react";
import UserDashboardShell from "@/src/components/Dashboard/User/UserDashboardShell";
import { formatDateTime, normalizeOrders } from "@/src/components/Dashboard/User/orderUtils";
import { getMyOrders, type Order } from "@/src/lib/api/commerceClient";
import { formatPriceBDT } from "@/src/lib/formatCurrency";

type StatCard = {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function UserDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const payload = await getMyOrders();
        if (!mounted) return;

        const normalized = normalizeOrders(payload).sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        setOrders(normalized);
      } catch {
        if (!mounted) return;
        setOrders([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo<StatCard[]>(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter((order) => ["PENDING", "CONFIRMED", "SHIPPED"].includes(order.status)).length;
    const paidOrders = orders.filter((order) => (order.paymentStatus || "").toUpperCase() === "PAID").length;

    return [
      { id: "totalOrders", label: "Total Orders", value: String(totalOrders), icon: Package },
      { id: "totalSpent", label: "Total Spent", value: formatPriceBDT(totalSpent), icon: Wallet },
      { id: "pendingOrders", label: "Active Deliveries", value: String(pendingOrders), icon: Truck },
      { id: "paidOrders", label: "Paid Orders", value: String(paidOrders), icon: CreditCard },
    ];
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  return (
    <UserDashboardShell
      title="Dashboard"
      description="Track your recent orders, spending, and payment activity at a glance."
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <span className="rounded-lg bg-slate-100 p-2 text-slate-700">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{loading ? "..." : item.value}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <Link
              href="/dashboard/user/orders"
              className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading recent orders...</p>
          ) : recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No orders found yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="pb-2 pr-3 font-medium">Order ID</th>
                    <th className="pb-2 pr-3 font-medium">Date</th>
                    <th className="pb-2 pr-3 font-medium">Status</th>
                    <th className="pb-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 text-slate-700">
                      <td className="py-2 pr-3 font-medium text-slate-900">{order.id}</td>
                      <td className="py-2 pr-3">{formatDateTime(order.createdAt)}</td>
                      <td className="py-2 pr-3">{order.status}</td>
                      <td className="py-2 font-semibold text-slate-900">{formatPriceBDT(order.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </UserDashboardShell>
  );
}
