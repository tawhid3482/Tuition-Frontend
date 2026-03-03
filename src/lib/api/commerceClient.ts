import { authKey } from "@/src/contants/authKey";
import { instance } from "@/src/helpers/axios/axiosInstance";
import { getFromLocalStorage } from "@/src/utils/local-storage";

type ApiEnvelope<T> = {
  data?: T;
  meta?: unknown;
};

type PaginatedResult<T> = {
  data: T;
  meta: unknown;
};

export type ReviewPayload = {
  productId: string;
  rating: number;
  comment: string;
};

export type CheckoutPaymentMethod = "COD" | "SSLCOMMERZ";

export type CheckoutPayload = {
  shippingAddress?: string;
  phone?: string;
  note?: string;
  deliveryFee?: number;
  paymentMethod?: CheckoutPaymentMethod;
  promoCode?: string;
};

export type CheckoutResult = {
  id?: string;
  orderId?: string;
  subtotal?: number;
  deliveryFee?: number;
  discountPercentage?: number;
  discountAmount?: number;
  totalAmount?: number;
  appliedPromoCode?: string;
};

export type SslInitResult = {
  gatewayUrl?: string;
  url?: string;
  redirectUrl?: string;
};

export type PromoApplyPayload = {
  promoCode: string;
  deliveryFee?: number;
};

export type PromoApplyResult = {
  promo?: {
    id?: string;
    code?: string;
    discountPercentage?: number;
  };
  pricing?: {
    subtotal?: number;
    deliveryFee?: number;
    discountPercentage?: number;
    discountAmount?: number;
    totalAmount?: number;
  };
};

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItemProduct = {
  id: string;
  name: string;
  images?: string[];
  price?: number;
};

export type OrderItem = {
  id: string;
  orderId?: string;
  productId: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  price: number;
  createdAt?: string;
  product?: OrderItemProduct;
};

export type Order = {
  id: string;
  userId?: string;
  status: OrderStatus;
  subtotal?: number;
  deliveryFee?: number;
  discountAmount?: number;
  discountPercentage?: number;
  promoCodeId?: string | null;
  appliedPromoCode?: string | null;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentGateway?: string | null;
  transactionId?: string | null;
  paidAt?: string | null;
  shippingAddress?: string;
  phone?: string;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
  items: OrderItem[];
  promoCode?: {
    id?: string;
    code?: string;
    discountPercentage?: number;
  } | null;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
};

export type OrderQueryParams = {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
};

export type OrderListMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
};

const getAuthHeaders = () => {
  const token = getFromLocalStorage(authKey);

  if (!token) {
    return {};
  }

  return {
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };
};

const unwrapResponse = <T>(response: { data?: ApiEnvelope<T> | T }): T => {
  const payload = response?.data;

  if (payload && typeof payload === "object" && "data" in (payload as ApiEnvelope<T>)) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
};

const unwrapResponseWithMeta = <T>(response: { data?: ApiEnvelope<T> | T }): PaginatedResult<T> => {
  const payload = response?.data;

  if (payload && typeof payload === "object" && "data" in (payload as ApiEnvelope<T>)) {
    return {
      data: (payload as ApiEnvelope<T>).data as T,
      meta: (payload as ApiEnvelope<T>).meta ?? null,
    };
  }

  return {
    data: payload as T,
    meta: null,
  };
};

export const addToCart = async (productId: string, quantity = 1) => {
  const response = await instance.post(
    "/cart/add",
    { productId, quantity },
    { headers: getAuthHeaders() },
  );

  return unwrapResponse(response);
};

export const getMyCart = async () => {
  const response = await instance.get("/cart/me", { headers: getAuthHeaders() });
  return unwrapResponse(response);
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const response = await instance.patch(
    `/cart/update/${productId}`,
    { quantity },
    { headers: getAuthHeaders() },
  );

  return unwrapResponse(response);
};

export const removeCartItem = async (productId: string) => {
  const response = await instance.delete(`/cart/remove/${productId}`, {
    headers: getAuthHeaders(),
  });

  return unwrapResponse(response);
};

export const checkoutOrder = async (payload: CheckoutPayload = {}) => {
  const response = await instance.post("/orders/checkout", payload, {
    headers: getAuthHeaders(),
  });

  return unwrapResponse<CheckoutResult>(response);
};

export const initSslPayment = async (orderId: string) => {
  const response = await instance.post(`/orders/${orderId}/payments/ssl/init`, {}, {
    headers: getAuthHeaders(),
  });

  return unwrapResponse<SslInitResult>(response);
};

export const applyPromoCode = async (payload: PromoApplyPayload) => {
  const response = await instance.post("/promo-codes/apply", payload, {
    headers: getAuthHeaders(),
  });

  return unwrapResponse<PromoApplyResult>(response);
};

export const getMyOrders = async () => {
  const response = await instance.get("/orders/me", { headers: getAuthHeaders() });
  return unwrapResponse(response);
};

export const getMyOrdersPaginated = async (params: OrderQueryParams = {}) => {
  const response = await instance.get("/orders/me", {
    headers: getAuthHeaders(),
    params,
  });

  return unwrapResponseWithMeta<unknown[]>(response);
};

export const getAllOrders = async () => {
  const response = await instance.get("/orders", { headers: getAuthHeaders() });
  return unwrapResponse(response);
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const response = await instance.patch(
    `/orders/${orderId}/status`,
    { status },
    { headers: getAuthHeaders() },
  );

  return unwrapResponse(response);
};

export const addToWishlist = async (productId: string) => {
  const response = await instance.post(
    "/wishlist/add",
    { productId },
    { headers: getAuthHeaders() },
  );

  return unwrapResponse(response);
};

export const getMyWishlist = async () => {
  const response = await instance.get("/wishlist/me", { headers: getAuthHeaders() });
  return unwrapResponse(response);
};

export const removeFromWishlist = async (productId: string) => {
  const response = await instance.delete(`/wishlist/remove/${productId}`, {
    headers: getAuthHeaders(),
  });

  return unwrapResponse(response);
};

export const createReview = async (payload: ReviewPayload) => {
  const response = await instance.post("/reviews/create", payload, {
    headers: getAuthHeaders(),
  });

  return unwrapResponse(response);
};

export const getProductReviews = async (productId: string, page = 1, limit = 10) => {
  const response = await instance.get(`/reviews/product/${productId}?page=${page}&limit=${limit}`);
  return unwrapResponseWithMeta(response);
};

export const getMyReviews = async (page = 1, limit = 10) => {
  const response = await instance.get(`/reviews/me?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });

  return unwrapResponseWithMeta(response);
};

export const updateReview = async (reviewId: string, payload: Pick<ReviewPayload, "rating" | "comment">) => {
  const response = await instance.patch(`/reviews/update/${reviewId}`, payload, {
    headers: getAuthHeaders(),
  });

  return unwrapResponse(response);
};

export const deleteReview = async (reviewId: string) => {
  const response = await instance.delete(`/reviews/delete/${reviewId}`, {
    headers: getAuthHeaders(),
  });

  return unwrapResponse(response);
};
