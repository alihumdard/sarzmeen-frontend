import { api } from "./client";
import type {
  MapCity,
  PopularMapGroup,
  SocietyMap,
  SocietyMapInput,
} from "@/types/societyMap";

type Paginated<T> = {
  data: T[];
  meta?: { total: number; current_page: number; last_page: number };
};

/* ---------------------------------------------------------------- public */

export async function listMapCities(): Promise<MapCity[]> {
  const res = await api<{ data: MapCity[] }>("/society-maps/cities");
  return res.data;
}

export async function listSocietyMaps(params?: {
  city?: string;
  search?: string;
}): Promise<SocietyMap[]> {
  const qs = new URLSearchParams();
  if (params?.city) qs.set("city", params.city);
  if (params?.search) qs.set("search", params.search);

  const query = qs.toString();
  const res = await api<Paginated<SocietyMap>>(
    `/society-maps${query ? `?${query}` : ""}`,
  );
  return res.data;
}

export async function listPopularMaps(): Promise<PopularMapGroup[]> {
  const res = await api<{ data: PopularMapGroup[] }>("/society-maps/popular");
  return res.data;
}

/**
 * Tell the server a map was downloaded, and get the file's address.
 *
 * The browser could reach the file on its own, but then nobody would
 * know a map had ever been downloaded.
 */
export async function recordMapDownload(
  slug: string,
): Promise<{ url: string; filename: string }> {
  return api<{ url: string; filename: string }>(
    `/society-maps/${slug}/download`,
    { method: "POST" },
  );
}

/* ----------------------------------------------------------------- admin */

export type AdminMapInput = SocietyMapInput & {
  imageFile?: File | null;
  documentFile?: File | null;
  removeDocument?: boolean;
};

export async function listAdminSocietyMaps(params?: {
  status?: string;
  city?: string;
  search?: string;
}): Promise<SocietyMap[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.city) qs.set("city", params.city);
  if (params?.search) qs.set("search", params.search);

  const query = qs.toString();
  const res = await api<Paginated<SocietyMap>>(
    `/admin/society-maps${query ? `?${query}` : ""}`,
  );
  return res.data;
}

export async function getAdminSocietyMap(id: string): Promise<SocietyMap> {
  const res = await api<{ data: SocietyMap }>(`/admin/society-maps/${id}`);
  return res.data;
}

function buildFormData(input: AdminMapInput): FormData {
  const fd = new FormData();

  fd.append("title", input.title);
  fd.append("locationId", String(input.locationId));
  fd.append("status", input.status);
  fd.append("featured", input.featured ? "1" : "0");
  fd.append("sortOrder", String(input.sortOrder ?? 0));

  if (input.summary) fd.append("summary", input.summary);
  if (input.description) fd.append("description", input.description);
  if (input.metaTitle) fd.append("metaTitle", input.metaTitle);
  if (input.metaDescription)
    fd.append("metaDescription", input.metaDescription);

  /* Sent even when empty, so clearing every blog is a change the server
     can see rather than a field it skips. */
  (input.blogIds ?? []).forEach((id) => fd.append("blogIds[]", String(id)));

  if (input.imageFile) fd.append("imageFile", input.imageFile);
  if (input.documentFile) fd.append("documentFile", input.documentFile);
  if (input.removeDocument) fd.append("removeDocument", "1");

  return fd;
}

export async function createSocietyMap(
  input: AdminMapInput,
): Promise<SocietyMap> {
  const res = await api<{ data: SocietyMap }>("/admin/society-maps", {
    method: "POST",
    body: buildFormData(input),
  });
  return res.data;
}

export async function updateSocietyMap(
  id: string,
  input: AdminMapInput,
): Promise<SocietyMap> {
  const fd = buildFormData(input);
  /* A PUT cannot carry a file upload through PHP, so it travels as a
     POST that says what it meant. */
  fd.append("_method", "PUT");

  const res = await api<{ data: SocietyMap }>(`/admin/society-maps/${id}`, {
    method: "POST",
    body: fd,
  });
  return res.data;
}

export async function deleteSocietyMap(id: string): Promise<void> {
  await api(`/admin/society-maps/${id}`, { method: "DELETE" });
}
