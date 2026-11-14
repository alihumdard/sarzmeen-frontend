export type VideoStatus = "draft" | "published";

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
   * Their videos stay off the public guides page; this is what tells
   * them apart in the admin list.
   */
  owner?: {
    kind: "agent" | "agency";
    name: string;
    slug: string | null;
  } | null;
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
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
};
