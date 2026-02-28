"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { ShoppingBag, Trash2 } from "lucide-react";
import {
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "@/src/lib/api/commerceClient";
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
  const root = payload as
    | { items?: unknown[]; data?: { items?: unknown[] } }
    | unknown[];

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
            ? row.product.images.filter(
                (img) => typeof img === "string" && img.length > 0,
              )
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

  const totalItems = useMemo(
    () => rows.reduce((sum, row) => sum + row.quantity, 0),
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

  const handleUpdateQuantity = async (
    productId: string,
    quantity: number,
    maxStock: number,
  ) => {
    const safeQuantity = Math.max(1, Math.min(maxStock || 1, quantity));
    setBusyProductId(productId);

    try {
      await updateCartItem(productId, safeQuantity);
      setRows((prev) =>
        prev.map((row) =>
          row.productId === productId
            ? { ...row, quantity: safeQuantity }
            : row,
        ),
      );
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
      <div className="rounded-3xl border border-slate-200 bg-linear-to-r from-slate-50 via-white to-emerald-50 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900">My Cart</h1>
        <p className="mt-2 text-slate-600">
          Manage products, adjust quantity, and review your order value.
        </p>
      </div>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading cart...
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <ShoppingBag className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-3 text-slate-700">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {rows.map((row) => (
              <article
                key={row.productId}
                className="rounded-2xl border border-slate-200 bg-primary/5 p-4 shadow-sm transition hover:shadow-md md:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      {row.product.images[0] ? (
                        <Image
                          src={row.product.images[0]}
                          alt={row.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : null}
                    </div>

                    <div>
                      <Link
                        href={getProductDetailsPath(
                          row.product.name,
                          row.productId,
                        )}
                        className="text-base font-semibold text-slate-900 transition hover:text-primary"
                      >
                        {row.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatPrice(row.product.price)} each
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        Line total:{" "}
                        {formatPrice(row.quantity * row.product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center overflow-hidden rounded-full border border-slate-300 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(
                            row.productId,
                            row.quantity - 1,
                            row.product.stock,
                          )
                        }
                        className="px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                        disabled={busyProductId === row.productId}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="min-w-8 border-x border-slate-300 px-3 py-1.5 text-center text-sm font-semibold text-slate-900">
                        {row.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(
                            row.productId,
                            row.quantity + 1,
                            row.product.stock,
                          )
                        }
                        className="px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                        disabled={
                          busyProductId === row.productId ||
                          row.quantity >= Math.max(1, row.product.stock)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(row.productId)}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                      disabled={busyProductId === row.productId}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-primary/95 text-secondary p-5 shadow-sm xl:sticky xl:top-24">
            <p className="text-sm font-medium ">Order summary</p>
            <p className="mt-2 text-3xl font-bold ">{formatPrice(total)}</p>
            <div className="mt-4 space-y-2 text-sm ">
              <div className="flex items-center justify-between">
                <span>Total items</span>
                <span className="font-semibold 0">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Products</span>
                <span className="font-semibold ">{rows.length}</span>
              </div>
            </div>

            <Link
              href="/shop"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold transition "
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
