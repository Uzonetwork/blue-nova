import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { productBySlugQuery } from "@/lib/sanity/queries";
import type { Product } from "@/types";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await sanityClient.fetch<Product>(productBySlugQuery, {
    slug: params.slug,
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await sanityClient.fetch<Product>(productBySlugQuery, {
    slug: params.slug,
  });

  if (!product) notFound();

  return (
    <main className="pt-20">
      <section className="container-luxury py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-4/5 bg-brand-gray-100" />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start pt-4">
            <p className="section-subheading mb-4">{product.category}</p>
            <h1 className="font-heading text-4xl text-brand-blue mb-4">{product.name}</h1>
            <div className="gold-divider !mx-0 mb-6" />
            <p className="font-heading text-3xl text-brand-blue mb-8">
              ${product.price.toLocaleString()}
            </p>
            <p className="font-body text-brand-gray-600 text-sm leading-relaxed mb-8">
              {product.description}
            </p>
            <button className="btn-primary w-full">Add to Bag</button>
          </div>
        </div>
      </section>
    </main>
  );
}
