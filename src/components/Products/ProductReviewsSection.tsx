"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, MessageSquareText, Star } from "lucide-react";
import { createReview, getProductReviews } from "@/src/lib/api/commerceClient";
import useAuth from "@/src/hooks/useAuth";

type ProductReviewsSectionProps = {
  productId: string;
  detailsHref: string;
};

type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt?: string;
};

type ReviewMeta = {
  page: number;
  totalPage: number;
};

const normalizeReviews = (payload: unknown): ReviewRow[] => {
  const root = payload as
    | unknown[]
    | { items?: unknown[]; reviews?: unknown[]; data?: unknown[] | { items?: unknown[]; reviews?: unknown[] } };

  const items: unknown[] = Array.isArray(root)
    ? root
    : Array.isArray(root?.items)
      ? root.items
      : Array.isArray(root?.reviews)
        ? root.reviews
        : Array.isArray(root?.data)
          ? root.data
          : Array.isArray((root?.data as { items?: unknown[] })?.items)
            ? (root?.data as { items?: unknown[] }).items || []
            : Array.isArray((root?.data as { reviews?: unknown[] })?.reviews)
              ? (root?.data as { reviews?: unknown[] }).reviews || []
              : [];

  return items.reduce<ReviewRow[]>((acc, item) => {
    const row = item as {
      id?: string;
      _id?: string;
      rating?: number;
      comment?: string;
      createdAt?: string;
      user?: { name?: string };
      reviewer?: { name?: string };
      customer?: { name?: string };
    };

    const id = row.id || row._id;
    if (!id) {
      return acc;
    }

    const rating = typeof row.rating === "number" ? Math.min(5, Math.max(1, row.rating)) : 0;

    acc.push({
      id,
      rating,
      comment: typeof row.comment === "string" ? row.comment : "",
      reviewerName: row.user?.name || row.reviewer?.name || row.customer?.name || "Anonymous user",
      createdAt: typeof row.createdAt === "string" ? row.createdAt : undefined,
    });

    return acc;
  }, []);
};

const normalizeMeta = (payload: unknown, fallbackPage: number): ReviewMeta => {
  const meta = payload as { page?: number; totalPage?: number };

  return {
    page: typeof meta?.page === "number" ? Math.max(1, meta.page) : fallbackPage,
    totalPage: typeof meta?.totalPage === "number" ? Math.max(1, meta.totalPage) : 1,
  };
};

const renderStars = (rating: number, size = "h-4 w-4") => {
  return Array.from({ length: 5 }).map((_, index) => {
    const filled = index < rating;

    return (
      <Star
        key={`rating-${index}`}
        className={`${size} ${filled ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
      />
    );
  });
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const ProductReviewsSection = ({ productId, detailsHref }: ProductReviewsSectionProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [meta, setMeta] = useState<ReviewMeta>({ page: 1, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const hasReviews = reviews.length > 0;

  const loadReviews = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await getProductReviews(productId, page, 10);
      setReviews(normalizeReviews(response.data));
      setMeta(normalizeMeta(response.meta, page));
    } catch {
      toast.error("Failed to load reviews");
      setReviews([]);
      setMeta({ page, totalPage: 1 });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews(1);
  }, [loadReviews]);

  const averageRating = useMemo(() => {
    if (!hasReviews) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, row) => sum + row.rating, 0);
    return totalRating / reviews.length;
  }, [hasReviews, reviews]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login first");
      router.push(`/login?redirect=${encodeURIComponent(detailsHref)}`);
      return;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      await createReview({ productId, rating, comment: trimmedComment });
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      await loadReviews(1);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to submit review";

      toast.error(message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-amber-50 via-white to-slate-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
            <p className="mt-1 text-sm text-slate-600">
              {hasReviews
                ? `${averageRating.toFixed(1)} / 5 from ${reviews.length} review${reviews.length > 1 ? "s" : ""}`
                : "No reviews yet. Be the first to review this product."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">
              <span>{averageRating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5">{renderStars(Math.round(averageRating))}</div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isExpanded ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      {isExpanded ? (
        <>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">Write a review</p>
              <div className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  const filled = value <= rating;

                  return (
                    <button
                      key={`select-rating-${value}`}
                      type="button"
                      onClick={() => setRating(value)}
                      className="inline-flex"
                      aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                    >
                      <Star className={`h-5 w-5 transition ${filled ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share your experience about this product"
              className="mt-3 h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">Your feedback helps other buyers make better decisions.</p>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
          </form>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`review-skeleton-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="h-4 w-36 rounded bg-slate-200 animate-pulse" />
                  <div className="mt-2 h-3 w-24 rounded bg-slate-200 animate-pulse" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-200 animate-pulse" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-slate-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : hasReviews ? (
            <div className="space-y-3">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {getInitials(review.reviewerName)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{review.reviewerName}</p>
                        <div className="mt-1 flex items-center gap-1">{renderStars(review.rating)}</div>
                      </div>
                    </div>

                    {review.createdAt ? (
                      <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    ) : null}
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <MessageSquareText className="mb-1 h-4 w-4 text-slate-400" />
                    {review.comment || "No comment"}
                  </div>
                </article>
              ))}

              {meta.totalPage > 1 ? (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => loadReviews(Math.max(1, meta.page - 1))}
                    disabled={meta.page <= 1 || loading}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-500 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                    Page {meta.page} of {meta.totalPage}
                  </span>
                  <button
                    type="button"
                    onClick={() => loadReviews(Math.min(meta.totalPage, meta.page + 1))}
                    disabled={meta.page >= meta.totalPage || loading}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-500 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No reviews yet for this product.
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
          Reviews are hidden. Click Show to see or write reviews.
        </div>
      )}
    </section>
  );
};

export default ProductReviewsSection;

