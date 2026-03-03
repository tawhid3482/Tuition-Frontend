"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import UserDashboardShell from "@/src/components/Dashboard/User/UserDashboardShell";
import { formatDateTime, normalizeOrders } from "@/src/components/Dashboard/User/orderUtils";
import { getMyOrdersPaginated, type Order, type OrderListMeta } from "@/src/lib/api/commerceClient";
import { formatPriceBDT } from "@/src/lib/formatCurrency";

const statusClassMap: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

const paymentStatusClassMap: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  UNPAID: "bg-slate-200 text-slate-700",
  FAILED: "bg-rose-100 text-rose-700",
};

const statusOptions = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const sortByOptions = [
  { value: "createdAt", label: "Created Time" },
  { value: "totalAmount", label: "Total Amount" },
  { value: "status", label: "Status" },
  { value: "paymentStatus", label: "Payment Status" },
];

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState<OrderListMeta>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const response = await getMyOrdersPaginated({
          page,
          limit,
          status: status === "ALL" ? undefined : status,
          sortBy,
          sortOrder,
          searchTerm: searchTerm || undefined,
        });

        if (!mounted) return;

        setOrders(normalizeOrders(response.data));
        setMeta((response.meta || {}) as OrderListMeta);
      } catch {
        if (!mounted) return;
        setOrders([]);
        setMeta({});
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [page, limit, status, sortBy, sortOrder, searchTerm]);

  const totalItems = useMemo(
    () => orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
    [orders],
  );

  const totalPages = Number(meta.totalPage) > 0 ? Number(meta.totalPage) : 1;

  return (
    <UserDashboardShell
      title="My Orders"
      description="Your orders with backend pagination, sorting, filtering and searching."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">Order List</h2>
          <p className="text-sm text-slate-600">
            Orders: {meta.total ?? orders.length} | Items (current page): {totalItems}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="xl:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Search</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by promo code, payment, note..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold text-slate-500">Status</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold text-slate-500">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {sortByOptions.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-500">Order</span>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as "asc" | "desc");
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-500">Limit</span>
              <select
                value={String(limit)}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-slate-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusBadge = statusClassMap[order.status] || "bg-slate-100 text-slate-700";
              const paymentStatus = (order.paymentStatus || "UNPAID").toUpperCase();
              const paymentBadge = paymentStatusClassMap[paymentStatus] || "bg-slate-100 text-slate-700";
              const isExpanded = expandedOrderId === order.id;

              return (
                <article key={order.id} className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Order ID</p>
                      <p className="mt-1 break-all text-sm font-bold text-slate-900">{order.id}</p>
                      <p className="mt-1 text-xs text-slate-600">Placed: {formatDateTime(order.createdAt)}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge}`}>{order.status}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paymentBadge}`}>{paymentStatus}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-xs text-slate-500">Subtotal</p>
                      <p className="font-semibold text-slate-900">{formatPriceBDT(order.subtotal ?? order.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Delivery</p>
                      <p className="font-semibold text-slate-900">{formatPriceBDT(order.deliveryFee ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Discount</p>
                      <p className="font-semibold text-emerald-700">- {formatPriceBDT(order.discountAmount ?? 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="font-bold text-slate-900">{formatPriceBDT(order.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId((prev) => (prev === order.id ? null : order.id))}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      View Details
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                        <p><span className="font-semibold text-slate-900">Payment Method:</span> {order.paymentMethod || "-"}</p>
                        <p><span className="font-semibold text-slate-900">Payment Gateway:</span> {order.paymentGateway || "-"}</p>
                        <p><span className="font-semibold text-slate-900">Transaction ID:</span> {order.transactionId || "-"}</p>
                        <p><span className="font-semibold text-slate-900">Paid At:</span> {formatDateTime(order.paidAt)}</p>
                        <p className="md:col-span-2"><span className="font-semibold text-slate-900">Shipping Address:</span> {order.shippingAddress || "-"}</p>
                        <p><span className="font-semibold text-slate-900">Phone:</span> {order.phone || "-"}</p>
                        <p><span className="font-semibold text-slate-900">Note:</span> {order.note || "-"}</p>
                        <p>
                          <span className="font-semibold text-slate-900">Promo:</span>{" "}
                          {order.appliedPromoCode || order.promoCode?.code
                            ? `${order.appliedPromoCode || order.promoCode?.code} (${order.discountPercentage ?? order.promoCode?.discountPercentage ?? 0}%)`
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Ordered Items</h3>
                        <div className="mt-2 space-y-2">
                          {order.items.map((item) => {
                            const imageUrl = item.product?.images?.[0];
                            return (
                              <div key={item.id} className="flex gap-3 rounded-lg border border-slate-200 p-2">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={item.product?.name || "Product"}
                                    width={56}
                                    height={56}
                                    className="h-14 w-14 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="h-14 w-14 rounded-md bg-slate-100" />
                                )}

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-slate-900">{item.product?.name || item.productId}</p>
                                  <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                                  <p className="text-xs text-slate-600">Unit: {formatPriceBDT(item.unitPrice ?? item.price)}</p>
                                  <p className="text-xs font-semibold text-slate-900">
                                    Subtotal: {formatPriceBDT(item.totalPrice ?? (item.unitPrice ?? item.price) * item.quantity)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600">
                Page {meta.page ?? page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1 || loading}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages || loading}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </UserDashboardShell>
  );
}
