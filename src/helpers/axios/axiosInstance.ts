import axios from "axios";
import { API_BASE_URL } from "@/src/config/site";

export const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error?.config;

    if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        return instance(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.location.assign("/login");
        }
      }
    }

    return Promise.reject(error);
  },
);
