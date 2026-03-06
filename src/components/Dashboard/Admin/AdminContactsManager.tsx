"use client";

import { useEffect, useState } from "react";
import { getContactsAdmin } from "@/src/lib/api/adminClient";
import { formatDateTime, getApiErrorMessage } from "./utils";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  createdAt?: string;
};

const normalizeContacts = (payload: unknown): ContactRow[] => {
  const source = payload as
    | ContactRow[]
    | { data?: unknown[]; items?: unknown[]; contacts?: unknown[] }
    | undefined;

  const list = Array.isArray(source)
    ? source
    : Array.isArray(source?.contacts)
      ? source.contacts
      : Array.isArray(source?.items)
        ? source.items
        : Array.isArray(source?.data)
          ? source.data
          : [];

  return list.reduce<ContactRow[]>((acc, item) => {
    const row = item as {
      id?: string;
      _id?: string;
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      createdAt?: string;
    };

    const id = row.id || row._id;
    if (!id) {
      return acc;
    }

    acc.push({
      id,
      name: row.name || "-",
      email: row.email || "-",
      subject: row.subject,
      message: row.message || "",
      createdAt: row.createdAt,
    });

    return acc;
  }, []);
};

export default function AdminContactsManager() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await getContactsAdmin();
      setRows(normalizeContacts(payload));
    } catch (err: unknown) {
      setRows([]);
      setError(getApiErrorMessage(err, "Failed to load contact messages"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Contact Messages</h2>
            <p className="mt-1 text-sm text-slate-600">Endpoint: GET /contact</p>
          </div>
          <button
            type="button"
            onClick={loadContacts}
            disabled={loading}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading messages...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No messages found.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.subject || "-"}</td>
                  <td className="px-4 py-3">
                    <p className="max-w-[420px] truncate" title={row.message}>
                      {row.message || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3">{formatDateTime(row.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

