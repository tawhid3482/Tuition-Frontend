"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PencilLine, RefreshCw, Trash2 } from "lucide-react";
import {
  createCategoryAdmin,
  deleteCategoryAdmin,
  updateCategoryAdmin,
  type CategoryCreatePayload,
} from "@/src/lib/api/adminClient";
import { getCategories, type Category } from "@/src/lib/api/catalog";
import { getApiErrorMessage } from "./utils";

const CATEGORY_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

type CategoryStatus = (typeof CATEGORY_STATUSES)[number];

type CategoryDraft = {
  name: string;
  image: string;
  status: CategoryStatus;
};

const emptyCreateForm: CategoryCreatePayload = {
  name: "",
  image: "",
  status: "ACTIVE",
};

const normalizeStatus = (value: unknown): CategoryStatus => {
  return value === "INACTIVE" || value === "SUSPENDED" ? value : "ACTIVE";
};

export default function AdminCategoriesManager() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<CategoryDraft>({
    name: "",
    image: "",
    status: "ACTIVE",
  });
  const [createForm, setCreateForm] = useState<CategoryCreatePayload>(emptyCreateForm);

  const loadCategories = async () => {
    setLoading(true);

    try {
      const categories = await getCategories();
      setRows(categories);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to load categories"));
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const selectedCategory = useMemo(
    () => rows.find((item) => item.id === selectedId) || null,
    [rows, selectedId],
  );

  useEffect(() => {
    if (!selectedCategory) {
      setDraft({ name: "", image: "", status: "ACTIVE" });
      return;
    }

    setDraft({
      name: selectedCategory.name || "",
      image: selectedCategory.image || "",
      status: normalizeStatus(selectedCategory.status),
    });
  }, [selectedCategory]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!createForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setBusyKey("create-category");

    try {
      await createCategoryAdmin({
        name: createForm.name.trim(),
        image: createForm.image?.trim() || undefined,
        status: normalizeStatus(createForm.status),
      });
      toast.success("Category created");
      setCreateForm(emptyCreateForm);
      await loadCategories();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create category"));
    } finally {
      setBusyKey(null);
    }
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedId) {
      toast.error("Select a category first");
      return;
    }

    if (!draft.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setBusyKey(`update-${selectedId}`);

    try {
      await updateCategoryAdmin(selectedId, {
        name: draft.name.trim(),
        image: draft.image.trim() || undefined,
        status: draft.status,
      });
      toast.success("Category updated");
      await loadCategories();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update category"));
    } finally {
      setBusyKey(null);
    }
  };

  const handleDelete = async (categoryId: string) => {
    setBusyKey(`delete-${categoryId}`);

    try {
      await deleteCategoryAdmin(categoryId);
      toast.success("Category deleted");
      if (selectedId === categoryId) {
        setSelectedId("");
      }
      await loadCategories();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to delete category"));
    } finally {
      setBusyKey(null);
    }
  };

  const handleQuickStatus = async (categoryId: string, status: CategoryStatus) => {
    setBusyKey(`status-${categoryId}`);

    try {
      await updateCategoryAdmin(categoryId, { status });
      toast.success(`Category marked ${status.toLowerCase()}`);
      await loadCategories();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update category status"));
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Category Management</h2>
            <p className="mt-1 text-sm text-slate-600">Create, edit, activate, inactivate, suspend or delete categories.</p>
          </div>
          <button
            type="button"
            onClick={loadCategories}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Add Category</h3>

          <div className="mt-4 space-y-3">
            <input
              value={createForm.name}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Category name"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <input
              value={createForm.image || ""}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, image: event.target.value }))}
              placeholder="Category image URL"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <select
              value={createForm.status || "ACTIVE"}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, status: normalizeStatus(event.target.value) }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {CATEGORY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={busyKey !== null}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {busyKey === "create-category" ? "Adding..." : "Add Category"}
          </button>
        </form>

        <form onSubmit={handleUpdate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Update Category</h3>

          <div className="mt-4 space-y-3">
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select category</option>
              {rows.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Category name"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <input
              value={draft.image}
              onChange={(event) => setDraft((prev) => ({ ...prev, image: event.target.value }))}
              placeholder="Category image URL"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <select
              value={draft.status}
              onChange={(event) => setDraft((prev) => ({ ...prev, status: normalizeStatus(event.target.value) }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {CATEGORY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={busyKey !== null}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {busyKey === `update-${selectedId}` ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Products</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading categories...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No categories found.</td>
              </tr>
            ) : (
              rows.map((row) => {
                const rowStatus = normalizeStatus(row.status);

                return (
                  <tr key={row.id} className="border-b border-slate-100 align-top text-slate-700">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{row.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{row.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      {row.image ? (
                        <a href={row.image} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                          View image
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">{row.activeProductCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {rowStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedId(row.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          <PencilLine className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(row.id, rowStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                          disabled={busyKey === `status-${row.id}`}
                          className="rounded-full border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-60"
                        >
                          {busyKey === `status-${row.id}`
                            ? "Saving..."
                            : rowStatus === "ACTIVE"
                              ? "Set Inactive"
                              : "Set Active"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(row.id, "SUSPENDED")}
                          disabled={busyKey === `status-${row.id}`}
                          className="rounded-full border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-60"
                        >
                          Suspend
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          disabled={busyKey === `delete-${row.id}`}
                          className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {busyKey === `delete-${row.id}` ? "Deleting..." : "Delete"}
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
    </section>
  );
}
