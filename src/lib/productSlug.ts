export const toProductSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getProductDetailsPath = (name: string, productId?: string) => {
  const slugPath = `/products/${toProductSlug(name)}`;

  if (!productId) {
    return slugPath;
  }

  return `${slugPath}?pid=${encodeURIComponent(productId)}`;
};
