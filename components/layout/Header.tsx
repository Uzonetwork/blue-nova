"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const NAV_LINKS = [
  { label: "Handbags",   href: "/shop?category=handbags"   },
  { label: "Shoes",      href: "/shop?category=shoes"      },
  { label: "Clothes",    href: "/shop?category=clothes"    },
  { label: "Sunglasses", href: "/shop?category=sunglasses" },
  { label: "Shop All",   href: "/shop"                     },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { totalItems, openCart } = useCartStore();
  const itemCount = mounted ? totalItems() : 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-gray-100">
      <div className="container-luxury">
        <div className="grid grid-cols-3 items-center h-16 md:h-20">
          {/* Left: mobile menu button / desktop left nav */}
          <div className="flex items-center">
            <button
              className="md:hidden text-brand-blue"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.slice(0, 2).map((link) => (
                <Link key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="font-heading text-xl md:text-2xl tracking-widest text-brand-blue whitespace-nowrap"
            >
              BLUE NOVA
            </Link>
          </div>

          {/* Right: desktop right nav + icon actions */}
          <div className="flex items-center justify-end gap-6 md:gap-8">
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.slice(2, 4).map((link) => (
                <Link key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4 md:gap-6">
              <Link href="/search" className="text-brand-gray-600 hover:text-brand-gold transition-colors" aria-label="Search">
                <Search size={18} />
              </Link>
              <Link href="/login" className="text-brand-gray-600 hover:text-brand-gold transition-colors" aria-label="Account">
                <User size={18} />
              </Link>
              <button
                onClick={openCart}
                className="relative text-brand-gray-600 hover:text-brand-gold transition-colors"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-brand-gold text-white text-2xs flex items-center justify-center font-body">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-gray-100 bg-white animate-fade-in">
          <nav className="container-luxury py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block nav-link py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
