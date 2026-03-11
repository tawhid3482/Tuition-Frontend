import { authKey } from "@/src/contants/authKey";
import { instance } from "@/src/helpers/axios/axiosInstance";
import { getFromLocalStorage } from "@/src/utils/local-storage";

type ApiEnvelope<T> = {
  data?: T;
};

const getAuthHeaders = () => {
  const token = getFromLocalStorage(authKey);
  if (!token) return {};

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

export type AdminNotificationType = "info" | "warning" | "success" | "urgent";
export type AdminTargetAudience = "All" | "USER" | "ADMIN";

export type WebSettingPayload = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  textSecondary: string;
  background: string;
  cardBg: string;
  borderColor: string;
  hoverPrimary: string;
  hoverSecondary: string;
  hoverAccent: string;
  btnBg: string;
  btnHover: string;
  btnActive: string;
  btnText: string;
  fb_pixel?: string;
  google_tag_manager?: string;
};

export type PromoCodePayload = {
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  usageLimit: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
};

export type PromoCodeUpdatePayload = Partial<PromoCodePayload>;

export type CategoryUpdatePayload = {
  name?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type ProductUpdatePayload = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[];
  categoryId?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type CategoryCreatePayload = {
  name: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type ProductCreatePayload = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type ContactPriority = "Urgent" | "Normal";
export type ContactStatus = "Pending" | "Resolved" | "Closed";

export type ContactUpdatePayload = {
  title?: string;
  message?: string;
  priority?: ContactPriority;
  status?: ContactStatus;
};

export type AdminRevenuePoint = {
  label: string;
  revenue: number;
};

export type AdminOrderStats = {
  overview?: {
    totalUsers?: number;
    totalProducts?: number;
    totalOrders?: number;
    totalRevenue?: number;
  };
  charts?: {
    dailyRevenue?: AdminRevenuePoint[];
    monthlyRevenue?: AdminRevenuePoint[];
    yearlyRevenue?: AdminRevenuePoint[];
  };
};

export const getAllUsersAdmin = async () => {
  const response = await instance.get("/user/allUsers", { headers: getAuthHeaders() });
  return unwrapResponse<unknown>(response);
};

export const getAdminOrderStats = async () => {
  const response = await instance.get("/orders/admin/stats", { headers: getAuthHeaders() });
  return unwrapResponse<AdminOrderStats>(response);
};

export const getContactsAdmin = async () => {
  const response = await instance.get("/contact", { headers: getAuthHeaders() });
  return unwrapResponse<unknown>(response);
};

export const updateContactAdmin = async (contactId: string, payload: ContactUpdatePayload) => {
  const response = await instance.patch(`/contact/${contactId}`, payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const sendAdminNotification = async (payload: {
  title: string;
  message: string;
  type: AdminNotificationType;
  target_audience: AdminTargetAudience;
}) => {
  const response = await instance.post("/notification/send", payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const getPromoCodes = async () => {
  const response = await instance.get("/promo-codes", { headers: getAuthHeaders() });
  return unwrapResponse<unknown>(response);
};

export const createPromoCode = async (payload: PromoCodePayload) => {
  const response = await instance.post("/promo-codes/create", payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const updatePromoCode = async (promoCodeId: string, payload: PromoCodeUpdatePayload) => {
  const response = await instance.patch(`/promo-codes/update/${promoCodeId}`, payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const deletePromoCode = async (promoCodeId: string) => {
  const response = await instance.delete(`/promo-codes/delete/${promoCodeId}`, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const updateCategoryAdmin = async (categoryId: string, payload: CategoryUpdatePayload) => {
  const response = await instance.patch(`/categories/update/${categoryId}`, payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const createCategoryAdmin = async (payload: CategoryCreatePayload) => {
  const response = await instance.post("/categories/create", payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const deleteCategoryAdmin = async (categoryId: string) => {
  const response = await instance.delete(`/categories/delete/${categoryId}`, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const updateProductAdmin = async (productId: string, payload: ProductUpdatePayload) => {
  const response = await instance.patch(`/products/update/${productId}`, payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const createProductAdmin = async (payload: ProductCreatePayload) => {
  const response = await instance.post("/products/create", payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const deactivateProductAdmin = async (productId: string) => {
  const response = await instance.delete(`/products/delete/${productId}`, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const createOrUpdateWebSetting = async (payload: WebSettingPayload) => {
  const response = await instance.post("/settings/create-web-setting", payload, {
    headers: getAuthHeaders(),
  });
  return unwrapResponse<unknown>(response);
};

export const getWebsiteSettingsAdmin = async () => {
  const response = await instance.get("/settings", { headers: getAuthHeaders() });
  return unwrapResponse<unknown>(response);
};
