import { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ — Blue Nova" };

const FAQS = [
  {
    section: "Orders & Payment",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major debit and credit cards (Visa, Mastercard, Verve) processed securely through Stripe. All transactions are in Nigerian Naira (₦).",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 2 hours of placement. Please contact us at hello@bluenova.ng immediately with your order reference number.",
      },
      {
        q: "How do I know my order was placed successfully?",
        a: "You will receive an email confirmation with your order reference (beginning with BN-) within minutes of completing your payment. Check your spam folder if it doesn't arrive.",
      },
    ],
  },
  {
    section: "Shipping & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Lagos deliveries arrive within 1–3 business days. Orders to other states take 3–7 business days. We partner with reliable couriers to ensure your pieces arrive in perfect condition.",
      },
      {
        q: "Is there a free shipping threshold?",
        a: "Yes — enjoy free delivery on all orders above ₦50,000. Orders below this amount attract a flat ₦3,500 delivery fee.",
      },
      {
        q: "Do you ship outside Nigeria?",
        a: "Currently we ship within Nigeria only. International shipping is coming soon — sign up for our newsletter to be notified.",
      },
    ],
  },
  {
    section: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 14 days of delivery for unworn, unwashed items in their original packaging with all tags attached. Sale items are final sale.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email hello@bluenova.ng with your order reference and reason for return. We will arrange a pickup and process your refund within 5–7 business days.",
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes, size exchanges are free of charge on your first exchange per order. Simply contact us within 14 days and we'll arrange the swap.",
      },
    ],
  },
  {
    section: "Products",
    items: [
      {
        q: "How do I find my correct size?",
        a: "Visit our Size Guide page for detailed measurements for clothing, shoes, and bags. When in doubt, we recommend sizing up.",
      },
      {
        q: "Are your products authentic?",
        a: "Every Blue Nova piece is authentically crafted. We work with vetted artisans and manufacturers who meet our strict quality standards.",
      },
      {
        q: "How do I care for my Blue Nova pieces?",
        a: "Care instructions are included on each product page and on the garment label. For leather goods, we recommend professional cleaning.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="pt-20 pb-24">
      {/* Header */}
      <div className="bg-brand-gray-50 border-b border-brand-gray-100 py-16">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-3">Help Centre</p>
          <h1 className="section-heading">Frequently Asked Questions</h1>
          <div className="gold-divider mt-5" />
        </div>
      </div>

      <div className="container-luxury max-w-3xl py-16">
        {FAQS.map(({ section, items }) => (
          <div key={section} className="mb-14">
            <h2 className="font-heading text-xl text-brand-blue mb-8 pb-3 border-b border-brand-gray-100">
              {section}
            </h2>
            <div className="space-y-8">
              {items.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-heading text-base text-brand-blue mb-2">{q}</h3>
                  <p className="font-body text-sm text-brand-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-brand-blue text-white p-10 text-center mt-8">
          <h3 className="font-heading text-xl mb-3">Still have questions?</h3>
          <div className="w-8 h-px bg-brand-gold mx-auto mb-5" />
          <p className="font-body text-sm text-white/70 mb-6">
            Our team is available Monday – Saturday, 9am – 6pm WAT.
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
