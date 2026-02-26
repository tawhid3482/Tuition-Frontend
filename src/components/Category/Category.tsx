import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts } from "@/src/lib/api/catalog";

const toCategorySlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Category = async () => {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  if (categories.length === 0) {
    return null;
  }

  const productCountByCategory = products.reduce<Map<string, number>>((acc, product) => {
    acc.set(product.categoryId, (acc.get(product.categoryId) ?? 0) + 1);
    return acc;
  }, new Map());

  return (
    <section aria-labelledby="shop-by-category" className="py-4 md:py-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Browse</p>
          <h2 id="shop-by-category" className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
            Shop by Category
          </h2>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-slate-700 transition hover:text-slate-900">
          View all products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const productCount = productCountByCategory.get(category.id) ?? 0;

          return (
            <Link
              key={category.id}
              href={`/shop?category=${toCategorySlug(category.name)}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[5/3] bg-slate-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={`${category.name} category`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                    {category.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <p className="text-sm text-slate-100">{productCount} products</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Category;
