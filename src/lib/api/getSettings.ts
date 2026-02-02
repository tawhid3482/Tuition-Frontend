export const getSettings = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_API}/settings`,
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
