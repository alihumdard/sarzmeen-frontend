/**
 * Blog shapes used by the public site. Mirrors the expected Laravel API
 * response so components do not change when mock data is swapped out.
 */

export type BlogAuthor = {
  id: string;
  name: string;
  /** Shown under the author name, e.g. "Real Estate Expert". */
  title: string;
  avatar: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  /** Category badge shown over the cover image, e.g. "Market News". */
  category: string;
  categorySlug: string;
  /** Short summary shown on listing cards. */
  excerpt: string;
  /** ISO date string; formatted for display by the card. */
  publishedAt: string;
  /** Estimated reading time in minutes. */
  readTime: number;
  image: string;
  author: BlogAuthor;
};

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  /** Number of published posts in this category. */
  count: number;
};

export type BlogTag = {
  id: string;
  slug: string;
  name: string;
};
