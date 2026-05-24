"use client";

import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalPrice } = useCartStore();
  const total = totalPrice();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-black/30 z-40 animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-400 ease-luxury ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-brand-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-brand-blue" />
            <h2 className="font-heading text-lg text-brand-blue">Your Bag</h2>
          </div>
          <button
            onClick={closeCart}
            className="text-brand-gray-400 hover:text-brand-blue transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={40} className="text-brand-gray-200 mb-4" />
              <p className="font-heading text-lg text-brand-gray-400 mb-2">Your bag is empty</p>
              <p className="font-body text-xs text-brand-gray-400 mb-8">
                Discover our latest collection
              </p>
              <button onClick={closeCart} className="btn-secondary">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-brand-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="font-body text-xs tracking-widest uppercase text-brand-gray-500">
                Subtotal
              </span>
              <span className="font-heading text-xl text-brand-blue">
                {formatPrice(total)}
              </span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center block mb-3">
              Checkout
            </Link>
            <Link href="/cart" onClick={closeCart} className="btn-secondary w-full text-center block">
              View Bag
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
