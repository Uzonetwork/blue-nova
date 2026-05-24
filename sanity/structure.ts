import type { StructureResolver } from "sanity/structure";
import {
  TagIcon,
  FolderIcon,
  ImageIcon,
  ArchiveIcon,
} from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Blue Nova")
    .items([
      S.listItem()
        .title("Products")
        .icon(TagIcon)
        .child(S.documentTypeList("product").title("All Products")),

      S.listItem()
        .title("Categories")
        .icon(FolderIcon)
        .child(S.documentTypeList("category").title("Categories")),

      S.divider(),

      S.listItem()
        .title("Homepage Banners")
        .icon(ImageIcon)
        .child(S.documentTypeList("banner").title("Banners")),

      S.divider(),

      S.listItem()
        .title("Collections")
        .icon(ArchiveIcon)
        .child(S.documentTypeList("collection").title("Collections")),
    ]);
