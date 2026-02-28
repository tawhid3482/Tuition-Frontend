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
