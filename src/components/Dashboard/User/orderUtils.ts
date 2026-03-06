import type { Order, OrderStatus, PaymentHistory } from "@/src/lib/api/commerceClient";

export type ApiError = {
  message?: string;
};

export const normalizeOrderStatus = (status: unknown): OrderStatus => {
  const statusText = typeof status === "string" ? status.trim().toUpperCase() : "";

  if (statusText === "CONFIRMED") return "CONFIRMED";
  if (statusText === "SHIPPED") return "SHIPPED";
  if (statusText === "DELIVERED") return "DELIVERED";
  if (statusText === "CANCELLED") return "CANCELLED";
  return "PENDING";
};

const normalizePaymentHistories = (value: unknown): PaymentHistory[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      const row = entry as {
        id?: string;
        _id?: string;
        transactionId?: string;
        tran_id?: string;
        amount?: number;
        status?: string;
        method?: string;
        paymentMethod?: string;
        gateway?: string;
        paymentGateway?: string;
        createdAt?: string;
        paidAt?: string;
      };

      return {
        id: row.id || row._id,
        transactionId: row.transactionId || row.tran_id || null,
        amount: typeof row.amount === "number" ? row.amount : undefined,
        status: typeof row.status === "string" ? row.status : undefined,
        method: row.method || row.paymentMethod,
        gateway: row.gateway || row.paymentGateway,
        createdAt: row.createdAt,
        paidAt: row.paidAt || null,
      };
    })
    .filter((item) => Boolean(item.id || item.transactionId || item.status));
};

export const normalizeOrders = (payload: unknown): Order[] => {
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
        deliveryFee?: number;
        discountAmount?: number;
        discountPercentage?: number;
        promoCodeId?: string | null;
        appliedPromoCode?: string | null;
        totalAmount?: number;
        paymentMethod?: string;
        paymentStatus?: string;
        paymentGateway?: string | null;
        transactionId?: string | null;
        tran_id?: string | null;
        paidAt?: string | null;
        shippingAddress?: string;
        phone?: string;
        note?: string | null;
        createdAt?: string;
        updatedAt?: string;
        promoCode?: {
          id?: string;
          code?: string;
          discountPercentage?: number;
        } | null;
        paymentHistories?: unknown[];
        items?: unknown[];
      };

      const orderId = row.id || row._id;
      if (!orderId) {
        return null;
      }

      const paymentHistories = normalizePaymentHistories(row.paymentHistories);
      const latestPayment = paymentHistories[0];

      const items = Array.isArray(row.items)
        ? row.items
            .map((orderItem) => {
              const parsed = orderItem as {
                id?: string;
                _id?: string;
                orderId?: string;
                productId?: string;
                quantity?: number;
                unitPrice?: number;
                totalPrice?: number;
                price?: number;
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

              const fallbackPrice = typeof parsed.unitPrice === "number"
                ? parsed.unitPrice
                : typeof parsed.price === "number"
                  ? parsed.price
                  : typeof parsed.product?.price === "number"
                    ? parsed.product.price
                    : 0;

              return {
                id: parsed.id || parsed._id || `${orderId}-${productId}`,
                orderId: parsed.orderId || orderId,
                productId,
                quantity: typeof parsed.quantity === "number" ? parsed.quantity : 0,
                unitPrice: typeof parsed.unitPrice === "number" ? parsed.unitPrice : fallbackPrice,
                totalPrice: typeof parsed.totalPrice === "number" ? parsed.totalPrice : fallbackPrice,
                price: fallbackPrice,
                createdAt: parsed.createdAt,
                product: parsed.product
                  ? {
                      id: parsed.product.id || parsed.product._id || productId,
                      name: parsed.product.name || "Product",
                      images: Array.isArray(parsed.product.images) ? parsed.product.images : [],
                      price: typeof parsed.product.price === "number" ? parsed.product.price : fallbackPrice,
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
        subtotal: typeof row.subtotal === "number" ? row.subtotal : undefined,
        deliveryFee: typeof row.deliveryFee === "number" ? row.deliveryFee : undefined,
        discountAmount: typeof row.discountAmount === "number" ? row.discountAmount : undefined,
        discountPercentage: typeof row.discountPercentage === "number" ? row.discountPercentage : undefined,
        promoCodeId: row.promoCodeId,
        appliedPromoCode: row.appliedPromoCode,
        totalAmount: typeof row.totalAmount === "number" ? row.totalAmount : 0,
        paymentMethod: row.paymentMethod || latestPayment?.method,
        paymentStatus: row.paymentStatus || latestPayment?.status,
        paymentGateway: row.paymentGateway || latestPayment?.gateway || null,
        transactionId: row.transactionId || row.tran_id || latestPayment?.transactionId || null,
        paidAt: row.paidAt || latestPayment?.paidAt || null,
        shippingAddress: row.shippingAddress,
        phone: row.phone,
        note: row.note,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        promoCode: row.promoCode,
        paymentHistories,
        items,
      };
    })
    .filter((item): item is Order => item !== null);
};

export const formatDateTime = (value?: string | null) => {
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
