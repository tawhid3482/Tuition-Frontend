"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import useAuth from "@/src/hooks/useAuth";
import {
  ORDER_STATUSES,
  getAllOrders,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/src/lib/api/commerceClient";
import { getDashboardPathByRole, normalizeUserRole } from "@/src/lib/auth/dashboardRole";
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
        user?: {
          id?: string;
          _id?: string;
          name?: string;
          email?: string;
        };
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
        user: row.user
          ? {
              id: row.user.id || row.user._id,
              name: row.user.name,
              email: row.user.email,
            }
          : undefined,
      };
    })
    .filter((item): item is Order => item !== null);
};

type AdminOrdersManagerProps = {
  title: string;
  description: string;
};

export default function AdminOrdersManager({ title, description }: AdminOrdersManagerProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<Record<string, OrderStatus>>({});

  const normalizedRole = normalizeUserRole(user?.role);
  const isAdminRole = normalizedRole === "ADMIN" || normalizedRole === "SUPER_ADMIN";

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    if (!isAdminRole) {
      router.replace(getDashboardPathByRole(user.role));
    }
  }, [isAdminRole, router, user?.role]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await getAllOrders();
      const normalized = normalizeOrders(payload).sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
      setOrders(normalized);
    } catch (err: unknown) {
      setOrders([]);
      setError(getApiErrorMessage(err, "Failed to load orders"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminRole) {
      return;
    }

    loadOrders();
  }, [isAdminRole]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.totalAmount, 0),
    [orders],
  );

  const getNextStatus = (order: Order): OrderStatus => draftStatus[order.id] || order.status;

  const handleStatusUpdate = async (order: Order) => {
    const nextStatus = getNextStatus(order);

    if (nextStatus === order.status) {
      return;
    }

    setUpdatingOrderId(order.id);

    try {
      await updateOrderStatus(order.id, nextStatus);
      setOrders((prev) =>
        prev.map((row) =>
          row.id === order.id
            ? {
                ...row,
                status: nextStatus,
              }
            : row,
        ),
      );
      setDraftStatus((prev) => ({
        ...prev,
        [order.id]: nextStatus,
      }));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to update order status"));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!isAdminRole) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        Checking dashboard access...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Order Management</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
        {!loading ? (
          <p className="mt-3 text-sm font-medium text-slate-700">
            Total orders: {orders.length} | Total value: {formatPriceBDT(totalRevenue)}
          </p>
        ) : null}
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Placed</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const immutable = order.status === "DELIVERED" || order.status === "CANCELLED";
                const selectedStatus = getNextStatus(order);
                const isUpdating = updatingOrderId === order.id;

                return (
                  <tr key={order.id} className="border-b border-slate-100 align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{order.id}</p>
                      <p className="mt-1 text-xs text-slate-500">{order.shippingAddress || "No address provided"}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <p>{order.user?.name || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{order.user?.email || "-"}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatPriceBDT(order.totalAmount)}</td>
                    <td className="px-4 py-3 text-slate-700">{order.items.length}</td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedStatus}
                          disabled={immutable || isUpdating}
                          onChange={(e) => {
                            const next = normalizeOrderStatus(e.target.value);
                            setDraftStatus((prev) => ({ ...prev, [order.id]: next }));
                          }}
                          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none disabled:bg-slate-100"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={`${order.id}-${status}`} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(order)}
                          disabled={immutable || isUpdating || selectedStatus === order.status}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isUpdating ? "Saving..." : "Save"}
                        </button>
                      </div>
                      {immutable ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {order.status} order cannot be changed.
                        </p>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}




