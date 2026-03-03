"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, ChevronDown, CreditCard, MapPin, Search, TicketPercent, Truck, Wallet } from "lucide-react";
import {
  applyPromoCode,
  checkoutOrder,
  getMyCart,
  initSslPayment,
  type CheckoutPayload,
  type CheckoutPaymentMethod,
  type CheckoutResult,
  type PromoApplyResult,
} from "@/src/lib/api/commerceClient";
import { BANGLADESH_DISTRICTS } from "@/src/lib/bangladeshDistricts";
import { formatPriceBDT } from "@/src/lib/formatCurrency";

type CartRow = {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
};

type CheckoutForm = {
  district: string;
  areaAddress: string;
  phone: string;
  note: string;
  paymentMethod: CheckoutPaymentMethod;
  promoCode: string;
};

type ApiError = {
  message?: string;
};

type CheckoutPricing = {
  subtotal: number;
  deliveryFee: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  appliedPromoCode?: string;
};

const defaultCheckoutForm: CheckoutForm = {
  district: "",
  areaAddress: "",
  phone: "",
  note: "",
  paymentMethod: "COD",
  promoCode: "",
};

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
        },
      } satisfies CartRow;
    })
    .filter((item): item is CartRow => Boolean(item));
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<ApiError>;
  return axiosError?.response?.data?.message || fallback;
};

const extractPricing = (
  checkoutResult: CheckoutResult,
  fallbackSubtotal: number,
  fallbackDeliveryFee: number,
): CheckoutPricing => {
  const subtotal = typeof checkoutResult.subtotal === "number" ? checkoutResult.subtotal : fallbackSubtotal;
  const deliveryFee = typeof checkoutResult.deliveryFee === "number" ? checkoutResult.deliveryFee : fallbackDeliveryFee;
  const discountAmount =
    typeof checkoutResult.discountAmount === "number" ? checkoutResult.discountAmount : 0;
  const discountPercentage =
    typeof checkoutResult.discountPercentage === "number" ? checkoutResult.discountPercentage : 0;

  const defaultTotal = Math.max(subtotal + deliveryFee - discountAmount, 0);
  const totalAmount = typeof checkoutResult.totalAmount === "number" ? checkoutResult.totalAmount : defaultTotal;

  return {
    subtotal,
    deliveryFee,
    discountAmount,
    discountPercentage,
    totalAmount,
    appliedPromoCode: checkoutResult.appliedPromoCode,
  };
};

const extractPricingFromPromoApply = (
  result: PromoApplyResult,
  fallbackSubtotal: number,
  fallbackDeliveryFee: number,
): CheckoutPricing => {
  const pricing = result.pricing;

  const subtotal = typeof pricing?.subtotal === "number" ? pricing.subtotal : fallbackSubtotal;
  const deliveryFee = typeof pricing?.deliveryFee === "number" ? pricing.deliveryFee : fallbackDeliveryFee;
  const discountAmount = typeof pricing?.discountAmount === "number" ? pricing.discountAmount : 0;
  const discountPercentage = typeof pricing?.discountPercentage === "number" ? pricing.discountPercentage : 0;
  const totalAmount = typeof pricing?.totalAmount === "number"
    ? pricing.totalAmount
    : Math.max(subtotal + deliveryFee - discountAmount, 0);

  return {
    subtotal,
    deliveryFee,
    discountAmount,
    discountPercentage,
    totalAmount,
    appliedPromoCode: result.promo?.code,
  };
};

