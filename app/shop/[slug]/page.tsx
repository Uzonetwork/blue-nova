import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/sanity/fetch";
import ProductDetails from "@/components/product/ProductDetails";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description ?? `Shop ${product.name} by Blue Nova.`,
    openGraph: {
      title: `${product.name} | Blue Nova`,
      description: product.description ?? "",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <main className="pt-20">
      <ProductDetails product={product} />
    </main>
  );
}
