import { api } from "./client";
import { cachedGet, clearTaxonomyCache } from "./taxonomyCache";
import type { DeveloperProfile } from "@/types/project";

export async function listDevelopers(): Promise<DeveloperProfile[]> {
  const res = await cachedGet<{ data: DeveloperProfile[] }>("/admin/developers");
  return res.data;
}

export async function createDeveloper(
  data: Record<string, unknown>,
): Promise<{ data: DeveloperProfile }> {
  clearTaxonomyCache("/admin/developers");
  return api<{ data: DeveloperProfile }>("/admin/developers", {
    method: "POST",
    body: data,
  });
}

export async function updateDeveloper(
  id: string,
  data: Record<string, unknown>,
): Promise<{ data: DeveloperProfile }> {
  clearTaxonomyCache("/admin/developers");
  return api<{ data: DeveloperProfile }>(`/admin/developers/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteDeveloper(id: string): Promise<void> {
  clearTaxonomyCache("/admin/developers");
  await api(`/admin/developers/${id}`, { method: "DELETE" });
}
