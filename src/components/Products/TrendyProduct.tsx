import Image from "next/image";
import Link from "next/link";
import ProductActionPanel from "@/src/components/Products/ProductActionPanel";
import { getTrendingCategoryProducts } from "@/src/lib/api/catalog";
import { getProductDetailsPath } from "@/src/lib/productSlug";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const toCategorySlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const TrendyProduct = async () => {
  const trendingGroups = await getTrendingCategoryProducts().catch(() => []);

  return (
    <section aria-labelledby="trending-products" className="space-y-6">
      <div className="rounded-2xl bg-primary p-5 text-white md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Fresh picks</p>
            <h2 id="trending-products" className="mt-2 text-2xl font-bold md:text-3xl">
              Latest Products by Category
            </h2>
            <p className="mt-2 text-sm text-slate-200">Auto-updated from latest category products.</p>
          </div>
          <Link
            href="/shop"
            className="rounded-full uppercase border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
          >
            Explore shop
          </Link>
        </div>
      </div>

      {trendingGroups.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-600">
          No trending products available right now.
        </div>
      ) : (
        <div className="space-y-8">
          {trendingGroups.map((group) => {
            const shopUrl = `/shop?category=${toCategorySlug(group.category.name)}`;

            return (
              <section key={group.category.id} className="overflow-hidden rounded-2xl bg-white/95">
                <div className="border-b border-slate-200 bg-primary/10 px-4 py-4 md:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={shopUrl} className="group flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-200 ring-1 ring-slate-300">
                        {group.category.image ? (
                          <Image
                            src={group.category.image}
                            alt={`${group.category.name} category`}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : null}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-slate-700">
                          {group.category.name}
                        </h3>
                        <p className="text-sm text-slate-500">{group.products.length} latest items</p>
                      </div>
                    </Link>

                    <Link
                      href={shopUrl}
                      className="rounded-2xl uppercase border border-primary px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
                    >
                      View all
                    </Link>
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {group.products.map((item) => (
                      <article
                        key={item.id}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="relative aspect-4/3 bg-slate-100">
                          {item.images?.[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            />
                          ) : null}
                        </div>

                        <div className="space-y-2 p-4">
                          <h4 className="line-clamp-1 text-base font-semibold text-slate-900">{item.name}</h4>
                          <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
                          <div className="flex items-center justify-between pt-1">
                            <p className="text-lg font-bold text-slate-900">{formatPrice(item.price)}</p>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                item.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {item.stock > 0 ? `Stock ${item.stock}` : "Sold out"}
                            </span>
                          </div>

                          <ProductActionPanel
                            productId={item.id}
                            maxStock={item.stock}
                            detailsHref={getProductDetailsPath(item.name, item.id)}
                            showQuantitySelector={false}
                            compact={true}
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TrendyProduct;

