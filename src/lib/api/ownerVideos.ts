import { api } from "./client";

/**
 * An agent's or agency's own videos.
 *
 * These are shown on that profile and are deliberately kept out of the
 * public video library, which is a curated page rather than a feed.
 *
 * The two kinds use the same shape under different prefixes, so the
 * caller passes which one it is.
 */
export type OwnerVideoStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "archived";

export type OwnerVideo = {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnail: string;
  /** Where the video leads — the listing it walks through, say. */
  link: string | null;
  tags: string[];
  status: OwnerVideoStatus;
  statusLabel: string;
  /** Why an administrator turned it down, for its owner to act on. */
  reviewNote: string | null;
  categoryId: string | null;
  category?: { id: string; name: string; slug: string } | null;
};

export type VideoOwnerKind = "agent" | "agency";

export type OwnerVideoInput = {
  title: string;
  description?: string;
  youtubeUrl: string;
  link?: string;
  tags?: string[];
  categoryId?: string;
};

export type OwnerVideoCategory = {
  id: string;
  name: string;
  slug: string;
  videoCount: number;
};

export async function listOwnerVideos(
  kind: VideoOwnerKind,
): Promise<{ data: OwnerVideo[] }> {
  return api(`/${kind}/videos`);
}

export async function createOwnerVideo(
  kind: VideoOwnerKind,
  input: OwnerVideoInput,
): Promise<{ data: OwnerVideo }> {
  return api(`/${kind}/videos`, {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
}

export async function updateOwnerVideo(
  kind: VideoOwnerKind,
  id: string,
  input: OwnerVideoInput,
): Promise<{ data: OwnerVideo }> {
  return api(`/${kind}/videos/${id}`, {
    method: "PUT",
    body: input as unknown as Record<string, unknown>,
  });
}

export async function deleteOwnerVideo(
  kind: VideoOwnerKind,
  id: string,
): Promise<void> {
  await api(`/${kind}/videos/${id}`, { method: "DELETE" });
}

/* Categories: an owner's own groupings for their videos. */

export async function listOwnerVideoCategories(
  kind: VideoOwnerKind,
): Promise<{ data: OwnerVideoCategory[] }> {
  return api(`/${kind}/video-categories`);
}

export async function createOwnerVideoCategory(
  kind: VideoOwnerKind,
  name: string,
): Promise<{ data: OwnerVideoCategory }> {
  return api(`/${kind}/video-categories`, { method: "POST", body: { name } });
}

export async function renameOwnerVideoCategory(
  kind: VideoOwnerKind,
  id: string,
  name: string,
): Promise<{ data: OwnerVideoCategory }> {
  return api(`/${kind}/video-categories/${id}`, {
    method: "PUT",
    body: { name },
  });
}

export async function deleteOwnerVideoCategory(
  kind: VideoOwnerKind,
  id: string,
): Promise<void> {
  await api(`/${kind}/video-categories/${id}`, { method: "DELETE" });
}
