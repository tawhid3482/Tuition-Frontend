"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { createProductAdmin } from "@/src/lib/api/adminClient";
import { getCategories, type Category } from "@/src/lib/api/catalog";
import { getApiErrorMessage } from "./utils";

const PRODUCT_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

type ProductStatus = (typeof PRODUCT_STATUSES)[number];

type ProductForm = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  categoryId: string;
  status: ProductStatus;
};

type AdminAddProductManagerProps = {
  backHref: string;
};

const initialForm: ProductForm = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  images: "",
  categoryId: "",
  status: "ACTIVE",
};

const parseImages = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminAddProductManager({ backHref }: AdminAddProductManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ProductForm>(initialForm);

  const loadCategories = async () => {
    setLoading(true);

    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to load categories"));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.categoryId) {
      toast.error("Name, description and category are required");
      return;
    }

    setSubmitting(true);

    try {
      await createProductAdmin({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        images: parseImages(form.images),
        categoryId: form.categoryId,
        status: form.status,
      });
      toast.success("Product created");
      setForm(initialForm);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create product"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Product</h2>
            <p className="mt-1 text-sm text-slate-600">Use this route only to create a new product.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Products
            </Link>
            <button
              type="button"
              onClick={loadCategories}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh Categories"}
            </button>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Product Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Price</label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              value={form.categoryId}
              onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
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
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ProductStatus }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {PRODUCT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Image URLs</label>
            <input
              value={form.images}
              onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))}
              placeholder="https://... , https://..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </section>
  );
}
