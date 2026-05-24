import { Metadata } from "next";
import { searchProducts } from "@/lib/sanity/fetch";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

export const metadata: Metadata = { title: "Search — Blue Nova" };

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() ?? "";

  let results: Product[] = [];
  if (query) {
    try {
      results = await searchProducts(query);
    } catch {
      // Sanity unavailable — show empty state
    }
  }

  return (
    <main className="pt-20 pb-24">
      {/* Header */}
      <div className="bg-brand-gray-50 border-b border-brand-gray-100 py-12">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-3">Search</p>
          <h1 className="section-heading">
            {query ? `"${query}"` : "Search Products"}
          </h1>
          <div className="gold-divider mt-5" />
        </div>
      </div>

      <div className="container-luxury py-14">
        {/* Search bar */}
        <form action="/search" method="get" className="max-w-xl mx-auto mb-14">
          <div className="flex gap-0 border-b-2 border-brand-gray-200 focus-within:border-brand-blue transition-colors">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search handbags, shoes, clothes…"
              className="flex-1 bg-transparent font-body text-sm text-brand-black placeholder-brand-gray-300 py-3 focus:outline-none"
            />
            <button
              type="submit"
              className="pl-4 font-body text-xs tracking-widest uppercase text-brand-gray-500 hover:text-brand-gold transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {query && (
          <>
            <p className="font-body text-xs tracking-widest uppercase text-brand-gray-400 mb-8">
              {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-heading text-2xl text-brand-gray-300 mb-4">No results found</p>
                <p className="font-body text-sm text-brand-gray-400">
                  Try a different search term or browse our collections.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
