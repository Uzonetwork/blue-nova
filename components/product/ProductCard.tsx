"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { getImageUrl } from "@/lib/sanity/client";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCartStore();

  const imageUrl = getImageUrl(product.images?.[0], 600, 800);

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? calculateDiscount(product.price, product.compareAtPrice)
      : null;

  const inStock = product.stock > 0;
  const hasVariants =
    (product.sizes && product.sizes.length > 0) ||
    (product.colors && product.colors.length > 0);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    if (hasVariants) {
      router.push(`/shop/${product.slug}`);
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: imageUrl ?? "",
      quantity: 1,
      slug: product.slug,
      category: product.category,
    });
  }

  return (
    <article className="group relative product-card">
      {/* Full-card invisible link — sits below interactive elements */}
      <Link
        href={`/shop/${product.slug}`}
        className="absolute inset-0 z-10"
        aria-label={product.name}
      />

      {/* Image */}
      <div className="relative aspect-3/4 bg-brand-gray-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-gray-300">
            <span className="font-heading text-sm tracking-widest">BLUE NOVA</span>
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 left-3 z-20 bg-brand-gold text-white font-body text-2xs px-2 py-1 tracking-widest uppercase">
            -{discount}%
          </div>
        )}

        {/* Sold out overlay */}
        {!inStock && (
          <div className="absolute inset-0 z-20 bg-white/60 flex items-center justify-center">
            <span className="font-body text-xs tracking-widest uppercase text-brand-gray-500">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick-add — slides up from bottom on hover */}
        {inStock && (
          <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-luxury">
            <button
              onClick={handleQuickAdd}
              className="w-full flex items-center justify-center gap-2 bg-brand-blue/95 hover:bg-brand-gold py-3 font-body text-2xs tracking-widest uppercase text-white transition-colors duration-200"
            >
              <ShoppingBag size={13} />
              {hasVariants ? "Select Options" : "Quick Add"}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-4 pb-2 relative z-10 pointer-events-none">
        <p className="font-body text-2xs tracking-ultra-wide uppercase text-brand-gold mb-1">
          {product.category}
        </p>
        <h3 className="font-heading text-base text-brand-blue leading-tight mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="font-body text-sm text-brand-blue font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="font-body text-xs text-brand-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
