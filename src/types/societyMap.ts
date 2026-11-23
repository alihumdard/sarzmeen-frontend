import type { BlogPost } from "@/types/blog";

/** A city that has at least one published map. */
export type MapCity = {
  id: string;
  name: string;
  slug: string;
  mapCount: number;
};

export type SocietyMap = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** The map itself, at the size it was uploaded, for zooming into. */
  image: string;
  /** What the download button hands over: the PDF, or the image. */
  download: string;
  hasDocument: boolean;
  society?: { id: string; name: string; slug: string } | null;
  city?: { id: string; name: string; slug: string } | null;
  featured: boolean;
  views: number;
  downloads: number;
  publishedAt: string | null;
  /** Only the single-map page carries the write-up. */
  description?: string;
  blogs?: BlogPost[];
  metaTitle: string | null;
  metaDescription: string | null;
};

export type SocietyMapInput = {
  title: string;
  locationId: number;
  summary?: string;
  description?: string;
  status: "draft" | "published" | "archived";
  featured?: boolean;
  sortOrder?: number;
  blogIds?: number[];
  metaTitle?: string;
  metaDescription?: string;
};
