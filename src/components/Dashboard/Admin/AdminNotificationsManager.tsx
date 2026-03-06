"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  AdminNotificationType,
  AdminTargetAudience,
  sendAdminNotification,
} from "@/src/lib/api/adminClient";
import { getApiErrorMessage } from "./utils";

type NotificationForm = {
  title: string;
  message: string;
  type: AdminNotificationType;
  target_audience: AdminTargetAudience;
};

const initialForm: NotificationForm = {
  title: "",
  message: "",
  type: "info",
  target_audience: "All",
};

export default function AdminNotificationsManager() {
  const [form, setForm] = useState<NotificationForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    setSubmitting(true);

    try {
      await sendAdminNotification({
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
        target_audience: form.target_audience,
      });

      toast.success("Notification sent");
      setForm(initialForm);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to send notification"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Send Notification</h2>
        <p className="mt-1 text-sm text-slate-600">Endpoint: POST /notification/send</p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="New Update"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              className="min-h-[120px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="?? ???? ???? ??? ?????"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as AdminNotificationType }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="info">info</option>
              <option value="warning">warning</option>
              <option value="success">success</option>
              <option value="urgent">urgent</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Target Audience</label>
            <select
              value={form.target_audience}
              onChange={(e) => setForm((prev) => ({ ...prev, target_audience: e.target.value as AdminTargetAudience }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="All">All</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>
    </section>
  );
}
