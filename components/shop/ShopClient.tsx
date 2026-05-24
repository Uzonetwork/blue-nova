"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product, ProductCategory } from "@/types";

const CATEGORIES: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All",         value: "all"        },
  { label: "Handbags",   value: "handbags"   },
  { label: "Shoes",      value: "shoes"      },
  { label: "Clothes",    value: "clothes"    },
  { label: "Sunglasses", value: "sunglasses" },
];

type SortOption = "newest" | "price-asc" | "price-desc";

interface Props {
  products: Product[];
}

export default function ShopClient({ products }: Props) {
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get("category") as ProductCategory | null;
  const initialCategory: ProductCategory | "all" =
    paramCategory && CATEGORIES.some((c) => c.value === paramCategory)
      ? paramCategory
      : "all";

  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(initialCategory);
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let result =
      activeCategory === "all"
        ? [...products]
        : products.filter((p) => p.category === activeCategory);

    if (sort === "price-asc")  result = result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, activeCategory, sort]);

  return (
    <main className="pt-20">
      {/* Page header */}
      <section className="bg-brand-gray-50 border-b border-brand-gray-100 py-16">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-4">Blue Nova</p>
          <h1 className="section-heading">Shop</h1>
          <div className="gold-divider mt-6" />
        </div>
      </section>

      <section className="container-luxury py-12">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-brand-gray-100">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`font-body text-2xs tracking-widest uppercase px-5 py-2 border transition-colors duration-200 ${
                  activeCategory === cat.value
                    ? "bg-brand-blue text-white border-brand-blue"
                    : "border-brand-gray-300 text-brand-gray-600 hover:border-brand-blue hover:text-brand-blue"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort + count */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-body text-2xs text-brand-gray-400 tracking-widest uppercase">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </span>
            <div className="flex items-center gap-2 border border-brand-gray-200 px-3 py-2">
              <SlidersHorizontal size={12} className="text-brand-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="font-body text-2xs tracking-widest uppercase text-brand-gray-600 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile count */}
        <p className="sm:hidden font-body text-2xs text-brand-gray-400 tracking-widest uppercase mb-8">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-heading text-2xl text-brand-gray-200 mb-3">
              No products found
            </p>
            <p className="font-body text-xs text-brand-gray-400 tracking-widest uppercase">
              Try a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