export default function CheckoutPage() {
  const router = useRouter();

  const [rows, setRows] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(defaultCheckoutForm);
  const [districtQuery, setDistrictQuery] = useState("");
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [latestPricing, setLatestPricing] = useState<CheckoutPricing | null>(null);

  const subtotal = useMemo(
    () => rows.reduce((sum, row) => sum + row.quantity * row.product.price, 0),
    [rows],
  );

  const totalItems = useMemo(
    () => rows.reduce((sum, row) => sum + row.quantity, 0),
    [rows],
  );

  const filteredDistricts = useMemo(() => {
    const query = districtQuery.trim().toLowerCase();

    if (!query) {
      return BANGLADESH_DISTRICTS;
    }

    return BANGLADESH_DISTRICTS.filter((district) =>
      district.toLowerCase().includes(query),
    );
  }, [districtQuery]);

  const deliveryFee = useMemo(() => {
    if (!checkoutForm.district) {
      return 0;
    }

    return checkoutForm.district === "Dhaka" ? 70 : 120;
  }, [checkoutForm.district]);

  const pricing = latestPricing
    ? {
        ...latestPricing,
        subtotal,
        deliveryFee,
        totalAmount: Math.max(subtotal + deliveryFee - latestPricing.discountAmount, 0),
      }
    : {
        subtotal,
        deliveryFee,
        discountPercentage: 0,
        discountAmount: 0,
        totalAmount: subtotal + deliveryFee,
        appliedPromoCode: undefined,
      };

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      setLoading(true);

      try {
        const payload = await getMyCart();
        if (!isMounted) {
          return;
        }

        setRows(normalizeRows(payload));
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        toast.error(getApiErrorMessage(error, "Failed to load cart"));
        setRows([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setLatestPricing(null);
  }, [subtotal, deliveryFee, checkoutForm.promoCode]);

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setCheckoutForm((prev) => ({ ...prev, [field]: value as CheckoutForm[keyof CheckoutForm] }));
  };

  const handleDistrictSelect = (district: string) => {
    setCheckoutForm((prev) => ({ ...prev, district }));
    setDistrictQuery(district);
    setDistrictDropdownOpen(false);
  };

  const handleDistrictQueryChange = (value: string) => {
    setDistrictQuery(value);
    setDistrictDropdownOpen(true);

    if (value.trim().toLowerCase() !== checkoutForm.district.toLowerCase()) {
      setCheckoutForm((prev) => ({ ...prev, district: "" }));
    }
  };

  const handleApplyPromo = async () => {
    const promoCode = checkoutForm.promoCode.trim().toUpperCase();

    if (!promoCode) {
      toast.error("Please enter a promo code");
      return;
    }

    if (rows.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setApplyingPromo(true);

    try {
      const result = await applyPromoCode({ promoCode, deliveryFee });
      const nextPricing = extractPricingFromPromoApply(result, subtotal, deliveryFee);
      setLatestPricing(nextPricing);
      setCheckoutForm((prev) => ({ ...prev, promoCode }));

      toast.success(`Promo applied. You saved ${formatPriceBDT(nextPricing.discountAmount)}.`);
    } catch (error: unknown) {
      setLatestPricing(null);
      toast.error(getApiErrorMessage(error, "Failed to apply promo code"));
    } finally {
      setApplyingPromo(false);
    }
  };

  const resolvePaymentUrl = (payload: unknown) => {
    const data = payload as {
      gatewayUrl?: string;
      url?: string;
      redirectUrl?: string;
      data?: { gatewayUrl?: string; url?: string; redirectUrl?: string };
    };

    return data.gatewayUrl || data.url || data.redirectUrl || data.data?.gatewayUrl || data.data?.url || data.data?.redirectUrl;
  };

  const handlePlaceOrder = async () => {
    if (rows.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!checkoutForm.district) {
      toast.error("Please select your district");
      return;
    }

    const shippingAddress = checkoutForm.areaAddress.trim()
      ? `${checkoutForm.areaAddress.trim()}, ${checkoutForm.district}, Bangladesh`
      : `${checkoutForm.district}, Bangladesh`;

    const payload: CheckoutPayload = {
      shippingAddress,
      deliveryFee,
      paymentMethod: checkoutForm.paymentMethod,
    };

    const phone = checkoutForm.phone.trim();
    const note = checkoutForm.note.trim();
    const promoCode = checkoutForm.promoCode.trim().toUpperCase();

    if (phone) {
      payload.phone = phone;
    }

    if (note) {
      payload.note = note;
    }

    if (promoCode) {
      payload.promoCode = promoCode;
    }

    setPlacingOrder(true);

    try {
      const result = await checkoutOrder(payload);
      const nextPricing = extractPricing(result, subtotal, deliveryFee);
      setLatestPricing(nextPricing);

      if (nextPricing.appliedPromoCode) {
        toast.success(`Promo applied: ${nextPricing.appliedPromoCode} (-${nextPricing.discountPercentage || 0}%)`);
      }

      if (checkoutForm.paymentMethod === "SSLCOMMERZ") {
        const orderId = result.orderId || result.id;

        if (!orderId) {
          toast.error("Order created but payment init failed. Missing order id.");
          return;
        }

        const paymentInitResponse = await initSslPayment(orderId);
        const paymentUrl = resolvePaymentUrl(paymentInitResponse);

        if (!paymentUrl) {
          toast.error("Payment initialization failed. Please try again.");
          return;
        }

        window.location.assign(paymentUrl);
        return;
      }

      toast.success("Order placed successfully");
      window.dispatchEvent(new Event("commerce-updated"));
      router.push("/orders");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Checkout failed"));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <section className="py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          Loading checkout...
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <header className="rounded-3xl border border-slate-200 bg-linear-to-r from-slate-50 via-white to-emerald-50 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-600">Complete your shipping details and confirm order.</p>
      </header>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          <p>Your cart is empty.</p>
          <Link
            href="/cart"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Back to cart
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-bold text-slate-900">Shipping & Payment</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">District</label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={districtQuery}
                    onFocus={() => setDistrictDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setDistrictDropdownOpen(false), 120)}
                    onChange={(e) => handleDistrictQueryChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (filteredDistricts.length > 0) {
                          handleDistrictSelect(filteredDistricts[0]);
                        }
                      }
                    }}
                    placeholder="Search district (e.g. Dhaka, Cumilla)"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setDistrictDropdownOpen((prev) => !prev)}
                    className="absolute right-2 top-2.5 rounded-md p-1 text-slate-500 hover:bg-slate-100"
                    aria-label="Toggle district list"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {districtDropdownOpen ? (
                    <div className="absolute left-0 right-0 top-12 z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                      <div className="max-h-60 overflow-y-auto p-1">
                        {filteredDistricts.length === 0 ? (
                          <p className="px-3 py-2 text-sm text-slate-500">No district found</p>
                        ) : (
                          filteredDistricts.map((district) => (
                            <button
                              key={district}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleDistrictSelect(district)}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                            >
                              <span className="inline-flex items-center gap-2">
                                <Search className="h-3.5 w-3.5 text-slate-400" />
                                {district}
                              </span>
                              {checkoutForm.district === district ? (
                                <Check className="h-4 w-4 text-primary" />
                              ) : null}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">Dhaka delivery {"\u09F3"}70</span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-blue-700">Other districts {"\u09F3"}120</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Area / Street Address (optional)</label>
                <input
                  type="text"
                  value={checkoutForm.areaAddress}
                  onChange={(e) => handleInputChange("areaAddress", e.target.value)}
                  placeholder="House, road, area"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone (optional)</label>
                <input
                  type="text"
                  value={checkoutForm.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Promo Code (optional)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <TicketPercent className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={checkoutForm.promoCode}
                      onChange={(e) => handleInputChange("promoCode", e.target.value.toUpperCase())}
                      placeholder="EID25"
                      className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm uppercase text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={applyingPromo || !checkoutForm.promoCode.trim()}
                    className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {applyingPromo ? "Applying..." : "Apply"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {pricing.appliedPromoCode
                    ? `Applied ${pricing.appliedPromoCode}. Discount: ${formatPriceBDT(pricing.discountAmount)}`
                    : "Click Apply to preview discount before placing the order."}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Payment Method</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange("paymentMethod", "COD")}
                    className={`rounded-xl border p-3 text-left transition ${
                      checkoutForm.paymentMethod === "COD"
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 rounded-full p-1 ${checkoutForm.paymentMethod === "COD" ? "bg-primary text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Wallet className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Cash on Delivery</p>
                        <p className="mt-0.5 text-xs text-slate-600">Pay after receiving product</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange("paymentMethod", "SSLCOMMERZ")}
                    className={`rounded-xl border p-3 text-left transition ${
                      checkoutForm.paymentMethod === "SSLCOMMERZ"
                        ? "border-slate-700 bg-slate-900/10 ring-2 ring-slate-400/25"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 rounded-full p-1 ${checkoutForm.paymentMethod === "SSLCOMMERZ" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <CreditCard className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">SSLCOMMERZ</p>
                        <p className="mt-0.5 text-xs text-slate-600">Pay online securely</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Note (optional)</label>
                <textarea
                  value={checkoutForm.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  rows={4}
                  placeholder="Any delivery note"
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPriceBDT(pricing.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <Truck className="h-4 w-4 text-slate-500" />
                  Delivery fee
                </span>
                <span className="font-semibold">{formatPriceBDT(pricing.deliveryFee)}</span>
              </div>

              {pricing.discountAmount > 0 ? (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>
                    Discount
                    {pricing.discountPercentage > 0 ? ` (${pricing.discountPercentage}%)` : ""}
                  </span>
                  <span className="font-semibold">- {formatPriceBDT(pricing.discountAmount)}</span>
                </div>
              ) : null}

              {pricing.appliedPromoCode ? (
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Applied promo</span>
                  <span className="font-semibold uppercase">{pricing.appliedPromoCode}</span>
                </div>
              ) : null}

              <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{formatPriceBDT(pricing.totalAmount)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder
                ? "Placing order..."
                : checkoutForm.paymentMethod === "SSLCOMMERZ"
                  ? "Pay with SSLCOMMERZ"
                  : "Place order (Cash on Delivery)"}
            </button>

            {checkoutForm.paymentMethod === "SSLCOMMERZ" ? (
              <p className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-blue-700">
                You will be redirected to SSLCOMMERZ after order creation.
              </p>
            ) : null}

            <Link
              href="/cart"
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to cart
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
