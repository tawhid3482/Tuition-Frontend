import { bannerSlides } from "@/public/banner";
import Banner from "@/src/components/Banner/Banner";
import { getProducts } from "@/src/lib/api/catalog";

export default async function Home() {
  const products = await getProducts().catch(() => []);

  return (
    <div className="space-y-8 py-2">
      <Banner slides={bannerSlides} autoPlayInterval={3000} showArrows={true} />

      <section>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Trending Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-medium text-slate-900 line-clamp-1">{item.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-2 mt-1">{item.description}</p>
              <p className="text-primary font-semibold mt-3">${item.price}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

