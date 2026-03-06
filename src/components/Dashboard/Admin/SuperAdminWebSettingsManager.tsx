"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createOrUpdateWebSetting,
  getWebsiteSettingsAdmin,
  type WebSettingPayload,
} from "@/src/lib/api/adminClient";
import { getApiErrorMessage } from "./utils";

const fallbackSettings: WebSettingPayload = {
  primaryColor: "#0ea5e9",
  secondaryColor: "#111827",
  accentColor: "#f59e0b",
  textColor: "#111827",
  textSecondary: "#6b7280",
  background: "#ffffff",
  cardBg: "#f8fafc",
  borderColor: "#e5e7eb",
  hoverPrimary: "#0284c7",
  hoverSecondary: "#1f2937",
  hoverAccent: "#d97706",
  btnBg: "#0ea5e9",
  btnHover: "#0284c7",
  btnActive: "#0369a1",
  btnText: "#ffffff",
  fb_pixel: "",
  google_tag_manager: "",
};

const pickString = (value: unknown, fallback: string) => {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
};

const normalizeWebSettings = (payload: unknown): WebSettingPayload => {
  const row = payload as Partial<WebSettingPayload> | undefined;

  return {
    primaryColor: pickString(row?.primaryColor, fallbackSettings.primaryColor),
    secondaryColor: pickString(row?.secondaryColor, fallbackSettings.secondaryColor),
    accentColor: pickString(row?.accentColor, fallbackSettings.accentColor),
    textColor: pickString(row?.textColor, fallbackSettings.textColor),
    textSecondary: pickString(row?.textSecondary, fallbackSettings.textSecondary),
    background: pickString(row?.background, fallbackSettings.background),
    cardBg: pickString(row?.cardBg, fallbackSettings.cardBg),
    borderColor: pickString(row?.borderColor, fallbackSettings.borderColor),
    hoverPrimary: pickString(row?.hoverPrimary, fallbackSettings.hoverPrimary),
    hoverSecondary: pickString(row?.hoverSecondary, fallbackSettings.hoverSecondary),
    hoverAccent: pickString(row?.hoverAccent, fallbackSettings.hoverAccent),
    btnBg: pickString(row?.btnBg, fallbackSettings.btnBg),
    btnHover: pickString(row?.btnHover, fallbackSettings.btnHover),
    btnActive: pickString(row?.btnActive, fallbackSettings.btnActive),
    btnText: pickString(row?.btnText, fallbackSettings.btnText),
    fb_pixel: pickString(row?.fb_pixel, ""),
    google_tag_manager: pickString(row?.google_tag_manager, ""),
  };
};

export default function SuperAdminWebSettingsManager() {
  const [form, setForm] = useState<WebSettingPayload>(fallbackSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    setLoading(true);

    try {
      const payload = await getWebsiteSettingsAdmin();
      setForm(normalizeWebSettings(payload));
    } catch {
      setForm(fallbackSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createOrUpdateWebSetting(form);
      toast.success("Web settings updated");
      loadSettings();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update web settings"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Web Settings (Super Admin)</h2>
        <p className="mt-1 text-sm text-slate-600">Endpoint: POST /settings/create-web-setting</p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "primaryColor",
            "secondaryColor",
            "accentColor",
            "textColor",
            "textSecondary",
            "background",
            "cardBg",
            "borderColor",
            "hoverPrimary",
            "hoverSecondary",
            "hoverAccent",
            "btnBg",
            "btnHover",
            "btnActive",
            "btnText",
          ].map((key) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium capitalize text-slate-700">{key}</label>
              <input
                value={form[key as keyof WebSettingPayload] as string}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">fb_pixel</label>
            <input
              value={form.fb_pixel || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, fb_pixel: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="PIXEL_ID"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">google_tag_manager</label>
            <input
              value={form.google_tag_manager || ""}
              onChange={(e) => setForm((prev) => ({ ...prev, google_tag_manager: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="GTM-XXXX"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={loadSettings}
            disabled={loading || saving}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            Reload
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Web Settings"}
          </button>
        </div>
      </form>
    </section>
  );
}
