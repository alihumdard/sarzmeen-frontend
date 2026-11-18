/**
 * The site's own guides are only ever draft or published; an owner's
 * video also waits for review, and may be turned down.
 */
export type VideoStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "archived";

export type Video = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** The 11-character YouTube id, parsed from whatever link was pasted. */
  youtubeId: string;
  youtubeUrl: string;
  /** Ready-made embed URL for the player iframe. */
  embedUrl: string;
  /** Uploaded still, or YouTube's own when none was provided. */
  thumbnail: string;
  status: VideoStatus;
  featured: boolean;
  views: number;
  sortOrder: number;
  /**
   * The agent or agency that posted it, absent for the site's own.
   *
   * Their videos appear on Sarzameen X Tube alongside the site's own,
   * once approved; this is what tells them apart and leads to the rest
   * of that owner's.
   */
  owner?: {
    kind: "agent" | "agency";
    name: string;
    slug: string | null;
    /** Their page, where the rest of their videos are. */
    href?: string | null;
  } | null;
  tags?: string[];
  category?: { id: string; name: string; slug: string } | null;
  categoryId?: string | null;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
};

export type VideoInput = {
  title: string;
  slug: string;
  description?: string;
  youtubeUrl: string;
  status: VideoStatus;
  featured?: boolean;
  categoryId?: string;
  /** Written to be found by and shown to nobody. */
  tags?: string[];
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
};

/**
 * The library's categories, grouped by whoever made them.
 *
 * The site's own come first; an agency's follow under its name.
 */
export type VideoCategoryGroup = {
  key: string;
  label: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    videoCount: number;
  }[];
};
