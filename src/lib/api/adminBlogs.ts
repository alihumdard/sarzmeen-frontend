import { api } from "./client";

export type AdminBlog = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  excerpt: string;
  publishedAt: string | null;
  readTime: number;
  image: string;
  featured: boolean;
  status: string;
  author?: { id: string; name: string; title: string; avatar: string };
};

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export async function listAdminBlogs(params?: string): Promise<{ data: AdminBlog[]; meta: PaginationMeta }> {
  return api<{ data: AdminBlog[]; meta: PaginationMeta }>(`/admin/blogs${params ? `?${params}` : ""}`);
}

export async function deleteAdminBlog(id: string): Promise<void> {
  await api(`/admin/blogs/${id}`, { method: "DELETE" });
}
