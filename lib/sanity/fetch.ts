import { sanityClient } from "./client";
import {
  allProductsQuery,
  featuredProductsQuery,
  productsByCategoryQuery,
  productBySlugQuery,
  inStockProductsQuery,
  allCategoriesQuery,
  categoryBySlugQuery,
  activeBannersQuery,
  collectionsQuery,
  searchProductsQuery,
} from "./queries";
import type { Product, ProductCategory, Collection } from "@/types";

// ── Product fetchers ──────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const products: Product[] = await sanityClient.fetch(allProductsQuery);
  const seen = new Set<string>();
  return products.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products: Product[] = await sanityClient.fetch(featuredProductsQuery);
  const seen = new Set<string>();
  return products
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .slice(0, 4);
}

export async function getProductsByCategory(
  category: ProductCategory
): Promise<Product[]> {
  return sanityClient.fetch(productsByCategoryQuery, { category });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return sanityClient.fetch(productBySlugQuery, { slug });
}

export async function getInStockProducts(): Promise<Product[]> {
  return sanityClient.fetch(inStockProductsQuery);
}

// ── Category fetchers ─────────────────────────────────────────────────────────

export async function getAllCategories() {
  return sanityClient.fetch(allCategoriesQuery);
}

export async function getCategoryBySlug(slug: string) {
  return sanityClient.fetch(categoryBySlugQuery, { slug });
}

// ── Banner fetchers ───────────────────────────────────────────────────────────

export async function getActiveBanners() {
  return sanityClient.fetch(activeBannersQuery);
}

// ── Search fetchers ───────────────────────────────────────────────────────────

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return sanityClient.fetch(searchProductsQuery, { query: query.trim() } as any);
}

// ── Collection fetchers ───────────────────────────────────────────────────────

export async function getCollections(): Promise<Collection[]> {
  return sanityClient.fetch(collectionsQuery);
}
