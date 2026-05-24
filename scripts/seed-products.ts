#!/usr/bin/env npx tsx
/**
 * Seed 6 sample products into Sanity.
 *
 * Prerequisites:
 *   1. In sanity.io/manage → API → Tokens, create a token with Editor access.
 *   2. Set SANITY_API_TOKEN=<that-token> in .env.local
 *
 * Run:
 *   npx tsx scripts/seed-products.ts
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

// ── Load .env.local without requiring the dotenv package ─────────────────────
function loadEnv() {
  try {
    const lines = readFileSync(".env.local", "utf8").split("\n");
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const k = line.slice(0, eq).trim();
      const v = line.slice(eq + 1).replace(/^["']|["']$/g, "").trim();
      if (!process.env[k]) process.env[k] = v;
    }
  } catch { /* .env.local absent — rely on real env vars */ }
}
loadEnv();

// ── Sanity write client ───────────────────────────────────────────────────────
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  apiVersion: "2024-01-01",
  token:      process.env.SANITY_API_TOKEN,
  useCdn:     false,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Short random key for Sanity array items */
function rkey() {
  return Math.random().toString(36).slice(2, 14);
}

/** Slugify a product name */
function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Product catalogue ─────────────────────────────────────────────────────────
interface ProductSeed {
  name:              string;
  category:          "handbags" | "shoes" | "clothes" | "sunglasses";
  price:             number;
  compareAtPrice?:   number;
  description:       string;
  isFeatured:        boolean;
  stock:             number;
  sizes?:            string[];
  colors?:           { name: string; hex: string }[];
  imageUrl:          string;
  materials?:        string;
  careInstructions?: string;
}

