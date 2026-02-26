import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductActionPanel from "@/src/components/Products/ProductActionPanel";
import { getCategories, getProducts } from "@/src/lib/api/catalog";
import { getProductDetailsPath } from "@/src/lib/productSlug";

export const metadata: Metadata = {
  title: "Shop Products",
  description: "Browse our product catalog and find the best deals.",
  alternates: { canonical: "/shop" },
};

type ShopPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

const toCategorySlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [products, categories, resolvedSearchParams] = await Promise.all([
    getProducts(),
    getCategories(),
    searchParams ? searchParams : Promise.resolve({} as { category?: string }),
  ]);

  const requestedCategory = resolvedSearchParams.category?.trim().toLowerCase();

  const selectedCategory = requestedCategory
    ? categories.find(
        (category) => toCategorySlug(category.name) === requestedCategory || category.id === requestedCategory,
      )
    : undefined;

  const visibleProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory.id)
    : products;

  return (
    <section className="py-8 md:py-12">
      <header className="mb-7">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          {selectedCategory ? `${selectedCategory.name} Products` : "Shop"}
        </h1>
        <p className="mt-2 text-slate-600">
          {selectedCategory
            ? `Showing products from ${selectedCategory.name}.`
            : "Discover curated products from our latest collection."}
        </p>
      </header>

      {categories.length > 0 ? (
        <nav aria-label="Filter products by category" className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              !selectedCategory
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 text-slate-700 hover:border-slate-500"
            }`}
          >
            All
          </Link>

          {categories.map((category) => {
            const categorySlug = toCategorySlug(category.name);
            const isActive = selectedCategory?.id === category.id;

            return (
              <Link
                key={category.id}
                href={`/shop?category=${categorySlug}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 text-slate-700 hover:border-slate-500"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      ) : null}

      {visibleProducts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-600">
          {selectedCategory
            ? `No products found in ${selectedCategory.name} right now.`
            : "No products found right now."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : null}
              </div>

              <div className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {product.category?.name || categories.find((c) => c.id === product.categoryId)?.name || "Uncategorized"}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
                  </span>
                </div>

                <ProductActionPanel
                  productId={product.id}
                  maxStock={product.stock}
                  detailsHref={getProductDetailsPath(product.name, product.id)}
                  showQuantitySelector={false}
                  compact={true}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}





