"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4">
      {/* Image */}
      <div className="relative w-20 h-24 bg-brand-gray-100 flex-shrink-0 overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-2xs text-brand-gray-300">BN</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-heading text-sm text-brand-blue leading-tight pr-4">{item.name}</h4>
          <button
            onClick={() => removeItem(item.productId, item.size, item.color)}
            className="text-brand-gray-300 hover:text-brand-blue transition-colors flex-shrink-0"
            aria-label="Remove item"
          >
            <X size={14} />
          </button>
        </div>

        {(item.size || item.color) && (
          <p className="font-body text-2xs text-brand-gray-400 mb-2">
            {[item.size, item.color].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border border-brand-gray-200">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}
              className="p-1 text-brand-gray-400 hover:text-brand-blue transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="font-body text-xs w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}
              className="p-1 text-brand-gray-400 hover:text-brand-blue transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="font-heading text-sm text-brand-blue">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
