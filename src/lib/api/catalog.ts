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
  id: string;
  name: string;
  image?: string;
  activeProductCount?: number;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

export type CategoryProductsGroup = {
  category: Category;
  products: Product[];
};

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryName?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "price" | "name" | "stock";
  sortOrder?: "asc" | "desc";
};

export type ProductListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
};

const requestJson = async (path: string): Promise<unknown | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
};

const request = async <T>(path: string): Promise<T | null> => {
  const json = await requestJson(path);
  if (!isRecord(json)) {
    return null;
  }

  return (json.data ?? null) as T | null;
};

const requestWithMeta = async <T>(path: string): Promise<{ data: T | null; meta: unknown }> => {
  const json = await requestJson(path);

  if (!isRecord(json)) {
    return { data: null, meta: null };
  }

  return {
    data: (json.data ?? null) as T | null,
    meta: json.meta ?? null,
  };
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

const normalizeProducts = (payload: unknown): Product[] => {
  const root = payload as
    | unknown[]
    | {
        items?: unknown[];
        products?: unknown[];
        data?: unknown[] | { items?: unknown[]; products?: unknown[] };
      };

  const list: unknown[] = Array.isArray(root)
    ? root
    : Array.isArray(root?.items)
      ? root.items
      : Array.isArray(root?.products)
        ? root.products
        : Array.isArray(root?.data)
          ? root.data
          : isRecord(root?.data) && Array.isArray((root.data as { items?: unknown[] }).items)
            ? (root.data as { items?: unknown[] }).items || []
            : isRecord(root?.data) && Array.isArray((root.data as { products?: unknown[] }).products)
              ? (root.data as { products?: unknown[] }).products || []
              : [];

  return list
    .map((item) => normalizeProduct(item))
    .filter((item): item is Product => Boolean(item));
};

const normalizeListMeta = (
  rawMeta: unknown,
  fallbackPage: number,
  fallbackLimit: number,
  fallbackTotal: number,
): ProductListMeta => {
  const metaRecord = isRecord(rawMeta) ? rawMeta : {};

  const total = typeof metaRecord.total === "number" ? Math.max(0, metaRecord.total) : fallbackTotal;
  const page = typeof metaRecord.page === "number" ? Math.max(1, metaRecord.page) : fallbackPage;
  const limit = typeof metaRecord.limit === "number" ? Math.max(1, metaRecord.limit) : fallbackLimit;
  const totalPage =
    typeof metaRecord.totalPage === "number"
      ? Math.max(1, metaRecord.totalPage)
      : Math.max(1, Math.ceil(total / limit));

  return {
    total,
    page,
    limit,
    totalPage,
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

const buildProductQueryString = (params?: ProductQueryParams) => {
  if (!params) {
    return "";
  }

  const query = new URLSearchParams();

  if (typeof params.page === "number" && params.page > 0) {
    query.set("page", String(params.page));
  }

  if (typeof params.limit === "number" && params.limit > 0) {
    query.set("limit", String(params.limit));
  }

  if (typeof params.searchTerm === "string" && params.searchTerm.trim().length > 0) {
    query.set("searchTerm", params.searchTerm.trim());
  }

  if (typeof params.categoryName === "string" && params.categoryName.trim().length > 0) {
    query.set("categoryName", params.categoryName.trim());
  }

  if (typeof params.minPrice === "number" && !Number.isNaN(params.minPrice)) {
    query.set("minPrice", String(params.minPrice));
  }

  if (typeof params.maxPrice === "number" && !Number.isNaN(params.maxPrice)) {
    query.set("maxPrice", String(params.maxPrice));
  }

  if (typeof params.inStock === "boolean") {
    query.set("inStock", String(params.inStock));
  }

  if (typeof params.sortBy === "string" && params.sortBy.trim().length > 0) {
    query.set("sortBy", params.sortBy.trim());
  }

  if (params.sortOrder === "asc" || params.sortOrder === "desc") {
    query.set("sortOrder", params.sortOrder);
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

const parseProductDate = (product: Product) => {
  const timestamp = Date.parse(product.updatedAt || product.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const sortProductsLatest = (products: Product[]) => {
  return [...products].sort((a, b) => parseProductDate(b) - parseProductDate(a));
};

export const getProductsWithMeta = async (params?: ProductQueryParams) => {
  const query = buildProductQueryString(params);
  const { data: payload, meta } = await requestWithMeta<unknown>(`/products${query}`);
  const products = normalizeProducts(payload);

  const fallbackPage = typeof params?.page === "number" && params.page > 0 ? params.page : 1;
  const fallbackLimit = typeof params?.limit === "number" && params.limit > 0 ? params.limit : 12;

  return {
    data: products,
    meta: normalizeListMeta(meta, fallbackPage, fallbackLimit, products.length),
  };
};

export const getProducts = async (params?: ProductQueryParams) => {
  const result = await getProductsWithMeta(params);
  return result.data;
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

export const getRelatedProductsByCategoryId = async (categoryId: string) => {
  const trimmedCategoryId = categoryId.trim();
  if (!trimmedCategoryId) {
    return [] as Product[];
  }

  const payload = await request<unknown>(`/products/related-products/${trimmedCategoryId}`);
  return normalizeProducts(payload);
};


