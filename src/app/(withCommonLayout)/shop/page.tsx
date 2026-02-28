import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductActionPanel from "@/src/components/Products/ProductActionPanel";
import { getCategories, getProductsWithMeta } from "@/src/lib/api/catalog";
import { getProductDetailsPath } from "@/src/lib/productSlug";

export const metadata: Metadata = {
  title: "Shop Products",
  description: "Browse our product catalog and find the best deals.",
  alternates: { canonical: "/shop" },
};

type ShopPageSearchParams = {
  category?: string;
  searchTerm?: string;
  page?: string;
  limit?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sortBy?: string;
  sortOrder?: string;
};

type ShopPageProps = {
  searchParams?: Promise<ShopPageSearchParams>;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const DEFAULT_SORT_BY: SortByOption = "createdAt";
const DEFAULT_SORT_ORDER = "desc";

const sortByOptions = ["createdAt", "updatedAt", "price", "name", "stock"] as const;
type SortByOption = (typeof sortByOptions)[number];

type ShopQueryInput = {
  category?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: SortByOption;
  sortOrder?: "asc" | "desc";
};

const toCategorySlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const parsePositiveNumber = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
};

const parsePositiveInteger = (value?: string, fallback = 1) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
};

const parseInStock = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return undefined;
};

const parseSortBy = (value?: string): SortByOption => {
  if (!value) {
    return DEFAULT_SORT_BY;
  }

  return sortByOptions.includes(value as SortByOption)
    ? (value as SortByOption)
    : DEFAULT_SORT_BY;
};

const parseSortOrder = (value?: string) => {
  return value === "asc" ? "asc" : DEFAULT_SORT_ORDER;
};

