import { API_BASE_URL } from "@/src/config/site";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

const request = async <T>(path: string): Promise<T | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return (json?.data ?? null) as T | null;
  } catch {
    return null;
  }
};

export const getProducts = async () => {
  return (await request<Product[]>("/products")) ?? [];
};

export const getCategories = async () => {
  return (await request<Category[]>("/categories")) ?? [];
};
