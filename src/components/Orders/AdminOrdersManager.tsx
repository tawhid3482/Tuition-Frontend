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
  type PaymentHistory,
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
        subtotal?: number;
        totalAmount?: number;
        deliveryFee?: number;
        discountAmount?: number;
        discountPercentage?: number;
        promoCodeId?: string | null;
        appliedPromoCode?: string | null;
        paymentMethod?: string;
        paymentStatus?: string;
        paymentGateway?: string | null;
        transactionId?: string | null;
        paidAt?: string | null;
        shippingAddress?: string;
        phone?: string;
        note?: string;
        createdAt?: string;
        updatedAt?: string;
        promoCode?: {
          id?: string;
          code?: string;
          discountPercentage?: number;
        } | null;
        paymentHistories?: unknown[];
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
                unitPrice?: number;
                totalPrice?: number;
                createdAt?: string;
                product?: {
                  id?: string;
                  _id?: string;
                  name?: string;
                  images?: string[];
                  price?: number;
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
                unitPrice: typeof parsed.unitPrice === "number" ? parsed.unitPrice : undefined,
                totalPrice: typeof parsed.totalPrice === "number" ? parsed.totalPrice : undefined,
                price: typeof parsed.price === "number" ? parsed.price : 0,
                createdAt: parsed.createdAt,
                product: parsed.product
                  ? {
                      id: parsed.product.id || parsed.product._id || productId,
                      name: parsed.product.name || "Product",
                      images: parsed.product.images,
                      price: parsed.product.price,
                    }
                  : undefined,
              };
            })
            .filter((orderItem) => Boolean(orderItem.productId))
        : [];

      const paymentHistories = Array.isArray(row.paymentHistories)
        ? row.paymentHistories.map((history) => history as PaymentHistory)
        : undefined;

      return {
        id: orderId,
        userId: row.userId,
        status: normalizeOrderStatus(row.status),
        totalAmount: typeof row.totalAmount === "number" ? row.totalAmount : 0,
        subtotal: typeof row.subtotal === "number" ? row.subtotal : undefined,
        deliveryFee: typeof row.deliveryFee === "number" ? row.deliveryFee : undefined,
        discountAmount: typeof row.discountAmount === "number" ? row.discountAmount : undefined,
        discountPercentage: typeof row.discountPercentage === "number" ? row.discountPercentage : undefined,
        promoCodeId: row.promoCodeId ?? null,
        appliedPromoCode: row.appliedPromoCode ?? null,
        paymentMethod: row.paymentMethod,
        paymentStatus: row.paymentStatus,
        paymentGateway: row.paymentGateway ?? null,
        transactionId: row.transactionId ?? null,
        paidAt: row.paidAt ?? null,
        shippingAddress: row.shippingAddress,
        phone: row.phone,
        note: row.note,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        promoCode: row.promoCode ?? null,
        paymentHistories,
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
  const [selectedOrder, setSelectedOrder] = useState<{ order: Order; number: number } | null>(null);

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

  useEffect(() => {
    if (!selectedOrder) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOrder]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.totalAmount, 0),
    [orders],
  );
  const modalOrder = selectedOrder?.order;
  const modalOrderNumber = selectedOrder?.number;

  const handleStatusUpdate = async (order: Order, nextStatus: OrderStatus) => {
    if (nextStatus === order.status) {
      return;
    }

    setUpdatingOrderId(order.id);
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

    try {
      await updateOrderStatus(order.id, nextStatus);
    } catch (err: unknown) {
      setOrders((prev) =>
        prev.map((row) =>
          row.id === order.id
            ? {
                ...row,
                status: order.status,
              }
            : row,
        ),
      );
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
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="w-[140px] px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="w-[140px] px-4 py-3 font-semibold">Amount</th>
                <th className="w-[140px] px-4 py-3 font-semibold">Status</th>
                <th className="w-[220px] px-4 py-3 font-semibold">Update</th>
                <th className="w-[110px] px-4 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const immutable = order.status === "DELIVERED" || order.status === "CANCELLED";
                const isUpdating = updatingOrderId === order.id;
                const orderNumber = index + 1;

                return (
                  <tr key={order.id} className="border-b border-slate-100 align-top transition hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Order #{orderNumber}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Placed {formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <p className="font-semibold text-slate-900">{order.user?.name || "Unknown"}</p>
                      {/* <p className="text-xs text-slate-500">{order.user?.email || "-"}</p> */}
                      {/* <p className="mt-1 text-xs text-slate-500 break-words">{order.shippingAddress || "-"}</p>+ */}
                      <p className="mt-1 text-xs text-black">{order.phone || "-"}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatPriceBDT(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          disabled={immutable || isUpdating}
                          onChange={(e) => {
                            const next = normalizeOrderStatus(e.target.value);
                            handleStatusUpdate(order, next);
                          }}
                          className="rounded-lg border border-red-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none disabled:bg-slate-100"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={`${order.id}-${status}`} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-slate-500">{isUpdating ? "Saving..." : null}</span>
                      </div>
                      {immutable ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {order.status} order cannot be changed.
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder({ order, number: orderNumber })}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close order details"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Order Details</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Order #{modalOrderNumber}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Customer</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{modalOrder.user?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{modalOrder.user?.email || "-"}</p>
                  <p className="mt-2 text-xs text-slate-500">{modalOrder.phone || "-"}</p>
                  <p className="mt-2 text-xs text-slate-500">{modalOrder.shippingAddress || "-"}</p>
                  <p className="mt-2 text-xs text-slate-500">Note: {modalOrder.note || "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Payment</p>
                  <p className="mt-2 text-sm text-slate-700">Method: {modalOrder.paymentMethod || "-"}</p>
                  <p className="mt-1 text-sm text-slate-700">Status: {modalOrder.paymentStatus || "-"}</p>
                  <p className="mt-1 text-sm text-slate-700">Gateway: {modalOrder.paymentGateway || "-"}</p>
                  <p className="mt-1 text-sm text-slate-700">Transaction: {modalOrder.transactionId || "-"}</p>
                  <p className="mt-1 text-sm text-slate-700">Paid at: {formatDate(modalOrder.paidAt || "")}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Pricing</p>
                  <p className="mt-2 text-sm text-slate-700">Subtotal: {formatPriceBDT(modalOrder.subtotal ?? 0)}</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Delivery: {formatPriceBDT(modalOrder.deliveryFee ?? 0)}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    Discount: {formatPriceBDT(modalOrder.discountAmount ?? 0)}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    Promo: {modalOrder.appliedPromoCode || modalOrder.promoCode?.code || "-"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Total: {formatPriceBDT(modalOrder.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase text-slate-500">Items</p>
                  <p className="text-xs text-slate-500">Total items: {modalOrder.items.length}</p>
                </div>
                {modalOrder.items.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">No items found.</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {modalOrder.items.map((item) => {
                      const unitPrice =
                        item.unitPrice ??
                        item.price ??
                        (item.totalPrice && item.quantity ? item.totalPrice / item.quantity : 0);
                      const totalPrice =
                        item.totalPrice ?? (unitPrice && item.quantity ? unitPrice * item.quantity : 0);

                      return (
                        <div key={item.id} className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-[200px]">
                            <p className="text-sm font-semibold text-slate-900">{item.product?.name || "Product"}</p>
                            <p className="text-xs text-slate-500">Product ID: {item.productId}</p>
                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right text-sm text-slate-700">
                            <p>Unit: {formatPriceBDT(unitPrice || 0)}</p>
                            <p>Total: {formatPriceBDT(totalPrice || 0)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
