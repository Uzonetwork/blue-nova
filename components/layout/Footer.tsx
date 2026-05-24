import Link from "next/link";

const FOOTER_LINKS = {
  Shop: [
    { label: "Handbags",   href: "/shop?category=handbags"   },
    { label: "Shoes",      href: "/shop?category=shoes"      },
    { label: "Clothes",    href: "/shop?category=clothes"    },
    { label: "Sunglasses", href: "/shop?category=sunglasses" },
  ],
  Help: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About Blue Nova", href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-blue text-white">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h2 className="font-heading text-2xl tracking-widest mb-4">BLUE NOVA</h2>
            <div className="w-8 h-px bg-brand-gold mb-6" />
            <p className="font-body text-xs leading-relaxed text-white/60">
              Luxury fashion for the discerning woman. Crafted with intention. Worn with confidence.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-body text-xs tracking-ultra-wide uppercase text-brand-gold mb-6">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-xs text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} Blue Nova. All rights reserved.
          </p>
          <p className="font-body text-xs text-white/40 tracking-widest uppercase">
            Luxury. Refined.
          </p>
        </div>
      </div>
    </footer>
  );
}
