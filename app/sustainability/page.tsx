import { Metadata } from "next";
import { Leaf, Users, Package, Recycle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Sustainability — Blue Nova" };

export default function SustainabilityPage() {
  return (
    <main className="pt-20 pb-24">
      {/* Header */}
      <div className="bg-brand-blue text-white py-24">
        <div className="container-luxury text-center">
          <p className="section-subheading text-brand-gold mb-3">Our Commitment</p>
          <h1 className="font-heading text-5xl font-normal leading-tight mb-6">
            Sustainability
          </h1>
          <div className="gold-divider mt-5" />
          <p className="font-body text-sm text-white/70 mt-8 max-w-lg mx-auto leading-relaxed">
            Luxury should never come at the cost of the planet or its people.
            Here is how we&apos;re working to do better.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <section className="container-luxury py-20">
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {[
            {
              icon: Leaf,
              title: "Responsible Sourcing",
              body: "We work exclusively with suppliers who meet our environmental and ethical standards. We prioritise natural fibres, recycled materials, and low-impact dyes wherever possible. Before any material enters our supply chain, we audit its journey from origin to shelf.",
            },
            {
              icon: Users,
              title: "Fair Labour Practices",
              body: "Every artisan and worker in our supply chain is compensated fairly. We partner with manufacturers who provide safe working conditions, reasonable hours, and wages above the local living standard. We conduct regular audits and publish the results.",
            },
            {
              icon: Package,
              title: "Conscious Packaging",
              body: "Our packaging is made from 100% recycled or FSC-certified materials. We use soy-based inks, avoid single-use plastics, and design packaging to be reusable or fully recyclable. We are working toward plastic-free operations by 2026.",
            },
            {
              icon: Recycle,
              title: "Circularity Programme",
              body: "We believe clothes should not end up in landfill. Our take-back programme allows customers to return worn Blue Nova pieces in exchange for store credit. Returned garments are repaired, resold, or responsibly recycled through certified partners.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-6">
              <div className="w-12 h-12 bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Icon size={20} className="text-brand-gold" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-heading text-lg text-brand-blue mb-3">{title}</h3>
                <p className="font-body text-sm text-brand-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Targets */}
      <section className="bg-brand-gray-50 py-20">
        <div className="container-luxury max-w-3xl">
          <div className="text-center mb-14">
            <p className="section-subheading mb-3">Progress</p>
            <h2 className="section-heading">Our 2026 Targets</h2>
            <div className="gold-divider mt-5" />
          </div>
          <div className="space-y-6">
            {[
              { label: "Plastic-free packaging",           progress: 72 },
              { label: "Suppliers with ethical certification", progress: 85 },
              { label: "Carbon-neutral Lagos deliveries",  progress: 40 },
              { label: "Take-back programme adoption",     progress: 28 },
            ].map(({ label, progress }) => (
              <div key={label}>
                <div className="flex justify-between font-body text-xs tracking-widest uppercase text-brand-gray-500 mb-2">
                  <span>{label}</span>
                  <span className="text-brand-gold">{progress}%</span>
                </div>
                <div className="h-1 bg-brand-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-gold rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxury py-20 text-center max-w-2xl">
        <h2 className="font-heading text-3xl text-brand-blue mb-4">
          Shop With Purpose
        </h2>
        <div className="gold-divider mt-4 mb-8" />
        <p className="font-body text-sm text-brand-gray-500 mb-10 leading-relaxed">
          Every Blue Nova purchase contributes to our sustainability fund, which is reinvested
          into our recycling partners, artisan training programmes, and community initiatives across Nigeria.
        </p>
        <Link href="/shop" className="btn-gold">
          Explore the Collection
        </Link>
      </section>
    </main>
  );
}
