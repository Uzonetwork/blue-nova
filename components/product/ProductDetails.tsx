"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ChevronRight, ShoppingBag } from "lucide-react";
import { getImageUrl } from "@/lib/sanity/client";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

type Tab = "description" | "materials" | "care";

const TAB_LABELS: Record<Tab, string> = {
  description: "Description",
  materials:   "Materials",
  care:        "Care",
};

interface Props {
  product: Product;
}

export default function ProductDetails({ product }: Props) {
  const [selectedImage, setSelectedImage]   = useState(0);
  const [selectedSize, setSelectedSize]     = useState<string | null>(null);
  const [selectedColor, setSelectedColor]   = useState<string | null>(null);
  const [quantity, setQuantity]             = useState(1);
  const [activeTab, setActiveTab]           = useState<Tab>("description");
  const [added, setAdded]                   = useState(false);

  const { addItem } = useCartStore();

  const images    = product.images ?? [];
  const inStock   = product.stock > 0;
  const discount  =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? calculateDiscount(product.price, product.compareAtPrice)
      : null;

  const mainImageUrl = getImageUrl(images[selectedImage], 900, 1125);

  function thumbUrl(index: number) {
    return getImageUrl(images[index], 120, 150);
  }

  function handleAddToCart() {
    if (!inStock) return;

    addItem({
      productId: product._id,
      name:      product.name,
      price:     product.price,
      image:     mainImageUrl ?? "",
      quantity,
      size:      selectedSize  ?? undefined,
      color:     selectedColor ?? undefined,
      slug:      product.slug,
      category:  product.category,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => (product.stock > 0 && q >= product.stock ? q : q + 1));
  }

  return (
    <section className="container-luxury py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-10 font-body text-2xs tracking-widest uppercase text-brand-gray-400">
        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link href="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
        <ChevronRight size={10} />
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-brand-gold transition-colors capitalize"
        >
          {product.category}
        </Link>
        <ChevronRight size={10} />
        <span className="text-brand-blue truncate max-w-[12rem]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20">
        {/* ── IMAGE GALLERY ─────────────────────────────────────────────── */}
        <div className="flex gap-4">
          {/* Vertical thumbnails — desktop */}
          {images.length > 1 && (
            <div className="hidden lg:flex flex-col gap-3 w-[4.5rem] flex-shrink-0">
              {images.map((_, i) => {
                const url = thumbUrl(i);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-[4.5rem] h-[5.5rem] bg-brand-gray-50 overflow-hidden border-2 transition-colors duration-200 ${
                      i === selectedImage
                        ? "border-brand-blue"
                        : "border-transparent hover:border-brand-gray-300"
                    }`}
                  >
                    {url && (
                      <Image
                        src={url}
                        alt={`View ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1 min-w-0">
            <div className="relative aspect-4/5 bg-brand-gray-50 overflow-hidden">
              {mainImageUrl ? (
                <Image
                  src={mainImageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-5xl text-brand-gray-200">BN</span>
                </div>
              )}

              {discount && (
                <div className="absolute top-4 left-4 bg-brand-gold text-white font-body text-2xs px-3 py-1 tracking-widest uppercase">
                  -{discount}% Off
                </div>
              )}
            </div>

            {/* Horizontal thumbnails — mobile */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 lg:hidden overflow-x-auto pb-1">
                {images.map((_, i) => {
                  const url = thumbUrl(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative flex-shrink-0 w-14 h-[4.5rem] bg-brand-gray-50 overflow-hidden border-2 transition-colors duration-200 ${
                        i === selectedImage
                          ? "border-brand-blue"
                          : "border-brand-gray-200"
                      }`}
                    >
                      {url && (
                        <Image
                          src={url}
                          alt={`View ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── PRODUCT INFO ──────────────────────────────────────────────── */}
        <div className="flex flex-col">
          {/* Category badge */}
          <p className="section-subheading mb-3 capitalize">{product.category}</p>

          {/* Name */}
          <h1 className="font-heading text-4xl lg:text-5xl text-brand-blue leading-tight mb-5">
            {product.name}
          </h1>

          <div className="gold-divider !mx-0 mb-6" />

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-heading text-3xl text-brand-blue">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-body text-lg text-brand-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          <p
            className={`font-body text-2xs tracking-widest uppercase mb-8 ${
              inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {inStock ? `In Stock — ${product.stock} available` : "Sold Out"}
          </p>

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-7">
              <div className="flex justify-between items-center mb-3">
                <span className="font-body text-2xs tracking-widest uppercase text-brand-gray-500">
                  Size
                </span>
                {selectedSize && (
                  <span className="font-body text-2xs text-brand-gold tracking-widest uppercase">
                    {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(selectedSize === size ? null : size)
                    }
                    className={`min-w-[3rem] px-3 py-2 font-body text-xs tracking-wide border transition-colors duration-200 ${
                      selectedSize === size
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-brand-gray-200 text-brand-gray-700 hover:border-brand-blue hover:text-brand-blue"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-body text-2xs tracking-widest uppercase text-brand-gray-500">
                  Colour
                </span>
                {selectedColor && (
                  <span className="font-body text-2xs text-brand-gold tracking-widest uppercase">
                    {selectedColor}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() =>
                      setSelectedColor(
                        selectedColor === color.name ? null : color.name
                      )
                    }
                    title={color.name}
                    style={{ backgroundColor: color.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.name
                        ? "border-brand-blue ring-2 ring-brand-blue ring-offset-2 scale-110"
                        : "border-brand-gray-200 hover:border-brand-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mb-8">
            <span className="block font-body text-2xs tracking-widest uppercase text-brand-gray-500 mb-3">
              Quantity
            </span>
            <div className="inline-flex items-center border border-brand-gray-200">
              <button
                onClick={decreaseQty}
                disabled={quantity <= 1}
                className="px-4 py-3 text-brand-gray-400 hover:text-brand-blue disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="px-6 font-body text-sm text-brand-blue min-w-[3.5rem] text-center select-none">
                {quantity}
              </span>
              <button
                onClick={increaseQty}
                disabled={inStock && quantity >= product.stock}
                className="px-4 py-3 text-brand-gray-400 hover:text-brand-blue disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Add to bag */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-body text-sm tracking-widest uppercase transition-all duration-300 ease-luxury ${
              added
                ? "bg-green-600 text-white"
                : inStock
                ? "bg-brand-gold text-white hover:bg-brand-gold-dark"
                : "bg-brand-gray-200 text-brand-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingBag size={16} />
            {added ? "Added to Bag!" : inStock ? "Add to Bag" : "Sold Out"}
          </button>

          {/* ── TABS ──────────────────────────────────────────────────────── */}
          <div className="mt-12 border-t border-brand-gray-100">
            {/* Tab headers */}
            <div className="flex gap-0 border-b border-brand-gray-100 mt-0">
              {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 font-body text-2xs tracking-widest uppercase border-b-2 transition-colors duration-200 ${
                    activeTab === tab
                      ? "border-brand-gold text-brand-blue -mb-px"
                      : "border-transparent text-brand-gray-400 hover:text-brand-gray-600"
                  }`}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="pt-6 font-body text-sm text-brand-gray-600 leading-relaxed">
              {activeTab === "description" && (
                <p>{product.description || "No description available."}</p>
              )}
              {activeTab === "materials" && (
                <p>{product.materials || "Material information coming soon."}</p>
              )}
              {activeTab === "care" && (
                <p>
                  {product.careInstructions ||
                    "Care instructions coming soon."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
