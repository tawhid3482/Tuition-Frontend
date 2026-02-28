import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProductActionPanel from "@/src/components/Products/ProductActionPanel";
import ProductImageGallery from "@/src/components/Products/ProductImageGallery";
import {
  getCategories,
  getProductById,
  getProductBySlug,
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

  const categories = await getCategories();
  const categoryName =
    product.category?.name ||
    categories.find((c) => c.id === product.categoryId)?.name ||
    "Uncategorized";

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
    </section>
  );
}
