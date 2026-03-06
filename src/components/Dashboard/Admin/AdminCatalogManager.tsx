"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteCategoryAdmin,
  deactivateProductAdmin,
  updateCategoryAdmin,
  updateProductAdmin,
} from "@/src/lib/api/adminClient";
import { getCategories, getProducts } from "@/src/lib/api/catalog";
import { getApiErrorMessage } from "./utils";

type CategoryLite = {
  id: string;
  name: string;
  image?: string;
};

type ProductLite = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
};

export default function AdminCatalogManager() {
  const [categories, setCategories] = useState<CategoryLite[]>([]);
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productStock, setProductStock] = useState<number>(0);
  const [productImages, setProductImages] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");

  const [busyAction, setBusyAction] = useState<string | null>(null);

  const loadCatalog = async () => {
    setLoading(true);

    try {
      const [categoriesRes, productsRes] = await Promise.all([getCategories(), getProducts()]);

      setCategories(
        categoriesRes.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
        })),
      );

      setProducts(
        productsRes.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          images: item.images || [],
          categoryId: item.categoryId,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === categoryId) || null,
    [categories, categoryId],
  );

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === productId) || null,
    [productId, products],
  );

  useEffect(() => {
    if (!selectedCategory) {
      setCategoryName("");
      setCategoryImage("");
      return;
    }

    setCategoryName(selectedCategory.name || "");
    setCategoryImage(selectedCategory.image || "");
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedProduct) {
      setProductName("");
      setProductDescription("");
      setProductPrice(0);
      setProductStock(0);
      setProductImages("");
      setProductCategoryId("");
      return;
    }

    setProductName(selectedProduct.name || "");
    setProductDescription(selectedProduct.description || "");
    setProductPrice(selectedProduct.price || 0);
    setProductStock(selectedProduct.stock || 0);
    setProductImages((selectedProduct.images || []).join(", "));
    setProductCategoryId(selectedProduct.categoryId || "");
  }, [selectedProduct]);

  const handleCategoryUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId) {
      toast.error("Select a category first");
      return;
    }

    setBusyAction("category-update");

    try {
      await updateCategoryAdmin(categoryId, {
        name: categoryName.trim(),
        image: categoryImage.trim(),
      });
      toast.success("Category updated");
      loadCatalog();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update category"));
    } finally {
      setBusyAction(null);
    }
  };

  const handleCategoryDelete = async () => {
    if (!categoryId) {
      toast.error("Select a category first");
      return;
    }

    setBusyAction("category-delete");

    try {
      await deleteCategoryAdmin(categoryId);
      toast.success("Category deleted");
      setCategoryId("");
      loadCatalog();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to delete category"));
    } finally {
      setBusyAction(null);
    }
  };

  const handleProductUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productId) {
      toast.error("Select a product first");
      return;
    }

    setBusyAction("product-update");

    try {
      await updateProductAdmin(productId, {
        name: productName.trim(),
        description: productDescription.trim(),
        price: Number(productPrice),
        stock: Number(productStock),
        images: productImages
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean),
        categoryId: productCategoryId,
      });
      toast.success("Product updated");
      loadCatalog();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update product"));
    } finally {
      setBusyAction(null);
    }
  };

  const handleProductDeactivate = async () => {
    if (!productId) {
      toast.error("Select a product first");
      return;
    }

    setBusyAction("product-delete");

    try {
      await deactivateProductAdmin(productId);
      toast.success("Product set inactive");
      setProductId("");
      loadCatalog();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to deactivate product"));
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Catalog Tools</h2>
            <p className="mt-1 text-sm text-slate-600">Endpoints: category/product PATCH + DELETE</p>
          </div>
          <button
            type="button"
            onClick={loadCatalog}
            disabled={loading}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form onSubmit={handleCategoryUpdate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Update / Delete Category</h3>

          <div className="mt-4 space-y-3">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <input
              value={categoryImage}
              onChange={(e) => setCategoryImage(e.target.value)}
              placeholder="Category image URL"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busyAction !== null}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busyAction === "category-update" ? "Updating..." : "Update Category"}
            </button>
            <button
              type="button"
              onClick={handleCategoryDelete}
              disabled={busyAction !== null}
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busyAction === "category-delete" ? "Deleting..." : "Delete Category"}
            </button>
          </div>
        </form>

        <form onSubmit={handleProductUpdate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Update / Inactivate Product</h3>

          <div className="mt-4 space-y-3">
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select product</option>
              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product name"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Description"
              className="min-h-[90px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="number"
                min={0}
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                placeholder="Price"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                min={0}
                value={productStock}
                onChange={(e) => setProductStock(Number(e.target.value))}
                placeholder="Stock"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <input
              value={productImages}
              onChange={(e) => setProductImages(e.target.value)}
              placeholder="Images (comma separated URLs)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <select
              value={productCategoryId}
              onChange={(e) => setProductCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busyAction !== null}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busyAction === "product-update" ? "Updating..." : "Update Product"}
            </button>
            <button
              type="button"
              onClick={handleProductDeactivate}
              disabled={busyAction !== null}
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busyAction === "product-delete" ? "Inactivating..." : "Inactivate Product"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
