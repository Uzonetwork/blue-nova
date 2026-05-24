"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  // Stripe Checkout Session success sends ?session_id=cs_...
  const sessionId = searchParams.get("session_id") ?? "";
  // Legacy payment-intent flow (kept for graceful fallback)
  const legacyOrderId = searchParams.get("orderId") ?? "";
  const ref = sessionId || legacyOrderId;

  const [items, setItems] = useState<CartItem[]>([]);
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Read the cart snapshot saved just before redirecting to Stripe
    const saved = sessionStorage.getItem("blue-nova-last-order");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { /* ignore */ }
      sessionStorage.removeItem("blue-nova-last-order");
    }
    // Clear the Zustand cart now that payment succeeded
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 50_000 ? 0 : 3_500;
  const total    = subtotal + shipping;

  // Build a human-readable order reference from the session / payment-intent ID
  const displayRef = ref
    ? `BN-${ref.slice(-8).toUpperCase()}`
    : `BN-${Date.now().toString(36).toUpperCase()}`;

  return (
    <main className="pt-20 pb-24">
      <div className="container-luxury max-w-2xl py-20">
        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-brand-gold/10 flex items-center justify-center">
            <CheckCircle size={48} className="text-brand-gold" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="section-subheading mb-3">Order Confirmed</p>
          <h1 className="font-heading text-4xl md:text-5xl text-brand-blue leading-tight mb-4">
            Thank You
          </h1>
          <div className="gold-divider mt-4 mb-6" />
          <p className="font-body text-sm text-brand-gray-500 leading-relaxed max-w-md mx-auto">
            Your order has been received and is being prepared with the utmost care.
            You will receive an email confirmation shortly.
          </p>
        </div>

        {/* Order reference */}
        <div className="bg-brand-gray-50 border border-brand-gray-100 p-6 text-center mb-10">
          <p className="font-body text-2xs tracking-widest uppercase text-brand-gray-400 mb-1">
            Order Reference
          </p>
          <p className="font-heading text-2xl text-brand-blue tracking-widest">
            {displayRef}
          </p>
        </div>

        {/* Order summary */}
        {items.length > 0 && (
          <div className="mb-10">
            <h2 className="font-heading text-xl text-brand-blue mb-6">What you ordered</h2>
            <div className="divide-y divide-brand-gray-100">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex justify-between items-center py-4"
                >
                  <div>
                    <p className="font-heading text-sm text-brand-blue">{item.name}</p>
                    <p className="font-body text-2xs text-brand-gray-400 mt-0.5">
                      {[
                        item.size  && `Size: ${item.size}`,
                        item.color && `Colour: ${item.color}`,
                        `Qty: ${item.quantity}`,
                      ].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="font-body text-sm text-brand-blue">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-gray-200 mt-4 pt-5 space-y-2">
              <div className="flex justify-between font-body text-xs tracking-widest uppercase text-brand-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-body text-xs tracking-widest uppercase text-brand-gray-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-gray-200">
                <span className="font-heading text-base text-brand-blue">Total Paid</span>
                <span className="font-heading text-xl text-brand-blue">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-white font-body text-sm tracking-widest uppercase transition-all duration-300 ease-luxury hover:bg-brand-gold-dark"
          >
            <ShoppingBag size={15} />
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-brand-blue text-brand-blue font-body text-sm tracking-widest uppercase transition-all duration-300 ease-luxury hover:bg-brand-blue hover:text-white"
          >
            View My Orders
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="pt-20 pb-24">
          <div className="container-luxury max-w-2xl py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-brand-gray-50 animate-pulse mx-auto mb-8" />
            <div className="h-8 w-48 bg-brand-gray-100 animate-pulse mx-auto rounded mb-4" />
            <div className="h-4 w-64 bg-brand-gray-100 animate-pulse mx-auto rounded" />
          </div>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
