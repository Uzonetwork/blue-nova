#!/usr/bin/env npx tsx
/**
 * Bulk-import products from a JSON file into Sanity.
 *
 * Prerequisites:
 *   1. Set SANITY_API_TOKEN (Editor access) in .env.local
 *   2. Prepare a JSON file following the shape in products-template.json
 *
 * Usage:
 *   npx tsx scripts/import-products.ts scripts/my-products.json
 *
 * Options:
 *   --dry-run   Validate the JSON and log what would be created, without writing to Sanity
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Load .env.local ───────────────────────────────────────────────────────────
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
  } catch { /* .env.local absent */ }
}
loadEnv();

// ── Sanity client ─────────────────────────────────────────────────────────────
const client = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token:      process.env.SANITY_API_TOKEN,
  useCdn:     false,
});

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProductInput {
  name:              string;
  category:          "handbags" | "shoes" | "clothes" | "sunglasses";
  price:             number;
  compareAtPrice?:   number;
  description?:      string;
  isFeatured?:       boolean;
  stock:             number;
  sizes?:            string[];
  colors?:           { name: string; hex: string }[];
  imageUrls:         string[];          // one or more image URLs
  materials?:        string;
  careInstructions?: string;
}

interface ImportFile {
  products: ProductInput[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function rkey() {
  return Math.random().toString(36).slice(2, 14);
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;
const VALID_CATEGORIES = ["handbags", "shoes", "clothes", "sunglasses"];

function validate(products: ProductInput[]): string[] {
  const errors: string[] = [];
  products.forEach((p, i) => {
    const prefix = `Product[${i}] "${p.name ?? "(unnamed)"}"`;
    if (!p.name?.trim())                          errors.push(`${prefix}: "name" is required`);
    if (!VALID_CATEGORIES.includes(p.category))  errors.push(`${prefix}: "category" must be one of ${VALID_CATEGORIES.join(", ")}`);
    if (typeof p.price !== "number" || p.price < 0) errors.push(`${prefix}: "price" must be a non-negative number`);
    if (typeof p.stock !== "number" || p.stock < 0) errors.push(`${prefix}: "stock" must be a non-negative integer`);
    if (!p.imageUrls?.length)                    errors.push(`${prefix}: "imageUrls" must contain at least one URL`);
    p.colors?.forEach((c, ci) => {
      if (!HEX_RE.test(c.hex)) errors.push(`${prefix}: colors[${ci}].hex "${c.hex}" must be a 6-digit hex (e.g. #1A2B3C)`);
    });
  });
  return errors;
}

async function uploadImageFromUrl(url: string, label: string): Promise<string> {
  process.stdout.write(`    ↑ ${url.slice(0, 60)}… `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const asset = await client.assets.upload("image", buffer, {
    filename: `${toSlug(label)}-${rkey()}.jpg`,
    contentType,
  });
  console.log(`✓`);
  return asset._id;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const filePath = args.find((a) => !a.startsWith("--"));

  if (!filePath) {
    console.error(
      "Usage: npx tsx scripts/import-products.ts <path-to-json> [--dry-run]\n" +
      "  Example: npx tsx scripts/import-products.ts scripts/my-products.json\n"
    );
    process.exit(1);
  }

  if (!dryRun && (!process.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN === "your_sanity_read_token")) {
    console.error(
      "\n✗  SANITY_API_TOKEN is not set.\n" +
      "   Create an Editor token at https://sanity.io/manage and add it to .env.local\n"
    );
    process.exit(1);
  }

  // Read and parse the JSON file
  let importData: ImportFile;
  try {
    const raw = readFileSync(resolve(filePath), "utf8");
    importData = JSON.parse(raw) as ImportFile;
  } catch (err) {
    console.error(`✗ Could not read "${filePath}":`, (err as Error).message);
    process.exit(1);
  }

  const products = importData.products;
  if (!Array.isArray(products) || products.length === 0) {
    console.error('✗ JSON file must have a top-level "products" array with at least one item.');
    process.exit(1);
  }

  // Validate
  console.log(`\nValidating ${products.length} product(s)…`);
  const errors = validate(products);
  if (errors.length > 0) {
    console.error("\n✗ Validation failed:\n" + errors.map((e) => `  • ${e}`).join("\n") + "\n");
    process.exit(1);
  }
  console.log("  ✓ All products valid\n");

  if (dryRun) {
    console.log("DRY RUN — nothing will be written to Sanity.\n");
    products.forEach((p, i) => {
      console.log(`  [${i + 1}] ${p.name} (${p.category}) — ₦${p.price.toLocaleString()}, stock: ${p.stock}, images: ${p.imageUrls.length}`);
    });
    console.log("\n✓ Dry run complete. Remove --dry-run to import.");
    return;
  }

  // Import
  console.log(`Importing ${products.length} product(s) into Sanity…\n`);
  let created = 0;
  let failed  = 0;

  for (const [i, product] of products.entries()) {
    console.log(`[${i + 1}/${products.length}] ${product.name}`);

    try {
      // Upload all images
      const imageAssets: { assetId: string; index: number }[] = [];
      for (const url of product.imageUrls) {
        const assetId = await uploadImageFromUrl(url, product.name);
        imageAssets.push({ assetId, index: imageAssets.length });
      }

      const doc = {
        _type:    "product",
        name:     product.name,
        slug:     { _type: "slug", current: toSlug(product.name) },
        category: product.category,
        price:    product.price,
        ...(product.compareAtPrice !== undefined && { compareAtPrice: product.compareAtPrice }),
        ...(product.description    !== undefined && { description: product.description }),
        isFeatured: product.isFeatured ?? false,
        stock:      product.stock,
        images: imageAssets.map(({ assetId }) => ({
          _type: "image",
          _key:  rkey(),
          asset: { _type: "reference", _ref: assetId },
          alt:   product.name,
        })),
        ...(product.sizes?.length  && { sizes: product.sizes }),
        ...(product.colors?.length && {
          colors: product.colors.map((c) => ({ _type: "object", _key: rkey(), ...c })),
        }),
        ...(product.materials        && { materials:        product.materials }),
        ...(product.careInstructions && { careInstructions: product.careInstructions }),
      };

      const result = await client.create(doc);
      console.log(`  ✓ Created (${result._id})\n`);
      created++;
    } catch (err) {
      console.error(`  ✗ Failed: ${(err as Error).message}\n`);
      failed++;
    }
  }

  console.log(`\n── Import complete ──────────────────`);
  console.log(`  Created : ${created}`);
  if (failed) console.log(`  Failed  : ${failed}`);
  console.log(`  Total   : ${products.length}`);
}

main().catch((err) => {
  console.error("\n✗ Unexpected error:", err.message);
  process.exit(1);
});
