"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate a short delay before showing success
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  }

  const inputCls =
    "w-full border-0 border-b border-brand-gray-200 bg-transparent px-0 py-2 font-body text-sm text-brand-black placeholder-brand-gray-300 focus:border-brand-blue focus:outline-none transition-colors duration-200";
  const labelCls = "block font-body text-xs tracking-widest uppercase text-brand-gray-500 mb-2";

  return (
    <main className="pt-20 pb-24">
      {/* Header */}
      <div className="bg-brand-gray-50 border-b border-brand-gray-100 py-16">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-3">Get In Touch</p>
          <h1 className="section-heading">Contact Us</h1>
          <div className="gold-divider mt-5" />
        </div>
      </div>

      <div className="container-luxury py-16">
        <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start max-w-5xl mx-auto">

          {/* Form */}
          <div>
            <h2 className="font-heading text-2xl text-brand-blue mb-8">Send Us a Message</h2>

            {sent ? (
              <div className="bg-brand-gold/5 border border-brand-gold/30 p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-5">
                  <span className="text-brand-gold text-xl">✓</span>
                </div>
                <h3 className="font-heading text-xl text-brand-blue mb-3">Message Received</h3>
                <p className="font-body text-sm text-brand-gray-500">
                  Thank you for reaching out. A member of our team will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                {error && (
                  <p className="font-body text-xs text-red-500 border border-red-200 bg-red-50 px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-7">
                  <div>
                    <label className={labelCls}>Full Name <span className="text-brand-gold">*</span></label>
                    <input
                      type="text"
                      required
                      className={inputCls}
                      placeholder="Ada Okonkwo"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address <span className="text-brand-gold">*</span></label>
                    <input
                      type="email"
                      required
                      className={inputCls}
                      placeholder="ada@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Subject <span className="text-brand-gold">*</span></label>
                  <input
                    type="text"
                    required
                    className={inputCls}
                    placeholder="Order enquiry, return request, styling advice…"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelCls}>Message <span className="text-brand-gold">*</span></label>
                  <textarea
                    required
                    rows={5}
                    className={`${inputCls} resize-none`}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-10 py-4 bg-brand-gold text-white font-body text-xs tracking-widest uppercase hover:bg-brand-gold-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl text-brand-blue mb-2">Contact Details</h2>
              <div className="w-8 h-px bg-brand-gold mb-8" />
            </div>

            {[
              {
                icon: Mail,
                label: "Email",
                value: "hello@bluenova.ng",
                href: "mailto:hello@bluenova.ng",
              },
              {
                icon: Phone,
                label: "Phone / WhatsApp",
                value: "+234 901 234 5678",
                href: "tel:+2349012345678",
              },
              {
                icon: MapPin,
                label: "Showroom",
                value: "14 Admiralty Way, Lekki Phase 1, Lagos",
                href: undefined,
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} className="text-brand-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-brand-gray-400 mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a href={href} className="font-body text-sm text-brand-blue hover:text-brand-gold transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="font-body text-sm text-brand-blue">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t border-brand-gray-100 pt-8">
              <p className="font-body text-xs tracking-widest uppercase text-brand-gray-400 mb-2">
                Business Hours
              </p>
              <div className="space-y-1 font-body text-sm text-brand-gray-500">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span>9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-brand-gray-400">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
