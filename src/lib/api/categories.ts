import type { Category, CategoryInput } from "@/types/category";
import { api } from "./client";

export async function listCategories(): Promise<Category[]> {
  const res = await api<{ data: Category[] }>("/categories");
  return res.data;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const res = await api<{ data: Category }>("/admin/categories", {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<Category> {
  const res = await api<{ data: Category }>(`/admin/categories/${id}`, {
    method: "PUT",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api(`/admin/categories/${id}`, { method: "DELETE" });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
