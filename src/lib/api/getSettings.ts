export const getSettings = async () => {
  const res = await fetch(
    "https://code-base-backend.vercel.app/api/v1/settings",
    {
      cache: "force-cache", // ✅ SEO + FAST
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }

  const json = await res.json();
  return json.data;
};
