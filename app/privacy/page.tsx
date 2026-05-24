import { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Blue Nova" };

const SECTIONS = [
  {
    title: "Information We Collect",
    body: [
      "When you place an order we collect your name, email address, phone number, and delivery address.",
      "When you create an account we store your login credentials (password is encrypted and never stored in plain text).",
      "We use Stripe for payment processing. Blue Nova does not store your card details — all payment data is handled directly by Stripe under their PCI-compliant infrastructure.",
      "We may collect browsing data (pages visited, time on site) through analytics tools to improve our services.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "To process and fulfil your orders, including shipping and delivery notifications.",
      "To manage your account and respond to your enquiries.",
      "To send you order confirmations and important service communications.",
      "With your consent, to send marketing emails about new arrivals, promotions, and events. You may unsubscribe at any time.",
      "To improve our website, products, and customer experience.",
    ],
  },
  {
    title: "Sharing Your Information",
    body: [
      "We do not sell, rent, or trade your personal information to third parties.",
      "We share order data with our logistics and courier partners solely to fulfil your delivery.",
      "We share payment data with Stripe for transaction processing.",
      "We may disclose information where required by Nigerian law or a valid court order.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We retain your account data for as long as your account is active or as needed to provide services.",
      "Order records are retained for 7 years in compliance with Nigerian financial regulations.",
      "You may request deletion of your account and personal data at any time by emailing hello@bluenova.ng.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We use essential cookies to keep you logged in and maintain your shopping bag.",
      "We use analytics cookies (with your consent) to understand how visitors use our site.",
      "You can manage cookie preferences through your browser settings.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "Access: You may request a copy of the personal data we hold about you.",
      "Correction: You may ask us to correct inaccurate data.",
      "Deletion: You may ask us to delete your data, subject to legal retention requirements.",
      "Portability: You may request your data in a machine-readable format.",
      "To exercise any of these rights, contact us at hello@bluenova.ng.",
    ],
  },
  {
    title: "Security",
    body: [
      "We use industry-standard SSL encryption for all data transmitted on our website.",
      "Access to customer data is restricted to authorised team members only.",
      "While we take every precaution, no method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For any privacy-related questions or requests, please contact our Data Protection Officer at privacy@bluenova.ng or write to us at 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="pt-20 pb-24">
      <div className="bg-brand-gray-50 border-b border-brand-gray-100 py-16">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-3">Legal</p>
          <h1 className="section-heading">Privacy Policy</h1>
          <div className="gold-divider mt-5" />
          <p className="font-body text-xs text-brand-gray-400 mt-6">Last updated: January 2025</p>
        </div>
      </div>

      <div className="container-luxury max-w-3xl py-16 space-y-12">
        <p className="font-body text-sm text-brand-gray-500 leading-relaxed">
          Blue Nova (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This policy explains
          what personal information we collect, how we use it, and your rights as a customer.
          By using our website or placing an order, you agree to this policy.
        </p>

        {SECTIONS.map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-heading text-xl text-brand-blue mb-4">{title}</h2>
            <div className="w-6 h-px bg-brand-gold mb-5" />
            <ul className="space-y-3">
              {body.map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-sm text-brand-gray-500 leading-relaxed">
                  <span className="text-brand-gold mt-1 flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
