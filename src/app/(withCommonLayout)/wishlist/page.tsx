"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
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
      toast.success("Added to cart");
      window.dispatchEvent(new Event("commerce-updated"));
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setBusyProductId(null);
    }
  };

  return (
    <section className="py-8 md:py-12">
      <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
      <p className="mt-2 text-slate-600">Your saved items for later.</p>

      {loading ? (
        <div className="mt-6 rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading wishlist...</div>
      ) : rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 p-8 text-center text-slate-600">
          Your wishlist is empty. <Link href="/shop" className="font-semibold text-primary">Browse products</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4">
          {rows.map((row) => (
            <article key={row.productId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
                    {row.image ? (
                      <Image src={row.image} alt={row.name} fill className="object-cover" sizes="64px" />
                    ) : null}
                  </div>
                  <div>
                    <Link href={getProductDetailsPath(row.name, row.productId)} className="font-semibold text-slate-900 hover:text-primary">
                      {row.name}
                    </Link>
                    <p className="text-sm text-slate-600">{formatPrice(row.price)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(row.productId)}
                    className="rounded bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
                    disabled={busyProductId === row.productId || row.stock <= 0}
                  >
                    Add to cart
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(row.productId)}
                    className="rounded border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-600"
                    disabled={busyProductId === row.productId}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
