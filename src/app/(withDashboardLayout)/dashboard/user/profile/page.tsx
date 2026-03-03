"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import UserDashboardShell from "@/src/components/Dashboard/User/UserDashboardShell";
import useAuth from "@/src/hooks/useAuth";
import { useUpdateProfileMutation } from "@/src/redux/features/auth/authApi";

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
};

export default function UserProfilePage() {
  const { user } = useAuth();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const initialState = useMemo<FormState>(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      avatar: user?.avatar || "",
    }),
    [user?.address, user?.avatar, user?.email, user?.name, user?.phone],
  );

  const [form, setForm] = useState<FormState>(initialState);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        avatar: form.avatar,
      }).unwrap();

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <UserDashboardShell
      title="Update Profile"
      description="Keep your personal details updated for smoother deliveries and account safety."
    >
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Avatar URL</label>
            <input
              value={form.avatar}
              onChange={(e) => setForm((prev) => ({ ...prev, avatar: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="House, Road, Area, District"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </UserDashboardShell>
  );
}

