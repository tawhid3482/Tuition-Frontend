"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllUsersAdmin } from "@/src/lib/api/adminClient";
import { getApiErrorMessage, formatDateTime } from "./utils";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

const normalizeUsers = (payload: unknown): UserRow[] => {
  const source = payload as
    | UserRow[]
    | { data?: unknown[]; users?: unknown[]; items?: unknown[] }
    | undefined;

  const list = Array.isArray(source)
    ? source
    : Array.isArray(source?.users)
      ? source.users
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
        name?: string;
        email?: string;
        role?: string;
        createdAt?: string;
      };

      const id = row.id || row._id;
      if (!id) return null;

      return {
        id,
        name: row.name || "-",
        email: row.email || "-",
        role: row.role || "USER",
        createdAt: row.createdAt,
      };
    })
    .filter((row): row is UserRow => Boolean(row));
};

const getRoleClass = (role: string) => {
  const normalized = role.toUpperCase();
  if (normalized === "SUPER_ADMIN") return "bg-amber-100 text-amber-700";
  if (normalized === "ADMIN") return "bg-blue-100 text-blue-700";
  if (normalized === "MANAGER") return "bg-purple-100 text-purple-700";
  return "bg-slate-100 text-slate-700";
};

export default function AdminUsersManager() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = await getAllUsersAdmin();
      setUsers(normalizeUsers(payload));
    } catch (err: unknown) {
      setUsers([]);
      setError(getApiErrorMessage(err, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    });
  }, [search, users]);

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All Users</h2>
            <p className="mt-1 text-sm text-slate-600">Endpoint: GET /user/allUsers</p>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatDateTime(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
