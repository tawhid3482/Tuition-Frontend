"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import Link from "next/link";
import { getMyOrders, type Order, type OrderStatus } from "@/src/lib/api/commerceClient";
import { formatPriceBDT } from "@/src/lib/formatCurrency";

type ApiError = {
  message?: string;
};

const statusClassMap: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

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

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<ApiError>;
  return axiosError?.response?.data?.message || fallback;
};

const normalizeOrderStatus = (status: unknown): OrderStatus => {
  const statusText = typeof status === "string" ? status.trim().toUpperCase() : "";

  if (statusText === "CONFIRMED") return "CONFIRMED";
  if (statusText === "SHIPPED") return "SHIPPED";
  if (statusText === "DELIVERED") return "DELIVERED";
  if (statusText === "CANCELLED") return "CANCELLED";
  return "PENDING";
};

const normalizeOrders = (payload: unknown): Order[] => {
  const source = payload as
    | Order[]
    | { orders?: unknown[]; items?: unknown[]; data?: unknown[] }
    | undefined;

  const list = Array.isArray(source)
    ? source
    : Array.isArray(source?.orders)
      ? source.orders
      : Array.isArray(source?.items)
        ? source.items
        : Array.isArray(source?.data)
          ? source.data
          : [];

  return list
    .map<Order | null>((item) => {
      const row = item as {
        id?: string;
        _id?: string;
        userId?: string;
        status?: string;
        totalAmount?: number;
        deliveryFee?: number;
        shippingAddress?: string;
        phone?: string;
        note?: string;
        createdAt?: string;
        updatedAt?: string;
        items?: unknown[];
      };

      const orderId = row.id || row._id;
      if (!orderId) {
        return null;
      }

      const items = Array.isArray(row.items)
        ? row.items
            .map((orderItem) => {
              const parsed = orderItem as {
                id?: string;
                _id?: string;
                productId?: string;
                quantity?: number;
                price?: number;
                product?: {
                  id?: string;
                  _id?: string;
                  name?: string;
                };
              };

              const productId =
                parsed.product?.id ||
                parsed.product?._id ||
                (typeof parsed.productId === "string" ? parsed.productId : "");

              return {
                id: parsed.id || parsed._id || `${orderId}-${productId}`,
                productId,
                quantity: typeof parsed.quantity === "number" ? parsed.quantity : 0,
                price: typeof parsed.price === "number" ? parsed.price : 0,
                product: parsed.product
                  ? {
                      id: parsed.product.id || parsed.product._id || productId,
                      name: parsed.product.name || "Product",
                    }
                  : undefined,
              };
            })
            .filter((orderItem) => Boolean(orderItem.productId))
        : [];

      return {
        id: orderId,
        userId: row.userId,
        status: normalizeOrderStatus(row.status),
        totalAmount: typeof row.totalAmount === "number" ? row.totalAmount : 0,
        deliveryFee: typeof row.deliveryFee === "number" ? row.deliveryFee : undefined,
        shippingAddress: row.shippingAddress,
        phone: row.phone,
        note: row.note,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        items,
      };
    })
    .filter((item): item is Order => item !== null);
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = await getMyOrders();
        if (!isMounted) {
          return;
        }

        const normalized = normalizeOrders(payload).sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        setOrders(normalized);
      } catch (err: unknown) {
        if (!isMounted) {
          return;
        }
        setOrders([]);
        setError(getApiErrorMessage(err, "Failed to load orders"));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalOrderedItems = useMemo(
    () => orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
    [orders],
  );

  return (
    <section className="py-8 md:py-12">
      <header className="rounded-3xl border border-slate-200 bg-linear-to-r from-slate-50 via-white to-emerald-50 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="mt-2 text-slate-600">Track your orders and delivery status in one place.</p>
        {!loading ? (
          <p className="mt-3 text-sm font-medium text-slate-700">
            Total orders: {orders.length} | Total items: {totalOrderedItems}
          </p>
        ) : null}
      </header>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          Loading orders...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <p className="font-semibold">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          <p>You do not have any orders yet.</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Order ID</p>
                  <p className="mt-1 font-semibold text-slate-900">{order.id}</p>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2 xl:grid-cols-4">
                <p>
                  <span className="font-semibold text-slate-900">Total:</span> {formatPriceBDT(order.totalAmount)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Delivery fee:</span>{" "}
                  {typeof order.deliveryFee === "number" ? formatPriceBDT(order.deliveryFee) : "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Placed:</span> {formatDate(order.createdAt)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Items:</span> {order.items.length}
                </p>
              </div>

              {(order.shippingAddress || order.phone || order.note) && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  {order.shippingAddress ? <p><span className="font-semibold text-slate-900">Address:</span> {order.shippingAddress}</p> : null}
                  {order.phone ? <p><span className="font-semibold text-slate-900">Phone:</span> {order.phone}</p> : null}
                  {order.note ? <p><span className="font-semibold text-slate-900">Note:</span> {order.note}</p> : null}
                </div>
              )}

              {order.items.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="pb-2 pr-3 font-medium">Product</th>
                        <th className="pb-2 pr-3 font-medium">Qty</th>
                        <th className="pb-2 pr-3 font-medium">Price</th>
                        <th className="pb-2 font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 text-slate-700">
                          <td className="py-2 pr-3">{item.product?.name || item.productId}</td>
                          <td className="py-2 pr-3">{item.quantity}</td>
                          <td className="py-2 pr-3">{formatPriceBDT(item.price)}</td>
                          <td className="py-2">{formatPriceBDT(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}




