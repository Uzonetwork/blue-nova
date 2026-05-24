import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient(config);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Safely resolve a Sanity image object to a URL string.
 *
 * Handles two shapes that appear in this project:
 *  1. Normal Sanity asset  → { asset: { _ref: "image-..." } }  — uses urlFor()
 *  2. _sanityAsset seed    → { _sanityAsset: "image@https://…" } — extracts raw URL
 *
 * Returns null when the image is absent or unrecognised.
 */
export function getImageUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any,
  width?: number,
  height?: number,
): string | null {
  if (!image) return null;

  if (image?.asset?._ref) {
    let b = builder.image(image);
    if (width)  b = b.width(width);
    if (height) b = b.height(height);
    return b.url();
  }

  if (typeof image._sanityAsset === "string") {
    // Strip the "image@" directive prefix to get the raw URL
    return image._sanityAsset.replace(/^image@/, "");
  }

  return null;
}
