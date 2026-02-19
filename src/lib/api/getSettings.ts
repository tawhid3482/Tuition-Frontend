import { API_BASE_URL } from "@/src/config/site";

export const getSettings = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      next: { revalidate: 60 * 10 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch settings");
    }

    const json = await res.json();
    return json.data || {};
  } catch {
    return {
      primaryColor: "#2563eb",
      secondaryColor: "#0f172a",
      accentColor: "#14b8a6",
      textColor: "#0f172a",
      textSecondary: "#475569",
      borderColor: "#e2e8f0",
      btnActive: "#1d4ed8",
      cardBg: "#ffffff",
      btnBg: "#2563eb",
      btnText: "#ffffff",
      btnHover: "#1d4ed8",
    };
  }
};