const PRODUCTS: ProductSeed[] = [
  // ── Handbags ─────────────────────────────────────────────────────────────
  {
    name:           "The Lagos Structured Tote",
    category:       "handbags",
    price:          85000,
    compareAtPrice: 110000,
    description:
      "A masterwork in Italian full-grain leather. The Lagos Structured Tote is built for the woman who commands every room she enters. Reinforced base, polished antique brass hardware, and an interior that organises your world without apology.",
    isFeatured: true,
    stock:      8,
    colors: [
      { name: "Cognac",         hex: "#8B5E3C" },
      { name: "Midnight Black", hex: "#1A1A1A" },
    ],
    imageUrl:          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    materials:         "Full-grain Italian leather, antique brass hardware, suede interior lining",
    careInstructions:  "Wipe clean with a dry, lint-free cloth. Condition monthly with a quality leather balm. Store in the dust bag provided when not in use.",
  },
  {
    name:      "The Abuja Mini Clutch",
    category:  "handbags",
    price:     42000,
    description:
      "Understated elegance in the palm of your hand. The Abuja Mini Clutch transitions effortlessly from boardroom to banquet — satin interior, magnetic closure, detachable chain strap.",
    isFeatured: false,
    stock:      12,
    colors: [
      { name: "Ivory",  hex: "#F5F0E8" },
      { name: "Blush",  hex: "#E8A89C" },
    ],
    imageUrl:         "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    materials:        "Saffiano leather, gold-plated chain, satin lining",
    careInstructions: "Avoid prolonged exposure to moisture. Clean with a slightly damp cloth.",
  },
  {
    name:           "The Victoria Island Shopper",
    category:       "handbags",
    price:          120000,
    compareAtPrice: 145000,
    description:
      "Effortless capacity, uncompromising elegance. The Victoria Island Shopper is crafted in vegetable-tanned leather that develops a rich patina with age — a piece you will carry for decades.",
    isFeatured: false,
    stock:      5,
    colors: [
      { name: "Tan",   hex: "#C4956A" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    imageUrl:         "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    materials:        "Vegetable-tanned leather, solid brass hardware, cotton canvas lining",
    careInstructions: "Allow the leather to patina naturally. Clean with a dry cloth and condition every 3 months.",
  },

  // ── Shoes ────────────────────────────────────────────────────────────────
  {
    name:           "The Executive Heel",
    category:       "shoes",
    price:          65000,
    compareAtPrice: 80000,
    description:
      "Power dressing starts from the ground up. The Executive Heel features a sculpted 8cm block heel, cushioned insole, and patent leather finish that holds its mirror shine through the longest days.",
    isFeatured: true,
    stock:      15,
    sizes:      ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Nude",  hex: "#C8A882" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    imageUrl:         "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
    materials:        "Patent leather upper, leather insole, rubber outsole",
    careInstructions: "Wipe with a soft, dry cloth after each wear. Use patent leather cleaner for scuffs.",
  },

  // ── Clothes ──────────────────────────────────────────────────────────────
  {
    name:      "The Ankara Wrap Dress",
    category:  "clothes",
    price:     55000,
    description:
      "A celebration of African textile heritage elevated to luxury ready-to-wear. Crafted in 100% pure cotton Ankara fabric, this fluid wrap dress flatters every silhouette. The deep-V neckline and adjustable tie waist create a shape that is both bold and feminine.",
    isFeatured: false,
    stock:      20,
    sizes:      ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Coral & Gold", hex: "#E8735A" },
      { name: "Navy & White", hex: "#1B3A6B" },
    ],
    imageUrl:         "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    materials:        "100% pure cotton Ankara fabric, fully lined in white satin",
    careInstructions: "Hand wash in cold water or dry clean only. Iron on reverse at medium heat.",
  },

  // ── Sunglasses ───────────────────────────────────────────────────────────
  {
    name:      "The Porto-Novo Cat Eye",
    category:  "sunglasses",
    price:     28000,
    description:
      "Inspired by the breezy sophistication of the Beninese coast, the Porto-Novo Cat Eye frames your gaze with authority. UV400 polarised lenses, hand-polished acetate frames, and a silhouette designed to be noticed.",
    isFeatured: false,
    stock:      25,
    colors: [
      { name: "Tortoiseshell", hex: "#8B5E3C" },
      { name: "Jet Black",     hex: "#1A1A1A" },
    ],
    imageUrl:         "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    materials:        "Hand-polished acetate frame, UV400 polarised CR-39 lenses, stainless steel hinges",
    careInstructions: "Clean lenses with the microfibre cloth provided. Store in the hard case when not worn.",
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  if (!process.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN === "your_sanity_read_token") {
    console.error(
      "\n✗  SANITY_API_TOKEN is not set.\n" +
      "   1. Go to https://sanity.io/manage → your project → API → Tokens\n" +
      "   2. Create a token with Editor access\n" +
      "   3. Add SANITY_API_TOKEN=<token> to .env.local\n"
    );
    process.exit(1);
  }

  console.log(`\nSeeding ${PRODUCTS.length} products into Sanity…\n`);

  for (const product of PRODUCTS) {
    console.log(`→ ${product.name}`);

    const doc = {
      _type:    "product",
      name:     product.name,
      slug:     { _type: "slug", current: toSlug(product.name) },
      category: product.category,
      price:    product.price,
      ...(product.compareAtPrice !== undefined && { compareAtPrice: product.compareAtPrice }),
      description: product.description,
      isFeatured:  product.isFeatured,
      stock:       product.stock,
      images: [
        {
          _type:        "image",
          _key:         rkey(),
          _sanityAsset: `image@${product.imageUrl}`,
          alt:          product.name,
        },
      ],
      ...(product.sizes?.length   && { sizes:  product.sizes }),
      ...(product.colors?.length  && {
        colors: product.colors.map((c) => ({ _type: "object", _key: rkey(), ...c })),
      }),
      ...(product.materials        && { materials:        product.materials }),
      ...(product.careInstructions && { careInstructions: product.careInstructions }),
    };

    const result = await client.create(doc);
    console.log(`  ✓ Created (${result._id})\n`);
  }

  console.log("✓ Seeding complete. Open /studio to review your products.");
}

seed().catch((err) => {
  console.error("\n✗ Seeding failed:", err.message);
  process.exit(1);
});
