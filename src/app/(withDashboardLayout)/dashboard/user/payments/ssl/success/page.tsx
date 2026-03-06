"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import UserDashboardShell from "@/src/components/Dashboard/User/UserDashboardShell";

const PENDING_SSL_ORDER_KEY = "pendingSslOrderId";

export default function UserPaymentSslSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";
  const transactionId = searchParams.get("transactionId") || "N/A";

  useEffect(() => {
    localStorage.removeItem(PENDING_SSL_ORDER_KEY);
  }, []);

  return (
    <UserDashboardShell
      title="SSL Payment Success"
      description="Your payment was completed successfully."
    >
      <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-sm md:p-8">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" />
        </span>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">Payment Successful</h2>
        <p className="mt-2 text-sm text-slate-600">SSLCommerz has confirmed your transaction.</p>

        <div className="mt-5 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-700">
          <p><span className="font-semibold text-slate-900">Order ID:</span> {orderId}</p>
          <p><span className="font-semibold text-slate-900">Transaction ID:</span> {transactionId}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/user/orders"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View Orders
          </Link>
          <Link
            href="/dashboard/user/payments"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Payment History
          </Link>
        </div>
      </section>
    </UserDashboardShell>
  );
}
