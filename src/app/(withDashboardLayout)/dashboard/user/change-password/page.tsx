"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserDashboardShell from "@/src/components/Dashboard/User/UserDashboardShell";
import { useChangePasswordMutation, useLogOutMutation } from "@/src/redux/features/auth/authApi";

type PasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const defaultForm: PasswordForm = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState<PasswordForm>(defaultForm);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [logout] = useLogOutMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Password confirmation does not match");
      return;
    }

    try {
      await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      }).unwrap();

      toast.success("Password changed. Please login again.");
      setForm(defaultForm);

      try {
        await logout({}).unwrap();
      } catch {
        // Redirect to login even if explicit logout endpoint fails.
      }

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 400);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <UserDashboardShell
      title="Change Password"
      description="Use a strong new password to keep your account secure."
    >
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              value={form.oldPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Confirm New Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>
    </UserDashboardShell>
  );
}
