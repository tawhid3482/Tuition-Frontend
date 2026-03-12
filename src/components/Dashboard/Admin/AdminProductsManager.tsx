"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, PencilLine, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { deactivateProductAdmin, updateProductAdmin } from "@/src/lib/api/adminClient";
import {
  getCategories,
  getProductsWithMeta,
  type Category,
  type Product,
  type ProductListMeta,
} from "@/src/lib/api/catalog";
import { formatPriceBDT } from "@/src/lib/formatCurrency";
import { getApiErrorMessage } from "./utils";

const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;
const STOCK_FILTERS = ["ALL", "IN_STOCK", "OUT_OF_STOCK"] as const;
const SORT_BY_OPTIONS = ["createdAt", "updatedAt", "price", "name", "stock"] as const;

type ProductStatus = (typeof PRODUCT_STATUSES)[number];
type StockFilter = (typeof STOCK_FILTERS)[number];
type SortByOption = (typeof SORT_BY_OPTIONS)[number];

type ProductDraft = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  categoryId: string;
  status: ProductStatus;
};

type ProductFilters = {
  page: number;
  limit: number;
  searchTerm: string;
  status: ProductStatus | "ALL";
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  stockFilter: StockFilter;
  sortBy: SortByOption;
  sortOrder: "asc" | "desc";
};

type AdminProductsManagerProps = {
  addProductHref: string;
};

type ModalFrameProps = {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
};

const emptyDraft: ProductDraft = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  images: "",
  categoryId: "",
  status: "ACTIVE",
};

const defaultFilters: ProductFilters = {
  page: 1,
  limit: 10,
  searchTerm: "",
  status: "ALL",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  stockFilter: "ALL",
  sortBy: "updatedAt",
  sortOrder: "desc",
};

const defaultMeta: ProductListMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPage: 1,
};

const stockFilterLabels: Record<StockFilter, string> = {
  ALL: "All stock",
  IN_STOCK: "In stock",
  OUT_OF_STOCK: "Out of stock",
};

const sortByLabels: Record<SortByOption, string> = {
  updatedAt: "Updated date",
  createdAt: "Created date",
  price: "Price",
  name: "Name",
  stock: "Stock",
};

const normalizeStatus = (value: unknown): ProductStatus => {
  return value === "INACTIVE" || value === "SUSPENDED" ? value : "ACTIVE";
};

