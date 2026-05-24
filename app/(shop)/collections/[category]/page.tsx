import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ProductCategory } from "@/types";

const VALID_CATEGORIES: ProductCategory[] = ["handbags", "shoes", "clothes", "sunglasses"];

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const label = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  return {
    title: label,
    description: `Shop Blue Nova ${label} — luxury fashion for the discerning woman.`,
  };
}

export default function CategoryPage({ params }: Props) {
  if (!VALID_CATEGORIES.includes(params.category as ProductCategory)) {
    notFound();
  }

  const label = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <main className="pt-20">
      <section className="py-16 container-luxury">
        <div className="text-center mb-12">
          <p className="section-subheading mb-4">Blue Nova</p>
          <h1 className="section-heading">{label}</h1>
          <div className="gold-divider mt-6" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <p className="col-span-full text-center font-body text-brand-gray-500 text-sm py-16">
            Products from Sanity will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}
