import { groq } from "next-sanity";

// ── Shared projection fragments ───────────────────────────────────────────────

const PRODUCT_CARD_FIELDS = groq`
  _id,
  name,
  "slug": slug.current,
  category,
  price,
  compareAtPrice,
  stock,
  isFeatured,
  "images": images[]{
    _key,
    _type,
    asset,
    alt,
    hotspot,
    crop,
    _sanityAsset
  }
`;

const PRODUCT_FULL_FIELDS = groq`
  ${PRODUCT_CARD_FIELDS},
  description,
  sizes,
  "colors": colors[]{ name, hex },
  materials,
  careInstructions
`;

// ── Product queries ───────────────────────────────────────────────────────────

export const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && isFeatured == true] | order(_createdAt desc)[0...8] {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const productsByCategoryQuery = groq`
  *[_type == "product" && category == $category] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_FULL_FIELDS}
  }
`;

export const inStockProductsQuery = groq`
  *[_type == "product" && stock > 0] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

// ── Category queries ──────────────────────────────────────────────────────────

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": image{ asset, alt, hotspot, crop }
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": image{ asset, alt, hotspot, crop }
  }
`;

// ── Homepage banner queries ───────────────────────────────────────────────────

export const activeBannersQuery = groq`
  *[_type == "banner" && isActive == true] | order(order asc) {
    _id,
    title,
    subtitle,
    ctaText,
    ctaLink,
    "image": image{ asset, alt, hotspot, crop }
  }
`;

// ── Search query ─────────────────────────────────────────────────────────────

export const searchProductsQuery = groq`
  *[_type == "product" && (
    name match $query + "*" ||
    category match $query + "*"
  )] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

// ── Collection queries ────────────────────────────────────────────────────────

export const collectionsQuery = groq`
  *[_type == "collection"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "image": image{ asset, alt, hotspot, crop },
    season
  }
`;
