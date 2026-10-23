import { api } from "./client";
import type { Video, VideoInput } from "@/types/video";

type Paginated<T> = {
  data: T[];
  meta?: { total: number; current_page: number; last_page: number };
};

export async function listAdminVideos(params?: {
  status?: string;
  search?: string;
}): Promise<Video[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);

  const query = qs.toString();
  const res = await api<Paginated<Video>>(
    `/admin/videos${query ? `?${query}` : ""}`,
  );
  return res.data;
}

export async function getAdminVideo(id: string): Promise<Video> {
  const res = await api<{ data: Video }>(`/admin/videos/${id}`);
  return res.data;
}

export async function createVideo(input: VideoInput): Promise<Video> {
  const res = await api<{ data: Video }>("/admin/videos", {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function updateVideo(
  id: string,
  input: VideoInput,
): Promise<Video> {
  const res = await api<{ data: Video }>(`/admin/videos/${id}`, {
    method: "PUT",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function deleteVideo(id: string): Promise<void> {
  await api(`/admin/videos/${id}`, { method: "DELETE" });
}
