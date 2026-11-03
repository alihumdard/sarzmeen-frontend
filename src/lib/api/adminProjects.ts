import { api } from "./client";
import type { ProjectDetail, ProjectDocument } from "@/types/project";

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

export async function getAdminProject(id: string): Promise<{ data: ProjectDetail }> {
  return api<{ data: ProjectDetail }>(`/admin/projects/${id}`);
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

/** Removes one stored image. The project keeps a cover: the API picks the next. */
export async function deleteProjectImage(
  projectId: string,
  imageId: string,
): Promise<void> {
  await api(`/admin/projects/${projectId}/images/${imageId}`, {
    method: "DELETE",
  });
}

export async function setProjectImageCover(
  projectId: string,
  imageId: string,
): Promise<void> {
  await api(`/admin/projects/${projectId}/images/${imageId}/cover`, {
    method: "PATCH",
  });
}

/** The kinds a project document can be filed under. */
export const DOCUMENT_TYPES = [
  { value: "brochure", label: "Brochure" },
  { value: "floor_plan", label: "Floor Plan" },
  { value: "payment_plan", label: "Payment Plan" },
  { value: "noc", label: "NOC / Approval" },
  { value: "legal", label: "Legal" },
  { value: "other", label: "Other" },
] as const;

/**
 * Uploads one named document. Unlike images these go up on their own,
 * because each needs a title and a kind that the project form cannot carry.
 */
export async function uploadProjectDocument(
  projectId: string,
  input: { title: string; type: string; isPublic: boolean; file: File },
): Promise<{ data: ProjectDocument }> {
  const body = new FormData();
  body.append("title", input.title);
  body.append("type", input.type);
  // FormData has no booleans; the API reads these two as true/false.
  body.append("isPublic", input.isPublic ? "1" : "0");
  body.append("file", input.file);

  return api(`/admin/projects/${projectId}/documents`, {
    method: "POST",
    body,
  });
}

export async function deleteProjectDocument(
  projectId: string,
  documentId: string,
): Promise<void> {
  await api(`/admin/projects/${projectId}/documents/${documentId}`, {
    method: "DELETE",
  });
}
