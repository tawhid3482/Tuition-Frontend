"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createPromoCode,
  deletePromoCode,
  getPromoCodes,
  updatePromoCode,
  type PromoCodePayload,
} from "@/src/lib/api/adminClient";
import { formatDateTime, getApiErrorMessage } from "./utils";

type PromoRow = {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  usageLimit: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
};

const normalizePromoList = (payload: unknown): PromoRow[] => {
  const source = payload as
    | PromoRow[]
    | { data?: unknown[]; items?: unknown[]; promoCodes?: unknown[] }
    | undefined;

  const list = Array.isArray(source)
    ? source
    : Array.isArray(source?.promoCodes)
      ? source.promoCodes
      : Array.isArray(source?.items)
        ? source.items
        : Array.isArray(source?.data)
          ? source.data
          : [];

  return list
    .map((item) => {
      const row = item as {
        id?: string;
        _id?: string;
        code?: string;
        discountPercentage?: number;
        minOrderAmount?: number;
        usageLimit?: number;
        startsAt?: string;
        expiresAt?: string;
        isActive?: boolean;
      };

      const id = row.id || row._id;
      if (!id || !row.code) return null;

      return {
        id,
        code: row.code,
        discountPercentage: typeof row.discountPercentage === "number" ? row.discountPercentage : 0,
        minOrderAmount: typeof row.minOrderAmount === "number" ? row.minOrderAmount : 0,
        usageLimit: typeof row.usageLimit === "number" ? row.usageLimit : 0,
        startsAt: row.startsAt || "",
        expiresAt: row.expiresAt || "",
        isActive: Boolean(row.isActive),
      };
    })
    .filter((item): item is PromoRow => Boolean(item));
};

const nowIsoForInput = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const adjusted = new Date(now.getTime() - offset * 60000);
  return adjusted.toISOString().slice(0, 16);
};

const toIsoFromLocalInput = (value: string) => {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
};

const defaultCreateForm = {
  code: "",
  discountPercentage: 10,
  minOrderAmount: 0,
  usageLimit: 50,
  startsAt: nowIsoForInput(),
  expiresAt: nowIsoForInput(),
  isActive: true,
};

export default function AdminPromoCodesManager() {
  const [rows, setRows] = useState<PromoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(defaultCreateForm);

  const loadPromoCodes = async () => {
    setLoading(true);

    try {
      const payload = await getPromoCodes();
      setRows(normalizePromoList(payload));
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: PromoCodePayload = {
      code: createForm.code.trim().toUpperCase(),
      discountPercentage: Number(createForm.discountPercentage),
      minOrderAmount: Number(createForm.minOrderAmount),
      usageLimit: Number(createForm.usageLimit),
      startsAt: toIsoFromLocalInput(createForm.startsAt),
      expiresAt: toIsoFromLocalInput(createForm.expiresAt),
      isActive: Boolean(createForm.isActive),
    };

    if (!payload.code) {
      toast.error("Promo code is required");
      return;
    }

    setSubmitting(true);

    try {
      await createPromoCode(payload);
      toast.success("Promo code created");
      setCreateForm(defaultCreateForm);
      loadPromoCodes();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to create promo code"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRowUpdate = async (row: PromoRow) => {
    setUpdatingId(row.id);

    try {
      await updatePromoCode(row.id, {
        discountPercentage: row.discountPercentage,
        isActive: row.isActive,
      });
      toast.success("Promo updated");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update promo"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setUpdatingId(id);

    try {
      await deletePromoCode(id);
      toast.success("Promo deleted");
      setRows((prev) => prev.filter((row) => row.id !== id));
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to delete promo"));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Promo Codes</h2>
        <p className="mt-1 text-sm text-slate-600">Endpoints: POST/GET/PATCH/DELETE /promo-codes</p>
      </header>

      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-base font-bold text-slate-900">Create Promo</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input
            value={createForm.code}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
            placeholder="Code (EID30)"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            required
          />
          <input
            type="number"
            min={1}
            max={100}
            value={createForm.discountPercentage}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, discountPercentage: Number(e.target.value) }))}
            placeholder="Discount %"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            required
          />
          <input
            type="number"
            min={0}
            value={createForm.minOrderAmount}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
            placeholder="Min Order Amount"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            required
          />
          <input
            type="number"
            min={1}
            value={createForm.usageLimit}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))}
            placeholder="Usage Limit"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            required
          />
          <input
            type="datetime-local"
            value={createForm.startsAt}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, startsAt: e.target.value }))}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            required
          />
          <input
            type="datetime-local"
            value={createForm.expiresAt}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            required
          />
        </div>

        <label className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={createForm.isActive}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, isActive: e.target.checked }))}
          />
          Active now
        </label>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Promo"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-3 font-semibold">Code</th>
              <th className="px-4 py-3 font-semibold">Discount %</th>
              <th className="px-4 py-3 font-semibold">Min Amount</th>
              <th className="px-4 py-3 font-semibold">Usage</th>
              <th className="px-4 py-3 font-semibold">Starts</th>
              <th className="px-4 py-3 font-semibold">Expires</th>
              <th className="px-4 py-3 font-semibold">Active</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">Loading promo codes...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">No promo codes found.</td>
              </tr>
            ) : (
              rows.map((row) => {
                const isBusy = updatingId === row.id;

                return (
                  <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.code}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={row.discountPercentage}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setRows((prev) => prev.map((item) => item.id === row.id ? { ...item, discountPercentage: value } : item));
                        }}
                        className="w-24 rounded-lg border border-slate-300 px-2 py-1.5"
                      />
                    </td>
                    <td className="px-4 py-3">{row.minOrderAmount}</td>
                    <td className="px-4 py-3">{row.usageLimit}</td>
                    <td className="px-4 py-3">{formatDateTime(row.startsAt)}</td>
                    <td className="px-4 py-3">{formatDateTime(row.expiresAt)}</td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={row.isActive}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setRows((prev) => prev.map((item) => item.id === row.id ? { ...item, isActive: checked } : item));
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRowUpdate(row)}
                          disabled={isBusy}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          disabled={isBusy}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          Delete
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
