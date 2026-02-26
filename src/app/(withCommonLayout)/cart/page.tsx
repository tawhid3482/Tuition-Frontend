"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { getMyCart, removeCartItem, updateCartItem } from "@/src/lib/api/commerceClient";
import { getProductDetailsPath } from "@/src/lib/productSlug";

type ProductLite = {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
};

type CartRow = {
  productId: string;
  quantity: number;
  product: ProductLite;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const normalizeRows = (payload: unknown): CartRow[] => {
  const root = payload as { items?: unknown[]; data?: { items?: unknown[] } } | unknown[];

  const items: unknown[] = Array.isArray(root)
    ? root
    : Array.isArray(root?.items)
      ? root.items
      : Array.isArray(root?.data?.items)
        ? root.data.items
        : [];

  return items
    .map((item) => {
      const row = item as {
        quantity?: number;
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
        return null;
      }

      return {
        productId,
        quantity: typeof row.quantity === "number" ? row.quantity : 1,
        product: {
          id: productId,
          name,
          price: typeof row.product?.price === "number" ? row.product.price : 0,
          stock: typeof row.product?.stock === "number" ? row.product.stock : 0,
          images: Array.isArray(row.product?.images)
            ? row.product.images.filter((img) => typeof img === "string" && img.length > 0)
            : [],
        },
      } satisfies CartRow;
    })
    .filter((item): item is CartRow => Boolean(item));
};

export default function CartPage() {
  const [rows, setRows] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);

  const total = useMemo(
    () => rows.reduce((sum, row) => sum + row.quantity * row.product.price, 0),
    [rows],
  );

  const loadCart = async () => {
    setLoading(true);
    try {
      const payload = await getMyCart();
      setRows(normalizeRows(payload));
    } catch {
      toast.error("Failed to load cart");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (productId: string, quantity: number, maxStock: number) => {
    const safeQuantity = Math.max(1, Math.min(maxStock || 1, quantity));
    setBusyProductId(productId);

    try {
      await updateCartItem(productId, safeQuantity);
      setRows((prev) => prev.map((row) => (row.productId === productId ? { ...row, quantity: safeQuantity } : row)));
      toast.success("Cart updated");
      window.dispatchEvent(new Event("commerce-updated"));
    } catch {
      toast.error("Failed to update cart item");
    } finally {
      setBusyProductId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    setBusyProductId(productId);

    try {
      await removeCartItem(productId);
      setRows((prev) => prev.filter((row) => row.productId !== productId));
      toast.success("Removed from cart");
      window.dispatchEvent(new Event("commerce-updated"));
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setBusyProductId(null);
    }
  };

  return (
    <section className="py-8 md:py-12">
      <h1 className="text-3xl font-bold text-slate-900">My Cart</h1>
      <p className="mt-2 text-slate-600">Manage your selected products.</p>

      {loading ? (
        <div className="mt-6 rounded-xl border border-slate-200 p-8 text-center text-slate-600">Loading cart...</div>
      ) : rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 p-8 text-center text-slate-600">
          Your cart is empty. <Link href="/shop" className="font-semibold text-primary">Go shopping</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4">
          {rows.map((row) => (
            <article key={row.productId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
                    {row.product.images[0] ? (
                      <Image src={row.product.images[0]} alt={row.product.name} fill className="object-cover" sizes="64px" />
                    ) : null}
                  </div>
                  <div>
                    <Link href={getProductDetailsPath(row.product.name, row.productId)} className="font-semibold text-slate-900 hover:text-primary">
                      {row.product.name}
                    </Link>
                    <p className="text-sm text-slate-600">{formatPrice(row.product.price)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(row.productId, row.quantity - 1, row.product.stock)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm"
                    disabled={busyProductId === row.productId}
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold">{row.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(row.productId, row.quantity + 1, row.product.stock)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm"
                    disabled={busyProductId === row.productId}
                  >
                    +
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

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-right">
            <p className="text-sm text-slate-600">Subtotal</p>
            <p className="text-2xl font-bold text-slate-900">{formatPrice(total)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
