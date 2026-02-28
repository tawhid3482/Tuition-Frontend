import { toProductSlug } from "@/src/lib/productSlug";
import { API_BASE_URL } from "@/src/config/site";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    image?: string;
  };
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  activeProductCount: ReactNode;
  id: string;
  name: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type CategoryProductsGroup = {
  category: Category;
  products: Product[];
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

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const getString = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

const getNumber = (value: unknown): number | undefined => {
  return typeof value === "number" ? value : undefined;
};

const normalizeProduct = (raw: unknown): Product | null => {
  if (!isRecord(raw)) {
    return null;
  }

  const id = getString(raw.id);
  const name = getString(raw.name);
  const categoryId = getString(raw.categoryId) || (isRecord(raw.category) ? getString(raw.category.id) : undefined);

  if (!id || !name || !categoryId) {
    return null;
  }

  const images = Array.isArray(raw.images)
    ? raw.images.filter((img): img is string => typeof img === "string" && img.trim().length > 0)
    : [];

  const category = isRecord(raw.category)
    ? {
        id: getString(raw.category.id) || categoryId,
        name: getString(raw.category.name) || "Uncategorized",
        image: getString(raw.category.image),
      }
    : undefined;

  const status = getString(raw.status);

  return {
    id,
    name,
    description: getString(raw.description) || "",
    price: getNumber(raw.price) ?? 0,
    stock: getNumber(raw.stock) ?? 0,
    images,
    categoryId,
    category,
    status: status === "ACTIVE" || status === "INACTIVE" || status === "SUSPENDED" ? status : "ACTIVE",
    createdAt: getString(raw.createdAt) || "",
    updatedAt: getString(raw.updatedAt) || "",
  };
};

const normalizeCategoryProducts = (raw: unknown): CategoryProductsGroup[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item): CategoryProductsGroup | null => {
      if (!isRecord(item)) {
        return null;
      }

      const categoryObj = isRecord(item.category) ? item.category : item;
      const categoryId =
        getString(item.categoryId) || getString(categoryObj.id) || getString(categoryObj.categoryId);
      const categoryName = getString(item.categoryName) || getString(categoryObj.name);
      const categoryImage = getString(item.categoryImage) || getString(categoryObj.image);
      const status = getString(categoryObj.status);

      if (!categoryId || !categoryName) {
        return null;
      }

      const rawProducts = Array.isArray(item.products) ? item.products : [];

      const products = rawProducts.reduce<Product[]>((acc, productRaw) => {
        const normalized = normalizeProduct(productRaw);
        if (!normalized) {
          return acc;
        }

        acc.push({
          ...normalized,
          categoryId,
          category: normalized.category || {
            id: categoryId,
            name: categoryName,
            image: categoryImage,
          },
        });

        return acc;
      }, []);

      if (products.length === 0) {
        return null;
      }

      return {
        category: {
          id: categoryId,
          name: categoryName,
          image: categoryImage,
          status:
            status === "ACTIVE" || status === "INACTIVE" || status === "SUSPENDED" ? status : undefined,
        },
        products,
      };
    })
    .filter((group): group is CategoryProductsGroup => Boolean(group));
};

const parseProductDate = (product: Product) => {
  const timestamp = Date.parse(product.updatedAt || product.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const sortProductsLatest = (products: Product[]) => {
  return [...products].sort((a, b) => parseProductDate(b) - parseProductDate(a));
};

export const getProducts = async () => {
  return (await request<Product[]>("/products")) ?? [];
};

export const getCategories = async () => {
  return (await request<Category[]>("/categories")) ?? [];
};

export const getCategoryProducts = async () => {
  const payload = await request<unknown>("/products/category-products");
  return normalizeCategoryProducts(payload);
};

export const getTrendingCategoryProducts = async () => {
  const groups = await getCategoryProducts();

  return groups
    .map((group) => ({
      ...group,
      products: sortProductsLatest(group.products),
    }))
    .filter((group) => group.products.length > 0);
};

export const getTrendingProducts = async () => {
  const groupedProducts = await getTrendingCategoryProducts();

  if (groupedProducts.length === 0) {
    return getProducts();
  }

  const seen = new Set<string>();

  return groupedProducts
    .flatMap((group) => group.products)
    .filter((product) => {
      if (seen.has(product.id)) {
        return false;
      }

      seen.add(product.id);
      return true;
    });
};


export const getProductById = async (productId: string) => {
  const product = await request<Product>(`/products/${productId}`);

  if (product) {
    return normalizeProduct(product as unknown);
  }

  const products = await getProducts();
  return products.find((item) => item.id === productId) || null;
};

export const getProductBySlug = async (productSlug: string) => {
  const products = await getProducts();
  return products.find((item) => toProductSlug(item.name) === productSlug) || null;
};

