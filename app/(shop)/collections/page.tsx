import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse all Blue Nova collections — handbags, shoes, clothes, and sunglasses.",
};

export default function CollectionsPage() {
  return (
    <main className="pt-20">
      <section className="py-16 container-luxury">
        <div className="text-center mb-12">
          <p className="section-subheading mb-4">Explore</p>
          <h1 className="section-heading">All Collections</h1>
          <div className="gold-divider mt-6" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {["Handbags", "Shoes", "Clothes", "Sunglasses"].map((cat) => (
            <a
              key={cat}
              href={`/collections/${cat.toLowerCase()}`}
              className="product-card aspect-3/4 flex flex-col justify-end p-6 bg-brand-gray-100"
            >
              <h2 className="font-heading text-2xl text-brand-blue">{cat}</h2>
              <p className="section-subheading mt-2">Shop Now</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
