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
