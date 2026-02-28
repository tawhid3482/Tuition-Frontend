"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { addToCart, getMyWishlist, removeFromWishlist } from "@/src/lib/api/commerceClient";
import { getProductDetailsPath } from "@/src/lib/productSlug";

type WishlistRow = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const normalizeWishlist = (payload: unknown): WishlistRow[] => {
  const root = payload as { items?: unknown[]; data?: { items?: unknown[] } } | unknown[];

  const items: unknown[] = Array.isArray(root)
    ? root
    : Array.isArray((root as { items?: unknown[] })?.items)
      ? (root as { items?: unknown[] }).items ?? []
      : Array.isArray((root as { data?: { items?: unknown[] } })?.data?.items)
        ? (root as { data?: { items?: unknown[] } }).data?.items ?? []
        : [];

  return items.reduce<WishlistRow[]>((acc, item) => {
    const row = item as {
      productId?: string;
      product?: {
        id?: string;
        name?: string;
        price?: number;
        stock?: number;
        images?: string[];
      };
    };

    const productId = row.product?.id || row.productId;
    const name = row.product?.name;

    if (!productId || !name) {
      return acc;
    }

    acc.push({
      productId,
      name,
      price: typeof row.product?.price === "number" ? row.product.price : 0,
      stock: typeof row.product?.stock === "number" ? row.product.stock : 0,
      image: Array.isArray(row.product?.images)
        ? row.product.images.find((img) => typeof img === "string" && img.length > 0)
        : undefined,
    });

    return acc;
  }, []);
};

export default function WishlistPage() {
  const [rows, setRows] = useState<WishlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);

  const inStockCount = useMemo(() => rows.filter((row) => row.stock > 0).length, [rows]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const payload = await getMyWishlist();
      setRows(normalizeWishlist(payload));
    } catch {
      toast.error("Failed to load wishlist");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    setBusyProductId(productId);

    try {
      await removeFromWishlist(productId);
      setRows((prev) => prev.filter((row) => row.productId !== productId));
      toast.success("Removed from wishlist");
      window.dispatchEvent(new Event("commerce-updated"));
    } catch {
      toast.error("Failed to remove wishlist item");
    } finally {
      setBusyProductId(null);
    }
  };

  const handleMoveToCart = async (productId: string) => {
    setBusyProductId(productId);

    try {
      await addToCart(productId, 1);
      await removeFromWishlist(productId);
      setRows((prev) => prev.filter((row) => row.productId !== productId));
      toast.success("Added to cart and removed from wishlist");
      window.dispatchEvent(new Event("commerce-updated"));
    } catch {
      toast.error("Failed to move item to cart");
    } finally {
      setBusyProductId(null);
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="rounded-3xl border border-slate-200 bg-linear-to-r from-rose-50 via-white to-slate-50 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
        <p className="mt-2 text-slate-600">Products you saved for later.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">Saved: {rows.length}</span>
          <span className="rounded-full bg-white px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">In stock: {inStockCount}</span>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`wishlist-loading-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="h-20 w-20 rounded-xl bg-slate-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
                  <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse" />
                  <div className="h-5 w-24 rounded-full bg-slate-200 animate-pulse" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
                <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Heart className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-3 text-slate-700">Your wishlist is empty.</p>
          <Link href="/shop" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.map((row) => {
            const isBusy = busyProductId === row.productId;
            const inStock = row.stock > 0;

            return (
              <article key={row.productId} className="rounded-2xl border border-slate-200 bg-primary/5 p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                    {row.image ? (
                      <Image src={row.image} alt={row.name} fill className="object-cover" sizes="80px" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link href={getProductDetailsPath(row.name, row.productId)} className="line-clamp-2 text-base font-semibold text-slate-900 transition hover:text-primary">
                      {row.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{formatPrice(row.price)}</p>
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${inStock ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"}`}>
                      {inStock ? `${row.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(row.productId)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-secondary transition hover:bg-slate-700 disabled:opacity-50"
                    disabled={isBusy || !inStock}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(row.productId)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                    disabled={isBusy}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

