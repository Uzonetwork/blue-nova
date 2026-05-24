import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export default defineType({
  name: "banner",
  title: "Homepage Banner",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
      description: 'e.g. "Shop the Collection"',
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "string",
      description: 'Relative URL, e.g. "/collections/handbags"',
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt Text" }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Only active banners are shown on the homepage",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first",
    }),
  ],

  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],

  preview: {
    select: { title: "title", isActive: "isActive", media: "image" },
    prepare({ title, isActive, media }) {
      return {
        title,
        subtitle: isActive ? "● Active" : "○ Inactive",
        media,
      };
    },
  },
});
