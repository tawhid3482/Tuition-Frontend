import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProductActionPanel from "@/src/components/Products/ProductActionPanel";
import ProductImageGallery from "@/src/components/Products/ProductImageGallery";
import ProductReviewsSection from "@/src/components/Products/ProductReviewsSection";
import {
  getCategories,
  getProductById,
  getProductBySlug,
  getRelatedProductsByCategoryId,
} from "@/src/lib/api/catalog";
import { getProductDetailsPath } from "@/src/lib/productSlug";
import { FaArrowLeft } from "react-icons/fa";

type ProductDetailsPageProps = {
  params: Promise<{
    productSlug: string;
  }>;
  searchParams?: Promise<{
    pid?: string;
  }>;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const isObjectIdLike = (value: string) => /^[a-f0-9]{24}$/i.test(value);

const resolveProduct = async (productSlug: string, productId?: string) => {
  if (productId && isObjectIdLike(productId)) {
    const byId = await getProductById(productId);
    if (byId) {
      return byId;
    }
  }

  if (isObjectIdLike(productSlug)) {
    return getProductById(productSlug);
  }

  return getProductBySlug(productSlug);
};

export async function generateMetadata({
  params,
  searchParams,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const resolvedSearchParams: { pid?: string } = searchParams
    ? await searchParams
    : {};

  const product = await resolveProduct(productSlug, resolvedSearchParams.pid);

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${product.name} | Product Details`,
    description:
      product.description || `Buy ${product.name} at the best price.`,
    alternates: { canonical: getProductDetailsPath(product.name) },
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailsPage({
  params,
  searchParams,
}: ProductDetailsPageProps) {
  const { productSlug } = await params;
  const resolvedSearchParams: { pid?: string } = searchParams
    ? await searchParams
    : {};

  const product = await resolveProduct(productSlug, resolvedSearchParams.pid);

  if (!product) {
    notFound();
  }

  const canonicalPath = getProductDetailsPath(product.name);
  if (productSlug !== canonicalPath.split("/").pop()) {
    redirect(canonicalPath);
  }

  const [categories, relatedProductsRaw] = await Promise.all([
    getCategories(),
    getRelatedProductsByCategoryId(product.categoryId),
  ]);

  const categoryName =
    product.category?.name ||
    categories.find((c) => c.id === product.categoryId)?.name ||
    "Uncategorized";

  const relatedProducts = relatedProductsRaw
    .filter((item) => item.id !== product.id)
  

  return (
    <section className="py-8 md:py-12">
      <div className="mb-5 flex items-center gap-2">
        <FaArrowLeft className="text-primary text-2xl" />
        <Link
          href="/shop"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900 "
        >
          Back to shop
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductImageGallery name={product.name} images={product.images} />

        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {categoryName}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {product.description}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-3xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {product.stock > 0
                ? `${product.stock} items available in stock.`
                : "Currently out of stock."}
            </p>
          </div>

          <ProductActionPanel
            productId={product.id}
            maxStock={product.stock}
            detailsHref={getProductDetailsPath(product.name, product.id)}
            showQuantitySelector={true}
            compact={false}
            showDetailsButton={false}
          />
        </div>
      </div>

      <ProductReviewsSection
        productId={product.id}
        detailsHref={getProductDetailsPath(product.name, product.id)}
      />

      {relatedProducts.length > 0 ? (
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Related Products</h2>
            <Link
              href={`/shop?category=${product.categoryId}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              View more
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-t-2xl bg-slate-100">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                  ) : null}
                </div>

                <div className="space-y-2 p-4">
                  <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{item.name}</h3>
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
      ) : null}
    </section>
  );
}
