import { defineType, defineField } from "sanity";

export default defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "image", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "season", title: "Season", type: "string" }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: {
    select: { title: "title", subtitle: "season", media: "image" },
  },
});
