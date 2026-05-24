import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/sanity/fetch";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Explore the full Blue Nova collection — luxury handbags, shoes, clothes, and sunglasses.",
};

export const revalidate = 60;

function ShopFallback() {
  return (
    <main className="pt-20">
      <section className="bg-brand-gray-50 border-b border-brand-gray-100 py-16">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-4">Blue Nova</p>
          <h1 className="section-heading">Shop</h1>
          <div className="gold-divider mt-6" />
        </div>
      </section>
      <section className="container-luxury py-12">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-3/4 bg-brand-gray-100" />
              <div className="pt-4 space-y-2">
                <div className="h-2 w-16 bg-brand-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-brand-gray-100 rounded" />
                <div className="h-3 w-1/3 bg-brand-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopClient products={products} />
    </Suspense>
  );
}
