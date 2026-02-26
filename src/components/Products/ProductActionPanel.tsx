"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Heart, ShoppingCart } from "lucide-react";
import { addToCart, addToWishlist } from "@/src/lib/api/commerceClient";
import useAuth from "@/src/hooks/useAuth";

type ProductActionPanelProps = {
  productId: string;
  maxStock: number;
  detailsHref: string;
  showQuantitySelector?: boolean;
  compact?: boolean;
};

const ProductActionPanel = ({
  productId,
  maxStock,
  detailsHref,
  showQuantitySelector = false,
  compact = true,
}: ProductActionPanelProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const normalizedMaxStock = Math.max(1, maxStock || 1);

  const ensureAuth = () => {
    if (isAuthenticated) {
      return true;
    }

    toast.error("Please login first");
    router.push(`/login?redirect=${encodeURIComponent(detailsHref)}`);
    return false;
  };

  const handleAddToCart = async () => {
    if (!ensureAuth()) {
      return;
    }

    setIsCartLoading(true);
    try {
      await addToCart(productId, quantity);
      toast.success("Added to cart");
      window.dispatchEvent(new Event("commerce-updated"));
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to add to cart";

      toast.error(message || "Failed to add to cart");
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!ensureAuth()) {
      return;
    }

    setIsWishlistLoading(true);
    try {
      await addToWishlist(productId);
      toast.success("Added to wishlist");
      window.dispatchEvent(new Event("commerce-updated"));
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to add to wishlist";

      toast.error(message || "Failed to add to wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {showQuantitySelector ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Quantity:</span>
          <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="min-w-10 border-x border-slate-300 px-3 py-1.5 text-center text-sm font-semibold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.min(normalizedMaxStock, prev + 1))}
              className="px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-xs text-slate-500">Max {normalizedMaxStock}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isCartLoading || maxStock <= 0}
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {isCartLoading ? "Adding..." : "Add to cart"}
        </button>

        <button
          type="button"
          onClick={handleAddToWishlist}
          disabled={isWishlistLoading}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Heart className="h-3.5 w-3.5" />
          {isWishlistLoading ? "Saving..." : "Wishlist"}
        </button>
      </div>

      <Link
        href={detailsHref}
        className="inline-flex w-full items-center justify-center rounded-lg border border-primary bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
      >
        View product details
      </Link>
    </div>
  );
};

export default ProductActionPanel;