const buildShopQuery = (params: ShopQueryInput) => {
  const query = new URLSearchParams();

  if (params.category) query.set("category", params.category);
  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (typeof params.page === "number" && params.page > DEFAULT_PAGE) query.set("page", String(params.page));
  if (typeof params.limit === "number" && params.limit !== DEFAULT_LIMIT) query.set("limit", String(params.limit));
  if (typeof params.minPrice === "number") query.set("minPrice", String(params.minPrice));
  if (typeof params.maxPrice === "number") query.set("maxPrice", String(params.maxPrice));
  if (typeof params.inStock === "boolean") query.set("inStock", String(params.inStock));
  if (params.sortBy && params.sortBy !== DEFAULT_SORT_BY) query.set("sortBy", params.sortBy);
  if (params.sortOrder && params.sortOrder !== DEFAULT_SORT_ORDER) query.set("sortOrder", params.sortOrder);

  const queryString = query.toString();
  return queryString ? `/shop?${queryString}` : "/shop";
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams: ShopPageSearchParams = searchParams
    ? await searchParams
    : {};

  const categories = await getCategories();

  const requestedCategory = resolvedSearchParams.category?.trim().toLowerCase();
  const selectedCategory = requestedCategory
    ? categories.find(
        (category) =>
          toCategorySlug(category.name) === requestedCategory ||
          category.id === requestedCategory,
      )
    : undefined;

  const currentPage = parsePositiveInteger(resolvedSearchParams.page, DEFAULT_PAGE);
  const currentLimit = parsePositiveInteger(resolvedSearchParams.limit, DEFAULT_LIMIT);
  const currentMinPrice = parsePositiveNumber(resolvedSearchParams.minPrice);
  const currentMaxPrice = parsePositiveNumber(resolvedSearchParams.maxPrice);
  const currentInStock = parseInStock(resolvedSearchParams.inStock);
  const currentSortBy = parseSortBy(resolvedSearchParams.sortBy);
  const currentSortOrder = parseSortOrder(resolvedSearchParams.sortOrder);

  const { data: products, meta } = await getProductsWithMeta({
    page: currentPage,
    limit: currentLimit,
    searchTerm: resolvedSearchParams.searchTerm?.trim() || undefined,
    categoryName: selectedCategory?.name,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    inStock: currentInStock,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  });

  const totalPages = Math.max(1, meta.totalPage);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = Math.max(1, safeCurrentPage - 2);
  const pageEnd = Math.min(totalPages, pageStart + 4);

  const preservedBaseParams: ShopQueryInput = {
    category: selectedCategory ? toCategorySlug(selectedCategory.name) : undefined,
    searchTerm: resolvedSearchParams.searchTerm?.trim() || undefined,
    limit: currentLimit,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    inStock: currentInStock,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  };

  return (
    <section className="py-8 md:py-12">
      <header className="mb-7">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          {selectedCategory ? `${selectedCategory.name} Products` : "Shop"}
        </h1>
        <p className="mt-2 text-slate-600">
          {selectedCategory
            ? `Showing products from ${selectedCategory.name}.`
            : "Discover curated products from our latest collection."}
        </p>
      </header>

      <form method="GET" className="mb-6 rounded-2xl border border-slate-200 bg-primary/5 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            name="searchTerm"
            defaultValue={resolvedSearchParams.searchTerm || ""}
            placeholder="Search by name or description"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />

          <select
            name="sortBy"
            defaultValue={currentSortBy}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="createdAt">Sort by created date</option>
            <option value="updatedAt">Sort by updated date</option>
            <option value="price">Sort by price</option>
            <option value="name">Sort by name</option>
            <option value="stock">Sort by stock</option>
          </select>

          <select
            name="sortOrder"
            defaultValue={currentSortOrder}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <select
            name="inStock"
            defaultValue={currentInStock === undefined ? "" : String(currentInStock)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="">All stock status</option>
            <option value="true">In stock only</option>
            <option value="false">Out of stock only</option>
          </select>

          <input
            type="number"
            name="minPrice"
            min={0}
            defaultValue={currentMinPrice ?? ""}
            placeholder="Min price"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />

          <input
            type="number"
            name="maxPrice"
            min={0}
            defaultValue={currentMaxPrice ?? ""}
            placeholder="Max price"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />

          <select
            name="limit"
            defaultValue={String(currentLimit)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="8">8 per page</option>
            <option value="12">12 per page</option>
            <option value="24">24 per page</option>
            <option value="48">48 per page</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-slate-700 w-full cursor-pointer"
            >
              Apply
            </button> 
            <Link
              href="/shop"
              className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-primary hover:text-secondary w-full text-center"
            >
              Reset
            </Link>
          </div>
        </div>

        {selectedCategory ? (
          <input type="hidden" name="category" value={toCategorySlug(selectedCategory.name)} />
        ) : null}
      </form>

      {categories.length > 0 ? (
        <nav aria-label="Filter products by category" className="mb-6 flex flex-wrap gap-2">
          <Link
            href={buildShopQuery({
              ...preservedBaseParams,
              category: undefined,
              page: DEFAULT_PAGE,
            })}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              !selectedCategory
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-700 hover:border-slate-500"
            }`}
          >
            All
          </Link>

          {categories.map((category) => {
            const categorySlug = toCategorySlug(category.name);
            const isActive = selectedCategory?.id === category.id;

            return (
              <Link
                key={category.id}
                href={buildShopQuery({
                  ...preservedBaseParams,
                  category: categorySlug,
                  page: DEFAULT_PAGE,
                })}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 text-slate-700 hover:border-slate-500"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      ) : null}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <p>
          Showing page {meta.page} of {meta.totalPage} � {meta.total} total products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-600">
          {selectedCategory
            ? `No products found in ${selectedCategory.name} right now.`
            : "No products found right now."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-t-2xl bg-slate-100">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : null}
                </div>

                <div className="space-y-2 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {product.category?.name ||
                      categories.find((c) => c.id === product.categoryId)?.name ||
                      "Uncategorized"}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
                    </span>
                  </div>

                  <ProductActionPanel
                    productId={product.id}
                    maxStock={product.stock}
                    detailsHref={getProductDetailsPath(product.name, product.id)}
                    showQuantitySelector={false}
                    compact={true}
                  />
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
              <Link
                href={buildShopQuery({
                  ...preservedBaseParams,
                  page: Math.max(1, safeCurrentPage - 1),
                })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  safeCurrentPage <= 1
                    ? "pointer-events-none border-slate-200 text-slate-400"
                    : "border-slate-300 text-slate-700 hover:border-slate-500"
                }`}
              >
                Prev
              </Link>

              {Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => pageStart + index).map((pageNumber) => (
                <Link
                  key={`page-${pageNumber}`}
                  href={buildShopQuery({
                    ...preservedBaseParams,
                    page: pageNumber,
                  })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    pageNumber === safeCurrentPage
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 text-slate-700 hover:border-slate-500"
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}

              <Link
                href={buildShopQuery({
                  ...preservedBaseParams,
                  page: Math.min(totalPages, safeCurrentPage + 1),
                })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  safeCurrentPage >= totalPages
                    ? "pointer-events-none border-slate-200 text-slate-400"
                    : "border-slate-300 text-slate-700 hover:border-slate-500"
                }`}
              >
                Next
              </Link>
            </nav>
          ) : null}
        </>
      )}
    </section>
  );
}
