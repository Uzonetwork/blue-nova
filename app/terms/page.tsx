import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service — Blue Nova" };

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using the Blue Nova website (bluenova.ng) or placing an order, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.",
  },
  {
    title: "2. Products & Pricing",
    body: "All prices are displayed in Nigerian Naira (₦) and include VAT where applicable. We reserve the right to change prices at any time. A price at the time of order placement is the price you will be charged — price changes after order confirmation do not affect existing orders. Product images are for illustrative purposes; slight colour variations may occur.",
  },
  {
    title: "3. Orders & Payment",
    body: "An order is confirmed only after successful payment. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud — in which case a full refund will be issued. Payment is processed securely through Stripe. Blue Nova does not store card details.",
  },
  {
    title: "4. Shipping & Delivery",
    body: "Delivery times are estimates and not guaranteed. Blue Nova is not liable for delays caused by courier services, public holidays, or circumstances beyond our control. Risk of loss passes to you upon delivery. Please refer to our Shipping & Returns page for full details.",
  },
  {
    title: "5. Returns & Refunds",
    body: "We accept returns within 14 days of delivery for eligible items in original condition. Refunds are processed to the original payment method within 5–7 business days. Sale items are non-refundable. Full details are outlined in our Shipping & Returns policy.",
  },
  {
    title: "6. Intellectual Property",
    body: "All content on this website — including text, images, logos, product descriptions, and design — is the property of Blue Nova and protected by Nigerian and international intellectual property law. You may not reproduce, distribute, or create derivative works without our written permission.",
  },
  {
    title: "7. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at hello@bluenova.ng if you suspect unauthorised access. We reserve the right to terminate accounts that violate these terms.",
  },
  {
    title: "8. Limitation of Liability",
    body: "To the maximum extent permitted by Nigerian law, Blue Nova shall not be liable for indirect, incidental, consequential, or punitive damages arising from your use of our services. Our total liability for any claim shall not exceed the amount paid for the relevant order.",
  },
  {
    title: "9. Governing Law",
    body: "These terms are governed by the laws of the Federal Republic of Nigeria. Any dispute shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.",
  },
  {
    title: "10. Changes to These Terms",
    body: "We may update these terms from time to time. The current version will always be published on this page with the date of last update. Continued use of our services after changes constitutes acceptance of the updated terms.",
  },
  {
    title: "11. Contact",
    body: "For any questions about these terms, contact us at legal@bluenova.ng or write to Blue Nova, 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria.",
  },
];

export default function TermsPage() {
  return (
    <main className="pt-20 pb-24">
      <div className="bg-brand-gray-50 border-b border-brand-gray-100 py-16">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-3">Legal</p>
          <h1 className="section-heading">Terms of Service</h1>
          <div className="gold-divider mt-5" />
          <p className="font-body text-xs text-brand-gray-400 mt-6">Last updated: January 2025</p>
        </div>
      </div>

      <div className="container-luxury max-w-3xl py-16 space-y-10">
        <p className="font-body text-sm text-brand-gray-500 leading-relaxed">
          Please read these Terms of Service carefully before using our website or making a purchase.
          These terms constitute a legally binding agreement between you and Blue Nova.
        </p>

        {SECTIONS.map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-heading text-lg text-brand-blue mb-3">{title}</h2>
            <p className="font-body text-sm text-brand-gray-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
