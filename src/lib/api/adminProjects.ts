import { api } from "./client";

export type AdminProject = {
  id: string;
  slug: string;
  name: string;
  city: string;
  category: string;
  image: string;
  status: string;
  developer: string;
  priceFrom: string;
  verified?: boolean;
  featured?: boolean;
};

type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export async function listAdminProjects(params?: string): Promise<{ data: AdminProject[]; meta: PaginationMeta }> {
  return api<{ data: AdminProject[]; meta: PaginationMeta }>(`/admin/projects${params ? `?${params}` : ""}`);
}

export async function deleteAdminProject(id: string): Promise<void> {
  await api(`/admin/projects/${id}`, { method: "DELETE" });
}
