import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getAllCategories } from "@/lib/sanity/fetch";
import { getImageUrl } from "@/lib/sanity/client";
import ProductCard from "@/components/product/ProductCard";
import HeroCarousel from "@/components/home/HeroCarousel";
import type { Product } from "@/types";

export const revalidate = 60;

// Unsplash fallbacks — used when a category has no image in Sanity
const CATEGORY_CONFIG = [
  {
    label: "Handbags",
    slug: "handbags",
    fallback: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
  },
  {
    label: "Shoes",
    slug: "shoes",
    fallback: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
  },
  {
    label: "Clothes",
    slug: "clothes",
    fallback: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
  },
  {
    label: "Sunglasses",
    slug: "sunglasses",
    fallback: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
  },
] as const;

export default async function HomePage() {
  // Fetch in parallel; fall back gracefully if Sanity isn't connected
  const [featuredResult, categoriesResult] = await Promise.allSettled([
    getFeaturedProducts(),
    getAllCategories(),
  ]);

  const featured: Product[] =
    featuredResult.status === "fulfilled" ? featuredResult.value : [];

  // Build slug → URL map from Sanity categories that have images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sanityCategories: any[] =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  const sanityImageMap = new Map<string, string>(
    sanityCategories
      .map((c) => [c.slug, getImageUrl(c.image, 800, 1066)] as [string, string | null])
      .filter((entry): entry is [string, string] => !!entry[0] && entry[1] !== null)
  );

  return (
    <main>
      {/* ── Hero carousel ────────────────────────────────────────────────── */}
      <HeroCarousel />

      {/* ── Category Cards ───────────────────────────────────────────────── */}
      <section className="py-24 container-luxury">
        <div className="text-center mb-16">
          <p className="section-subheading mb-4">Shop By Category</p>
          <h2 className="section-heading">The Edit</h2>
          <div className="gold-divider mt-6" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_CONFIG.map(({ label, slug, fallback }) => {
            // Prefer Sanity image; fall back to Unsplash
            const imageUrl = sanityImageMap.get(slug) ?? fallback;

            return (
              <Link
                key={slug}
                href={`/shop?category=${slug}`}
                className="group relative aspect-3/4 overflow-hidden block"
              >
                {/* Background image */}
                <Image
                  src={imageUrl}
                  alt={label}
                  fill
                  className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Dark overlay — deepens on hover for text readability */}
                <div className="absolute inset-0 bg-brand-blue/45 group-hover:bg-brand-blue/60 transition-all duration-500 z-10" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="font-heading text-xl text-white leading-tight">
                    {label}
                  </h3>
                  <p className="font-body text-xs tracking-widest uppercase text-brand-gold mt-1.5">
                    Shop Now →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-24 bg-brand-gray-50">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="section-subheading mb-4">Curated For You</p>
            <h2 className="section-heading">Featured Pieces</h2>
            <div className="gold-divider mt-6" />
          </div>

          {featured.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
                {featured.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-14">
                <Link href="/shop" className="btn-secondary">
                  View All Products
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="font-body text-brand-gray-500 text-sm mb-8">
                No featured products yet — mark products as featured in Sanity Studio.
              </p>
              <Link href="/shop" className="btn-secondary">
                Shop All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
