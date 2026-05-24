import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About Blue Nova" };

export default function AboutPage() {
  return (
    <main className="pt-20 pb-24">
      {/* Header */}
      <div className="bg-brand-blue text-white py-24">
        <div className="container-luxury text-center">
          <p className="section-subheading text-brand-gold mb-3">Our Story</p>
          <h1 className="font-heading text-5xl md:text-6xl font-normal leading-tight mb-6">
            Blue Nova
          </h1>
          <div className="gold-divider mt-5" />
          <p className="font-body text-sm text-white/70 mt-8 max-w-lg mx-auto leading-relaxed">
            Luxury fashion for the discerning Nigerian woman. Crafted with intention. Worn with confidence.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="container-luxury max-w-3xl py-20">
        <div className="space-y-8 font-body text-sm text-brand-gray-500 leading-relaxed">
          <div>
            <h2 className="font-heading text-2xl text-brand-blue mb-4">Where It Began</h2>
            <div className="w-8 h-px bg-brand-gold mb-6" />
            <p>
              Blue Nova was born from a simple belief: that African women deserve luxury fashion
              that speaks their language — bold, refined, and unapologetically beautiful. Founded in Lagos,
              we set out to create a curated destination where world-class style meets the warmth and
              vivacity of the Nigerian spirit.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-brand-blue mb-4">What We Stand For</h2>
            <div className="w-8 h-px bg-brand-gold mb-6" />
            <p>
              We believe in fashion that endures beyond seasons. Every Blue Nova piece is selected
              or crafted with longevity in mind — timeless silhouettes, exceptional materials, and
              construction that holds. We are not interested in fast fashion. We are interested in
              wardrobes that age gracefully.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-brand-blue mb-4">Quality Without Compromise</h2>
            <div className="w-8 h-px bg-brand-gold mb-6" />
            <p>
              Our team meticulously vets every supplier, material, and finished product before it
              reaches our shelves. We work with artisans who share our obsession with detail — from
              the weight of the leather on our bags to the fall of fabric on our dresses. If it
              doesn&apos;t meet our standard, it doesn&apos;t carry our name.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-gray-50 py-20">
        <div className="container-luxury">
          <div className="text-center mb-14">
            <p className="section-subheading mb-3">What Guides Us</p>
            <h2 className="section-heading">Our Values</h2>
            <div className="gold-divider mt-5" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Craftsmanship",
                body: "We hold every stitch, seam, and silhouette to the highest standard. Luxury is in the details.",
              },
              {
                title: "Authenticity",
                body: "We celebrate the African woman in all her dimension — no imitation, no compromise.",
              },
              {
                title: "Confidence",
                body: "Great fashion is not about following trends. It&apos;s about walking into any room and owning it.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="text-center p-8 bg-white">
                <div className="w-8 h-px bg-brand-gold mx-auto mb-6" />
                <h3 className="font-heading text-lg text-brand-blue mb-4">{title}</h3>
                <p className="font-body text-sm text-brand-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxury py-20 text-center">
        <h2 className="font-heading text-3xl text-brand-blue mb-4">Discover the Collection</h2>
        <div className="gold-divider mt-4 mb-8" />
        <p className="font-body text-sm text-brand-gray-500 mb-10 max-w-md mx-auto">
          Every piece in our collection is a reflection of our ethos. Browse what&apos;s available now.
        </p>
        <Link href="/shop" className="btn-gold">
          Shop Now
        </Link>
      </section>
    </main>
  );
}
