import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "details",  title: "Details",           default: true },
    { name: "media",    title: "Media"                             },
    { name: "variants", title: "Variants & Stock"                  },
    { name: "care",     title: "Care & Materials"                  },
  ],
  fields: [
    // ── Details ────────────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "details",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "name", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Handbags",    value: "handbags"    },
          { title: "Shoes",       value: "shoes"       },
          { title: "Clothes",     value: "clothes"     },
          { title: "Sunglasses",  value: "sunglasses"  },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "details",
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      group: "details",
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare At Price (USD)",
      type: "number",
      group: "details",
      description: "Original price before discount — shown as strikethrough",
      validation: (R) => R.min(0),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      group: "details",
      initialValue: false,
      description: "Show on homepage featured section",
    }),

    // ── Media ──────────────────────────────────────────────────────────────
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt Text" }),
          ],
        },
      ],
      validation: (R) => R.required().min(1),
    }),

    // ── Variants & Stock ───────────────────────────────────────────────────
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      group: "variants",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "colors",
      title: "Available Colors",
      type: "array",
      group: "variants",
      of: [
        {
          type: "object",
          preview: { select: { title: "name", subtitle: "hex" } },
          fields: [
            defineField({
              name: "name",
              type: "string",
              title: "Color Name",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "hex",
              type: "string",
              title: "Hex Code",
              description: "e.g. #1A1A2E",
              validation: (R) =>
                R.required().regex(/^#[0-9A-Fa-f]{6}$/, {
                  name: "hex",
                  invert: false,
                }),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      group: "variants",
      initialValue: 0,
      validation: (R) => R.required().min(0).integer(),
    }),

    // ── Care & Materials ───────────────────────────────────────────────────
    defineField({
      name: "materials",
      title: "Materials",
      type: "text",
      rows: 3,
      group: "care",
      description: "e.g. Full-grain leather, 18k gold-plated hardware",
    }),
    defineField({
      name: "careInstructions",
      title: "Care Instructions",
      type: "text",
      rows: 3,
      group: "care",
    }),
  ],

  orderings: [
    {
      title: "Price: Low → High",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price: High → Low",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Newest",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],

  preview: {
    select: { title: "name", subtitle: "category", media: "images.0" },
    prepare({ title, subtitle, media }) {
      const cat = (subtitle as string | undefined) ?? "";
      return {
        title,
        subtitle: cat.charAt(0).toUpperCase() + cat.slice(1),
        media,
      };
    },
  },
});
