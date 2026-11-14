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
export type OwnerVideo = {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnail: string;
};

export type VideoOwnerKind = "agent" | "agency";

export type OwnerVideoInput = {
  title: string;
  description?: string;
  youtubeUrl: string;
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

export async function deleteOwnerVideo(
  kind: VideoOwnerKind,
  id: string,
): Promise<void> {
  await api(`/${kind}/videos/${id}`, { method: "DELETE" });
}
