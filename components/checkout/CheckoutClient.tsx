"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Lock, Truck, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

// ---------------------------------------------------------------------------
// Nigerian states
// ---------------------------------------------------------------------------
const NG_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
  "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu",
  "Federal Capital Territory","Gombe","Imo","Jigawa","Kaduna","Kano",
  "Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun",
  "Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

const FREE_SHIPPING_THRESHOLD = 50_000;
const SHIPPING_RATE            = 3_500;

// ---------------------------------------------------------------------------
// Form shape
// ---------------------------------------------------------------------------
interface ShippingForm {
  fullName: string;
  email:    string;
  phone:    string;
  address:  string;
  city:     string;
  state:    string;
}
const EMPTY_FORM: ShippingForm = {
  fullName: "", email: "", phone: "", address: "", city: "", state: "",
};

// ---------------------------------------------------------------------------
// Order summary sidebar
// ---------------------------------------------------------------------------
function OrderSummary({
  items, subtotal, shipping,
}: { items: CartItem[]; subtotal: number; shipping: number }) {
  const total = subtotal + shipping;

  return (
    <div className="bg-brand-gray-50 p-8 sticky top-28">
      <h2 className="font-heading text-xl text-brand-blue mb-6">Order Summary</h2>

      <div className="space-y-5 mb-6 max-h-72 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="font-body text-sm text-brand-gray-400">Your bag is empty.</p>
        ) : (
          items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
              <div className="relative w-16 h-20 bg-brand-gray-100 flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag size={14} className="text-brand-gray-300" />
                  </div>
                )}
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-blue text-white font-body text-2xs flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm text-brand-blue leading-tight truncate">{item.name}</p>
                {(item.size || item.color) && (
                  <p className="font-body text-2xs text-brand-gray-400 mt-0.5">
                    {[item.size, item.color].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="font-body text-sm text-brand-blue mt-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-brand-gray-200 pt-6 space-y-3">
        <div className="flex justify-between font-body text-xs tracking-widest uppercase text-brand-gray-500">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-body text-xs tracking-widest uppercase text-brand-gray-500">
          <span>Shipping</span>
          <span>
            {shipping === 0
              ? <span className="text-green-600">Free</span>
              : formatPrice(shipping)}
          </span>
        </div>
        {shipping === 0 && subtotal > 0 && (
          <p className="font-body text-2xs text-green-600 flex items-center gap-1">
            <Truck size={11} /> Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </p>
        )}
        <div className="border-t border-brand-gray-200 pt-3 flex justify-between">
          <span className="font-heading text-base text-brand-blue">Total</span>
          <span className="font-heading text-xl text-brand-blue">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Label helper
// ---------------------------------------------------------------------------
function Field({ label, required = false, children }: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-body text-2xs tracking-widest uppercase text-brand-gray-500 mb-2">
        {label} {required && <span className="text-brand-gold">*</span>}
      </label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main checkout client
// ---------------------------------------------------------------------------
export default function CheckoutClient() {
  // ── Zustand hydration guard ──────────────────────────────────────────────
  // Zustand persist hydrates from localStorage after the first render.
  // Without this guard, items is [] on mount and the order summary looks empty.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { items } = useCartStore();
  const cartItems = mounted ? items : [];

  // ── Form state ───────────────────────────────────────────────────────────
  const [form,       setForm]       = useState<ShippingForm>(EMPTY_FORM);
  const [errors,     setErrors]     = useState<Partial<ShippingForm>>({});
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState<string | null>(null);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;

  function update(field: keyof ShippingForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<ShippingForm> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim())    e.email    = "Required";
    if (!form.phone.trim())    e.phone    = "Required";
    if (!form.address.trim())  e.address  = "Required";
    if (!form.city.trim())     e.city     = "Required";
    if (!form.state)           e.state    = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || cartItems.length === 0) return;

    setLoading(true);
    setApiError(null);

    try {
      // Save a cart snapshot before redirecting — the confirmation page reads this
      sessionStorage.setItem("blue-nova-last-order", JSON.stringify(cartItems));

      const res  = await fetch("/api/checkout/session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ items: cartItems, shippingAddress: form }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      // Redirect to Stripe's hosted payment page
      window.location.href = data.url;
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full border-0 border-b border-brand-gray-200 bg-transparent px-0 py-2 font-body text-sm text-brand-black placeholder-brand-gray-300 focus:border-brand-blue focus:outline-none transition-colors duration-200";
  const errCls = "mt-1 font-body text-2xs text-red-400";

  return (
    <main className="pt-20 pb-24">
      {/* Page header */}
      <div className="bg-brand-gray-50 border-b border-brand-gray-100 py-12">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-3">Secure Checkout</p>
          <h1 className="section-heading">Checkout</h1>
          <div className="gold-divider mt-5" />
        </div>
      </div>

      <div className="container-luxury py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-20 items-start">

          {/* ── LEFT: Shipping form ───────────────────────────────────── */}
          <div>
            <h2 className="font-heading text-2xl text-brand-blue mb-8">
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-7">
              {/* Full name */}
              <Field label="Full Name" required>
                <input type="text" value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Ada Okonkwo" className={inputCls} />
                {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
              </Field>

              {/* Email + phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <Field label="Email Address" required>
                  <input type="email" value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="ada@example.com" className={inputCls} />
                  {errors.email && <p className={errCls}>{errors.email}</p>}
                </Field>
                <Field label="Phone Number" required>
                  <input type="tel" value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="0801 234 5678" className={inputCls} />
                  {errors.phone && <p className={errCls}>{errors.phone}</p>}
                </Field>
              </div>

              {/* Address */}
              <Field label="Delivery Address" required>
                <input type="text" value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="14 Admiralty Way, Lekki Phase 1" className={inputCls} />
                {errors.address && <p className={errCls}>{errors.address}</p>}
              </Field>

              {/* City + State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <Field label="City" required>
                  <input type="text" value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Lagos" className={inputCls} />
                  {errors.city && <p className={errCls}>{errors.city}</p>}
                </Field>
                <Field label="State" required>
                  <select value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className={`${inputCls} cursor-pointer`}>
                    <option value="">Select state…</option>
                    {NG_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className={errCls}>{errors.state}</p>}
                </Field>
              </div>

              {/* API error */}
              {apiError && (
                <p className="font-body text-xs text-red-500 border border-red-200 bg-red-50 px-4 py-3">
                  {apiError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-white font-body text-sm tracking-widest uppercase transition-all duration-300 ease-luxury hover:bg-brand-gold-dark disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Redirecting to payment…
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Place Order
                    <ChevronRight size={15} />
                  </>
                )}
              </button>

              <p className="text-center font-body text-2xs text-brand-gray-400 tracking-widest uppercase flex items-center justify-center gap-2">
                <Lock size={11} /> Secured by Stripe
              </p>

              {cartItems.length === 0 && mounted && (
                <p className="text-center font-body text-sm text-brand-gray-400">
                  Your bag is empty.{" "}
                  <Link href="/shop" className="text-brand-gold underline underline-offset-2">
                    Continue shopping
                  </Link>
                </p>
              )}
            </form>
          </div>

          {/* ── RIGHT: Order summary ──────────────────────────────────── */}
          <OrderSummary items={cartItems} subtotal={subtotal} shipping={shipping} />
        </div>
      </div>
    </main>
  );
}
