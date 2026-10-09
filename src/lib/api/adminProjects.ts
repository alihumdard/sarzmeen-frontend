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

export async function createAdminProject(data: Record<string, unknown>): Promise<{ data: AdminProject }> {
  return api<{ data: AdminProject }>("/admin/projects", {
    method: "POST",
    body: data,
  });
}

export async function updateAdminProject(id: string, data: Record<string, unknown>): Promise<{ data: AdminProject }> {
  return api<{ data: AdminProject }>(`/admin/projects/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function uploadProjectImages(id: string, files: File[]): Promise<void> {
  const formData = new FormData();
  files.forEach((f) => formData.append("images[]", f));
  await api(`/admin/projects/${id}`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteAdminProject(id: string): Promise<void> {
  await api(`/admin/projects/${id}`, { method: "DELETE" });
}