const parseImages = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseOptionalNumber = (value: string) => {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

const createDraftFromProduct = (product: Product): ProductDraft => ({
  name: product.name || "",
  description: product.description || "",
  price: product.price || 0,
  stock: product.stock || 0,
  images: (product.images || []).join(", "),
  categoryId: product.categoryId || "",
  status: normalizeStatus(product.status),
});

function ModalFrame({ title, description, onClose, children }: ModalFrameProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function AdminProductsManager({ addProductHref }: AdminProductsManagerProps) {
  const [rows, setRows] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<ProductListMeta>(defaultMeta);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);

  const loadCatalog = async (nextFilters: ProductFilters) => {
    setLoading(true);

    try {
      const selectedCategory = categories.find((category) => category.id === nextFilters.categoryId);
      const { data, meta: nextMeta } = await getProductsWithMeta({
        page: nextFilters.page,
        limit: nextFilters.limit,
        searchTerm: nextFilters.searchTerm.trim() || undefined,
        status: nextFilters.status === "ALL" ? undefined : nextFilters.status,
        categoryName: selectedCategory?.name,
        minPrice: parseOptionalNumber(nextFilters.minPrice),
        maxPrice: parseOptionalNumber(nextFilters.maxPrice),
        inStock:
          nextFilters.stockFilter === "IN_STOCK"
            ? true
            : nextFilters.stockFilter === "OUT_OF_STOCK"
              ? false
              : undefined,
        sortBy: nextFilters.sortBy,
        sortOrder: nextFilters.sortOrder,
      });

      setRows(data);
      setMeta(nextMeta);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to load products"));
      setRows([]);
      setMeta(defaultMeta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      try {
        const catalogCategories = await getCategories();
        setCategories(catalogCategories);

        const { data, meta: nextMeta } = await getProductsWithMeta({
          page: defaultFilters.page,
          limit: defaultFilters.limit,
          sortBy: defaultFilters.sortBy,
          sortOrder: defaultFilters.sortOrder,
        });

        setRows(data);
        setMeta(nextMeta);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Failed to load products"));
        setRows([]);
        setCategories([]);
        setMeta(defaultMeta);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    setSearchInput(filters.searchTerm);
  }, [filters.searchTerm]);

  const editProduct = useMemo(
    () => rows.find((item) => item.id === editProductId) || null,
    [editProductId, rows],
  );

  const deleteProduct = useMemo(
    () => rows.find((item) => item.id === deleteProductId) || null,
    [deleteProductId, rows],
  );

  useEffect(() => {
    if (!editProduct) {
      setDraft(emptyDraft);
      return;
    }

    setDraft(createDraftFromProduct(editProduct));
  }, [editProduct]);

  const openEditModal = (product: Product) => {
    setEditProductId(product.id);
    setDraft(createDraftFromProduct(product));
  };

  const closeEditModal = () => {
    if (busyKey?.startsWith("update-")) {
      return;
    }

    setEditProductId(null);
    setDraft(emptyDraft);
  };

  const openDeleteModal = (productId: string) => {
    setDeleteProductId(productId);
  };

  const closeDeleteModal = () => {
    if (busyKey?.startsWith("delete-")) {
      return;
    }

    setDeleteProductId(null);
  };

  const applyFilters = async (nextFilters: ProductFilters) => {
    setFilters(nextFilters);
    await loadCatalog(nextFilters);
  };

  const handleFilterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await applyFilters({
      ...filters,
      page: 1,
      searchTerm: searchInput,
    });
  };

  const handleFilterChange = async <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    const nextFilters = {
      ...filters,
      [key]: value,
      page: 1,
    };

    await applyFilters(nextFilters);
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > meta.totalPage || page === filters.page) {
      return;
    }

    await applyFilters({
      ...filters,
      page,
    });
  };

  const handleRefresh = async () => {
    await loadCatalog(filters);
  };

  const handleReset = async () => {
    setSearchInput("");
    await applyFilters(defaultFilters);
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editProductId) {
      toast.error("Select a product first");
      return;
    }

    if (!draft.name.trim() || !draft.description.trim() || !draft.categoryId) {
      toast.error("Name, description and category are required");
      return;
    }

    setBusyKey(`update-${editProductId}`);

    try {
      await updateProductAdmin(editProductId, {
        name: draft.name.trim(),
        description: draft.description.trim(),
        price: Number(draft.price),
        stock: Number(draft.stock),
        images: parseImages(draft.images),
        categoryId: draft.categoryId,
        status: draft.status,
      });
      toast.success("Product updated");
      setEditProductId(null);
      setDraft(emptyDraft);
      await loadCatalog(filters);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update product"));
    } finally {
      setBusyKey(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) {
      return;
    }

    setBusyKey(`delete-${deleteProductId}`);

    try {
      await deactivateProductAdmin(deleteProductId);
      toast.success("Product deleted");
      setDeleteProductId(null);

      const nextPage =
        rows.length === 1 && filters.page > 1 ? Math.max(1, filters.page - 1) : filters.page;
      const nextFilters = { ...filters, page: nextPage };
      setFilters(nextFilters);
      await loadCatalog(nextFilters);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to delete product"));
    } finally {
      setBusyKey(null);
    }
  };

  const totalPages = Math.max(1, meta.totalPage);

  return (
    <>
      <section className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Manage Products</h2>
              <p className="mt-1 text-sm text-slate-600">
                Search, filter, sort and paginate products with backend-powered controls.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={addProductHref}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </header>

        <form onSubmit={handleFilterSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Name or description"
                  className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
              <select
                value={filters.status}
                onChange={(event) => handleFilterChange("status", event.target.value as ProductStatus | "ALL")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="ALL">All status</option>
                {PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
              <select
                value={filters.categoryId}
                onChange={(event) => handleFilterChange("categoryId", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Stock</span>
              <select
                value={filters.stockFilter}
                onChange={(event) => handleFilterChange("stockFilter", event.target.value as StockFilter)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {STOCK_FILTERS.map((stockFilter) => (
                  <option key={stockFilter} value={stockFilter}>
                    {stockFilterLabels[stockFilter]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Min Price</span>
              <input
                type="number"
                min={0}
                value={filters.minPrice}
                onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Max Price</span>
              <input
                type="number"
                min={0}
                value={filters.maxPrice}
                onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Sort By</span>
              <select
                value={filters.sortBy}
                onChange={(event) => handleFilterChange("sortBy", event.target.value as SortByOption)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {SORT_BY_OPTIONS.map((sortOption) => (
                  <option key={sortOption} value={sortOption}>
                    {sortByLabels[sortOption]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Order / Per Page</span>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filters.sortOrder}
                  onChange={(event) => handleFilterChange("sortOrder", event.target.value as "asc" | "desc")}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
                <select
                  value={String(filters.limit)}
                  onChange={(event) => handleFilterChange("limit", Number(event.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          <p>
            Showing page {meta.page} of {totalPages} | {meta.total} total products
          </p>
          <p>Current page items: {rows.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="w-[1%] whitespace-nowrap pl-2 pr-2 py-3 font-semibold">Product</th>
                <th className="w-[1%] whitespace-nowrap px-2 py-3 font-semibold">Category</th>
                <th className="whitespace-nowrap px-3 py-3 font-semibold">Price</th>
                <th className="whitespace-nowrap px-3 py-3 font-semibold">Stock</th>
                <th className="whitespace-nowrap px-3 py-3 font-semibold">Status</th>
                <th className="whitespace-nowrap px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No products found for the current filters.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const rowStatus = normalizeStatus(row.status);
                  const imageSrc = row.images?.find((image) => typeof image === "string" && image.trim().length > 0);

                  return (
                    <tr key={row.id} className="border-b border-slate-100 align-top text-slate-700">
                      <td className="pl-2 pr-2 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                            {imageSrc ? (
                              <Image src={imageSrc} alt={row.name} fill className="object-cover" sizes="48px" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                                {(row.name || "?").slice(0, 1).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <p
                            className="inline-block max-w-[200px] truncate font-semibold text-slate-900"
                            title={row.name}
                          >
                            {row.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <p className="inline-block max-w-[150px] truncate mr-5" title={row.category?.name || row.categoryId}>
                          {row.category?.name || row.categoryId}
                        </p>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-900">{formatPriceBDT(row.price)}</td>
                      <td className="px-3 py-3">{row.stock}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {rowStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100"
                            aria-label={`Edit ${row.name}`}
                            title="Edit"
                          >
                            <PencilLine className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(row.id)}
                            className="rounded-full bg-rose-600 p-2 text-white transition hover:bg-rose-700"
                            aria-label={`Delete ${row.name}`}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={loading || meta.page <= 1}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Page {meta.page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={loading || meta.page >= totalPages}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {editProduct ? (
        <ModalFrame
          title="Update Product"
          description={`Update ${editProduct.name} from the manage products route.`}
          onClose={closeEditModal}
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Product Name</label>
              <input
                value={draft.name}
                onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={draft.description}
                onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
                rows={5}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
                <input
                  type="number"
                  min={0}
                  value={draft.price}
                  onChange={(event) => setDraft((prev) => ({ ...prev, price: Number(event.target.value) }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
                <input
                  type="number"
                  min={0}
                  value={draft.stock}
                  onChange={(event) => setDraft((prev) => ({ ...prev, stock: Number(event.target.value) }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Image URLs</label>
              <input
                value={draft.images}
                onChange={(event) => setDraft((prev) => ({ ...prev, images: event.target.value }))}
                placeholder="https://... , https://..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                <select
                  value={draft.categoryId}
                  onChange={(event) => setDraft((prev) => ({ ...prev, categoryId: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={draft.status}
                  onChange={(event) => setDraft((prev) => ({ ...prev, status: normalizeStatus(event.target.value) }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  {PRODUCT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 -mx-5 flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-white px-5 pt-4 pb-1">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={busyKey === `update-${editProduct.id}`}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busyKey !== null}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {busyKey === `update-${editProduct.id}` ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </ModalFrame>
      ) : null}

      {deleteProduct ? (
        <ModalFrame
          title="Delete Product"
          description={`Delete ${deleteProduct.name}. This action removes it from the product list.`}
          onClose={closeDeleteModal}
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              Are you sure you want to delete this product? Please confirm before continuing.
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{deleteProduct.name}</p>
              <p className="mt-1 text-sm text-slate-600">{deleteProduct.description || "No description available."}</p>
              <p className="mt-2 text-sm text-slate-700">
                Price: <span className="font-semibold text-slate-900">{formatPriceBDT(deleteProduct.price)}</span>
              </p>
            </div>

            <div className="sticky bottom-0 -mx-5 flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-white px-5 pt-4 pb-1">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={busyKey === `delete-${deleteProduct.id}`}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busyKey !== null}
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {busyKey === `delete-${deleteProduct.id}` ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </ModalFrame>
      ) : null}
    </>
  );
}
