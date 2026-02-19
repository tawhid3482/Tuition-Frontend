import type { Metadata } from "next";
import Image from "next/image";
import { getCategories, getProducts } from "@/src/lib/api/catalog";

export const metadata: Metadata = {
  title: "Shop Products",
  description: "Browse our product catalog and find the best deals.",
  alternates: { canonical: "/shop" },
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <section className="py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Shop</h1>
        <p className="mt-2 text-slate-600">Discover curated products from our latest collection.</p>
      </header>

      {products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-600">
          No products found right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
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

              <div className="p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  {categoryMap.get(product.categoryId) || "Uncategorized"}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{product.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                  >
                    {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
