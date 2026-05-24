"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600",
    subtitle: "Luxury Handbags",
    title: "New Collection",
    text: "Crafted for the woman who commands attention",
  },
  {
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600",
    subtitle: "Designer Footwear",
    title: "Step Into Luxury",
    text: "Every step tells a story",
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600",
    subtitle: "Premium Fashion",
    title: "The New Edit",
    text: "Wear your confidence",
  },
  {
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1600",
    subtitle: "Luxury Eyewear",
    title: "See The World Differently",
    text: "Bold. Elegant. Timeless.",
  },
] as const;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Reset auto-advance timer whenever the active slide changes
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [current]);

  function goTo(index: number) {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* ── Slide images (all mounted; opacity controls active) ──────────── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.subtitle}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* ── Brand blue overlay ───────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-brand-blue/50 z-10" />

      {/* ── Slide text (key forces remount → re-triggers animate-fade-up) ── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div key={current} className="text-center text-white px-4 animate-fade-up">
          <p className="font-body text-2xs tracking-ultra-wide uppercase text-brand-gold mb-5">
            {SLIDES[current].subtitle}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-normal leading-none mb-6">
            {SLIDES[current].title}
          </h1>
          <p className="font-body text-sm tracking-widest text-white/75 mb-12 max-w-sm mx-auto">
            {SLIDES[current].text}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-gold">
              Shop Collection
            </Link>
            <Link
              href="/shop"
              className="btn-secondary border-white text-white hover:bg-white hover:text-brand-blue"
            >
              Explore All
            </Link>
          </div>
        </div>
      </div>

      {/* ── Left arrow ───────────────────────────────────────────────────── */}
      <button
        onClick={() => goTo(current - 1)}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center border border-white/40 text-white hover:bg-white/20 hover:border-white/70 transition-colors duration-200"
      >
        <ChevronLeft size={20} />
      </button>

      {/* ── Right arrow ──────────────────────────────────────────────────── */}
      <button
        onClick={() => goTo(current + 1)}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center border border-white/40 text-white hover:bg-white/20 hover:border-white/70 transition-colors duration-200"
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Navigation dots ──────────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-400 ${
              i === current
                ? "w-8 h-[3px] bg-brand-gold"
                : "w-[6px] h-[6px] bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
