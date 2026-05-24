import { Metadata } from "next";
import { Truck, RotateCcw, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = { title: "Shipping & Returns — Blue Nova" };

export default function ShippingPage() {
  return (
    <main className="pt-20 pb-24">
      {/* Header */}
      <div className="bg-brand-gray-50 border-b border-brand-gray-100 py-16">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-3">Delivery & Returns</p>
          <h1 className="section-heading">Shipping & Returns</h1>
          <div className="gold-divider mt-5" />
        </div>
      </div>

      <div className="container-luxury max-w-3xl py-16 space-y-16">

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck,      label: "Free Delivery",    sub: "Orders over ₦50,000" },
            { icon: Clock,      label: "Lagos 1–3 Days",   sub: "Business days" },
            { icon: MapPin,     label: "Nigeria-Wide",     sub: "All 36 states + FCT" },
            { icon: RotateCcw,  label: "14-Day Returns",   sub: "Hassle-free" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="text-center p-6 bg-brand-gray-50">
              <Icon size={24} className="text-brand-gold mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-heading text-sm text-brand-blue mb-1">{label}</p>
              <p className="font-body text-xs text-brand-gray-400">{sub}</p>
            </div>
          ))}
        </div>

        {/* Shipping */}
        <div>
          <h2 className="font-heading text-2xl text-brand-blue mb-2">Shipping Information</h2>
          <div className="w-8 h-px bg-brand-gold mb-8" />

          <div className="space-y-6 font-body text-sm text-brand-gray-500 leading-relaxed">
            <div className="border border-brand-gray-100 p-6">
              <h3 className="font-heading text-base text-brand-blue mb-3">Delivery Fees</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-brand-gray-100">
                  <span>Orders above ₦50,000</span>
                  <span className="text-green-600 font-heading">Free</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>All other orders</span>
                  <span className="font-heading text-brand-blue">₦3,500</span>
                </div>
              </div>
            </div>

            <div className="border border-brand-gray-100 p-6">
              <h3 className="font-heading text-base text-brand-blue mb-3">Delivery Times</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-brand-gray-100">
                  <span>Lagos (Island & Mainland)</span>
                  <span className="font-heading text-brand-blue">1–3 business days</span>
                </div>
                <div className="flex justify-between py-2 border-b border-brand-gray-100">
                  <span>Abuja, Port Harcourt, Enugu</span>
                  <span className="font-heading text-brand-blue">2–4 business days</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>All other states</span>
                  <span className="font-heading text-brand-blue">3–7 business days</span>
                </div>
              </div>
            </div>

            <p>
              Orders placed before 12:00 PM WAT on a business day are processed the same day.
              Orders placed after 12:00 PM or on weekends/public holidays are processed the next business day.
            </p>
            <p>
              You will receive an SMS and email notification with tracking details once your order has been dispatched.
            </p>
          </div>
        </div>

        {/* Returns */}
        <div>
          <h2 className="font-heading text-2xl text-brand-blue mb-2">Returns & Exchanges</h2>
          <div className="w-8 h-px bg-brand-gold mb-8" />

          <div className="space-y-6 font-body text-sm text-brand-gray-500 leading-relaxed">
            <div className="bg-brand-gold/5 border border-brand-gold/20 p-6">
              <p className="font-heading text-brand-blue text-base mb-1">14-Day Return Window</p>
              <p>
                We accept returns within 14 days of the delivery date. Items must be unworn,
                unwashed, and in their original packaging with all tags attached.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-base text-brand-blue mb-3">Eligible for Return</h3>
              <ul className="space-y-1 list-none">
                {[
                  "Full-price clothing, shoes, and accessories",
                  "Items in original condition with tags attached",
                  "Items in original packaging",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-base text-brand-blue mb-3">Not Eligible for Return</h3>
              <ul className="space-y-1 list-none">
                {[
                  "Sale and discounted items (final sale)",
                  "Swimwear and intimate apparel",
                  "Items that have been worn, washed, or altered",
                  "Items without original tags or packaging",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-base text-brand-blue mb-3">How to Return</h3>
              <ol className="space-y-2 list-none">
                {[
                  "Email hello@bluenova.ng with your order reference and reason for return.",
                  "Our team will confirm eligibility and arrange a courier pickup.",
                  "Refunds are processed within 5–7 business days to your original payment method.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-heading text-brand-gold text-base flex-shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-brand-blue text-white p-10 text-center">
          <h3 className="font-heading text-xl mb-3">Need Help With Your Order?</h3>
          <div className="w-8 h-px bg-brand-gold mx-auto mb-5" />
          <p className="font-body text-sm text-white/70 mb-6">
            Reach us at <a href="mailto:hello@bluenova.ng" className="text-brand-gold hover:underline">hello@bluenova.ng</a> or via our contact form.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold text-white font-body text-xs tracking-widest uppercase hover:bg-brand-gold-dark transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
