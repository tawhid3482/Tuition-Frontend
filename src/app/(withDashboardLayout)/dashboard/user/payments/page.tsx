"use client";

import { useEffect, useMemo, useState } from "react";
import { ReceiptText } from "lucide-react";
import UserDashboardShell from "@/src/components/Dashboard/User/UserDashboardShell";
import { formatDateTime, normalizeOrders } from "@/src/components/Dashboard/User/orderUtils";
import { getMyOrders, type Order } from "@/src/lib/api/commerceClient";
import { formatPriceBDT } from "@/src/lib/formatCurrency";

type PaymentRow = {
  key: string;
  orderId: string;
  transactionId?: string | null;
  amount: number;
  method: string;
  gateway?: string;
  status: string;
  paidAt?: string | null;
};

export default function UserPaymentsPage() {
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
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const paymentRows = useMemo<PaymentRow[]>(() => {
    const withHistories = orders.flatMap((order) => {
      if (!Array.isArray(order.paymentHistories) || order.paymentHistories.length === 0) {
        return [] as PaymentRow[];
      }

      return order.paymentHistories.map((history, index) => ({
        key: `${order.id}-${history.id || history.transactionId || index}`,
        orderId: order.id,
        transactionId: history.transactionId,
        amount: typeof history.amount === "number" ? history.amount : order.totalAmount,
        method: history.method || order.paymentMethod || "COD",
        gateway: history.gateway || order.paymentGateway || undefined,
        status: (history.status || order.paymentStatus || "UNPAID").toUpperCase(),
        paidAt: history.paidAt || history.createdAt || order.paidAt || order.updatedAt || order.createdAt,
      }));
    });

    if (withHistories.length > 0) {
      return withHistories;
    }

    return orders.map((order) => ({
      key: `${order.id}-${order.paymentStatus || "UNPAID"}-${order.paidAt || order.updatedAt || order.createdAt || "na"}`,
      orderId: order.id,
      transactionId: order.transactionId,
      amount: order.totalAmount,
      method: order.paymentMethod || "COD",
      gateway: order.paymentGateway || undefined,
      status: (order.paymentStatus || "UNPAID").toUpperCase(),
      paidAt: order.paidAt || order.updatedAt || order.createdAt,
    }));
  }, [orders]);

  const totalPaid = useMemo(
    () => paymentRows.filter((row) => row.status === "PAID").reduce((sum, row) => sum + row.amount, 0),
    [paymentRows],
  );

  return (
    <UserDashboardShell
      title="Payment History"
      description="See payment method, status, and amount for every order transaction."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">Transactions</h2>
          <p className="text-sm font-semibold text-slate-700">Total Paid: {formatPriceBDT(totalPaid)}</p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading payment history...</p>
        ) : paymentRows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            <ReceiptText className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm">No payment records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2 pr-3 font-medium">Order ID</th>
                  <th className="pb-2 pr-3 font-medium">Transaction ID</th>
                  <th className="pb-2 pr-3 font-medium">Method</th>
                  <th className="pb-2 pr-3 font-medium">Gateway</th>
                  <th className="pb-2 pr-3 font-medium">Status</th>
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paymentRows.map((row) => {
                  const statusClass = row.status === "PAID"
                    ? "bg-emerald-100 text-emerald-700"
                    : row.status === "FAILED"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700";

                  return (
                    <tr key={row.key} className="border-b border-slate-100 text-slate-700">
                      <td className="py-2 pr-3 font-medium text-slate-900">{row.orderId}</td>
                      <td className="py-2 pr-3">{row.transactionId || "-"}</td>
                      <td className="py-2 pr-3 uppercase">{row.method}</td>
                      <td className="py-2 pr-3 uppercase">{row.gateway || "-"}</td>
                      <td className="py-2 pr-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>{row.status}</span>
                      </td>
                      <td className="py-2 pr-3">{formatDateTime(row.paidAt)}</td>
                      <td className="py-2 font-semibold text-slate-900">{formatPriceBDT(row.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </UserDashboardShell>
  );
}
