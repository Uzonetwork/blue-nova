import { Metadata } from "next";

export const metadata: Metadata = { title: "Size Guide — Blue Nova" };

export default function SizeGuidePage() {
  return (
    <main className="pt-20 pb-24">
      {/* Header */}
      <div className="bg-brand-gray-50 border-b border-brand-gray-100 py-16">
        <div className="container-luxury text-center">
          <p className="section-subheading mb-3">Fit Guide</p>
          <h1 className="section-heading">Size Guide</h1>
          <div className="gold-divider mt-5" />
          <p className="font-body text-sm text-brand-gray-500 mt-6 max-w-md mx-auto">
            All measurements are in centimetres. When between sizes, we recommend sizing up for a more comfortable fit.
          </p>
        </div>
      </div>

      <div className="container-luxury max-w-4xl py-16 space-y-16">

        {/* Clothing */}
        <div>
          <h2 className="font-heading text-2xl text-brand-blue mb-2">Clothing</h2>
          <div className="w-8 h-px bg-brand-gold mb-8" />
          <p className="font-body text-sm text-brand-gray-500 mb-6">
            Measure your <strong className="text-brand-blue">bust</strong> (fullest point), <strong className="text-brand-blue">waist</strong> (narrowest point), and <strong className="text-brand-blue">hips</strong> (widest point).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-body text-sm">
              <thead>
                <tr className="bg-brand-blue text-white">
                  {["Size", "Bust (cm)", "Waist (cm)", "Hips (cm)", "UK Size"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs tracking-widest uppercase font-body font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["XS",  "80–83",  "60–63",  "86–89",  "6"],
                  ["S",   "84–87",  "64–67",  "90–93",  "8"],
                  ["M",   "88–92",  "68–72",  "94–98",  "10–12"],
                  ["L",   "93–97",  "73–77",  "99–103", "14"],
                  ["XL",  "98–103", "78–83",  "104–109","16"],
                  ["2XL", "104–110","84–90",  "110–116","18"],
                ].map(([size, bust, waist, hips, uk], i) => (
                  <tr key={size} className={i % 2 === 0 ? "bg-white" : "bg-brand-gray-50"}>
                    <td className="px-4 py-3 font-heading text-brand-blue">{size}</td>
                    <td className="px-4 py-3 text-brand-gray-600">{bust}</td>
                    <td className="px-4 py-3 text-brand-gray-600">{waist}</td>
                    <td className="px-4 py-3 text-brand-gray-600">{hips}</td>
                    <td className="px-4 py-3 text-brand-gray-600">{uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shoes */}
        <div>
          <h2 className="font-heading text-2xl text-brand-blue mb-2">Shoes</h2>
          <div className="w-8 h-px bg-brand-gold mb-8" />
          <p className="font-body text-sm text-brand-gray-500 mb-6">
            Measure your foot length from heel to longest toe while standing. We recommend measuring in the evening when feet are at their largest.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-body text-sm">
              <thead>
                <tr className="bg-brand-blue text-white">
                  {["EU Size", "UK Size", "US Size", "Foot Length (cm)"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs tracking-widest uppercase font-body font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["36", "3",   "5.5", "22.5"],
                  ["37", "4",   "6.5", "23.5"],
                  ["38", "5",   "7.5", "24.5"],
                  ["39", "6",   "8.5", "25.0"],
                  ["40", "6.5", "9",   "25.5"],
                  ["41", "7",   "9.5", "26.0"],
                  ["42", "8",   "10",  "26.5"],
                ].map(([eu, uk, us, cm], i) => (
                  <tr key={eu} className={i % 2 === 0 ? "bg-white" : "bg-brand-gray-50"}>
                    <td className="px-4 py-3 font-heading text-brand-blue">{eu}</td>
                    <td className="px-4 py-3 text-brand-gray-600">{uk}</td>
                    <td className="px-4 py-3 text-brand-gray-600">{us}</td>
                    <td className="px-4 py-3 text-brand-gray-600">{cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Handbags */}
        <div>
          <h2 className="font-heading text-2xl text-brand-blue mb-2">Handbags</h2>
          <div className="w-8 h-px bg-brand-gold mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                size: "Mini",
                dims: "W: 15–18 cm · H: 10–14 cm · D: 5–7 cm",
                note: "Fits phone, cards, and keys. Perfect for evenings.",
              },
              {
                size: "Medium",
                dims: "W: 25–30 cm · H: 18–22 cm · D: 8–12 cm",
                note: "Fits daily essentials including a small tablet or notebook.",
              },
              {
                size: "Large",
                dims: "W: 35–40 cm · H: 28–32 cm · D: 12–15 cm",
                note: "A-5 notebook, wallet, makeup bag, and more.",
              },
            ].map(({ size, dims, note }) => (
              <div key={size} className="border border-brand-gray-100 p-6">
                <h3 className="font-heading text-base text-brand-blue mb-2">{size}</h3>
                <p className="font-body text-xs text-brand-gold tracking-widest mb-3">{dims}</p>
                <p className="font-body text-sm text-brand-gray-500">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="bg-brand-gray-50 border border-brand-gray-100 p-8 text-center">
          <p className="font-heading text-base text-brand-blue mb-2">Not sure about your size?</p>
          <p className="font-body text-sm text-brand-gray-500 mb-6">
            Our style advisors are happy to help you find your perfect fit.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 border border-brand-blue text-brand-blue font-body text-xs tracking-widest uppercase hover:bg-brand-blue hover:text-white transition-colors duration-200"
          >
            Ask a Stylist
          </a>
        </div>
      </div>
    </main>
  );
}
