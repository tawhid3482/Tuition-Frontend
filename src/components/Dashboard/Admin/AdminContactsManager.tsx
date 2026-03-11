"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PencilLine, RefreshCw, Save, X } from "lucide-react";
import {
  getContactsAdmin,
  updateContactAdmin,
  type ContactPriority,
  type ContactStatus,
} from "@/src/lib/api/adminClient";
import { formatDateTime, getApiErrorMessage } from "./utils";

const CONTACT_STATUSES: ContactStatus[] = ["Pending", "Resolved", "Closed"];
const CONTACT_PRIORITIES: ContactPriority[] = ["Urgent", "Normal"];

type ContactRow = {
  id: string;
  name: string;
  email: string;
  title: string;
  message: string;
  subject?: string;
  priority: ContactPriority;
  status: ContactStatus;
  createdAt?: string;
};

type ContactDraft = {
  title: string;
  message: string;
  priority: ContactPriority;
  status: ContactStatus;
};

const normalizeStatus = (value: unknown): ContactStatus => {
  return value === "Resolved" || value === "Closed" ? value : "Pending";
};

const normalizePriority = (value: unknown): ContactPriority => {
  return value === "Urgent" ? "Urgent" : "Normal";
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
      title?: string;
      subject?: string;
      message?: string;
      priority?: string;
      status?: string;
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
      title: row.title || row.subject || "",
      subject: row.subject,
      message: row.message || "",
      priority: normalizePriority(row.priority),
      status: normalizeStatus(row.status),
      createdAt: row.createdAt,
    });

    return acc;
  }, []);
};

export default function AdminContactsManager() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ContactDraft>>({});

  const loadContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await getContactsAdmin();
      const normalized = normalizeContacts(payload);
      setRows(normalized);
      setDrafts(
        normalized.reduce<Record<string, ContactDraft>>((acc, row) => {
          acc[row.id] = {
            title: row.title || "",
            message: row.message || "",
            priority: row.priority,
            status: row.status,
          };
          return acc;
        }, {}),
      );
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

  const editingDraft = useMemo(() => {
    if (!editingId) {
      return null;
    }

    return drafts[editingId] || null;
  }, [drafts, editingId]);

  const handleSave = async (contactId: string) => {
    const draft = drafts[contactId];
    if (!draft) {
      return;
    }

    setBusyId(contactId);

    try {
      await updateContactAdmin(contactId, {
        title: draft.title.trim() || undefined,
        message: draft.message.trim() || undefined,
        priority: draft.priority,
        status: draft.status,
      });
      toast.success("Contact updated");
      setEditingId(null);
      await loadContacts();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update contact"));
    } finally {
      setBusyId(null);
    }
  };

  const handleQuickStatus = async (contactId: string, status: ContactStatus) => {
    setBusyId(contactId);

    try {
      await updateContactAdmin(contactId, { status });
      toast.success(`Contact marked ${status.toLowerCase()}`);
      await loadContacts();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update status"));
    } finally {
      setBusyId(null);
    }
  };

  const handleEditStart = (contactId: string) => {
    setEditingId(contactId);
  };

  const handleEditCancel = (contactId: string) => {
    const source = rows.find((row) => row.id === contactId);
    if (source) {
      setDrafts((prev) => ({
        ...prev,
        [contactId]: {
          title: source.title || "",
          message: source.message || "",
          priority: source.priority,
          status: source.status,
        },
      }));
    }
    setEditingId(null);
  };

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Contact Messages</h2>
            <p className="mt-1 text-sm text-slate-600">GET `/contact` and PATCH `/contact/:contactId` from dashboard.</p>
          </div>
          <button
            type="button"
            onClick={loadContacts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1220px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">Loading messages...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">No messages found.</td>
              </tr>
            ) : (
              rows.map((row) => {
                const isEditing = editingId === row.id;
                const draft = drafts[row.id] || {
                  title: row.title || "",
                  message: row.message || "",
                  priority: row.priority,
                  status: row.status,
                };

                return (
                  <tr key={row.id} className="border-b border-slate-100 align-top text-slate-700">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <p>{row.name}</p>
                      <p className="mt-1 text-xs font-normal text-slate-500">{row.id}</p>
                    </td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          value={draft.title}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [row.id]: { ...draft, title: event.target.value },
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <p className="max-w-[180px]">{row.title || row.subject || "-"}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <textarea
                          value={draft.message}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [row.id]: { ...draft, message: event.target.value },
                            }))
                          }
                          rows={4}
                          className="min-h-[108px] w-[260px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <p className="max-w-[260px] whitespace-pre-wrap break-words">{row.message || "-"}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={draft.priority}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [row.id]: { ...draft, priority: normalizePriority(event.target.value) },
                            }))
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        >
                          {CONTACT_PRIORITIES.map((priority) => (
                            <option key={`${row.id}-${priority}`} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.priority === "Urgent" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {row.priority}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={draft.status}
                          onChange={(event) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [row.id]: { ...draft, status: normalizeStatus(event.target.value) },
                            }))
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        >
                          {CONTACT_STATUSES.map((status) => (
                            <option key={`${row.id}-${status}`} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {row.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{formatDateTime(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSave(row.id)}
                              disabled={busyId === row.id}
                              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                            >
                              <Save className="h-3.5 w-3.5" />
                              {busyId === row.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditCancel(row.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              <X className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEditStart(row.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickStatus(row.id, row.status === "Pending" ? "Resolved" : "Pending")}
                              disabled={busyId === row.id}
                              className="rounded-full border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-60"
                            >
                              {busyId === row.id
                                ? "Saving..."
                                : row.status === "Pending"
                                  ? "Mark Resolved"
                                  : "Mark Pending"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickStatus(row.id, "Closed")}
                              disabled={busyId === row.id}
                              className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                            >
                              Close
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editingId && editingDraft ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-slate-700">
          Editing contact: <span className="font-semibold text-slate-900">{editingId}</span>
        </div>
      ) : null}
    </section>
  );
}
