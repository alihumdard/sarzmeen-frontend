import type {
  ProjectCategory,
  ProjectCategoryInput,
} from "@/types/projectCategory";
import { api } from "./client";

export async function listProjectCategories(): Promise<ProjectCategory[]> {
  const res = await api<{ data: ProjectCategory[] }>("/project-categories");
  return res.data;
}

export async function createProjectCategory(
  input: ProjectCategoryInput,
): Promise<ProjectCategory> {
  const res = await api<{ data: ProjectCategory }>(
    "/admin/project-categories",
    {
      method: "POST",
      body: input as unknown as Record<string, unknown>,
    },
  );
  return res.data;
}

export async function updateProjectCategory(
  id: string,
  input: ProjectCategoryInput,
): Promise<ProjectCategory> {
  const res = await api<{ data: ProjectCategory }>(
    `/admin/project-categories/${id}`,
    {
      method: "PUT",
      body: input as unknown as Record<string, unknown>,
    },
  );
  return res.data;
}

export async function deleteProjectCategory(id: string): Promise<void> {
  await api(`/admin/project-categories/${id}`, { method: "DELETE" });
}
