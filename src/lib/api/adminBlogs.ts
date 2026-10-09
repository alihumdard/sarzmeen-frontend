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

export type AdminBlogDetail = AdminBlog & {
  content: string;
  metaTitle: string;
  metaDescription: string;
  tags: { id: string; slug: string; name: string }[];
};

export type BlogInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  featured: boolean;
  category: string;
  tags: string[];
  readTime: number;
  metaTitle: string;
  metaDescription: string;
  imageFile?: File | null;
};

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export async function listAdminBlogs(params?: string): Promise<{ data: AdminBlog[]; meta: PaginationMeta }> {
  return api<{ data: AdminBlog[]; meta: PaginationMeta }>(`/admin/blogs${params ? `?${params}` : ""}`);
}

export async function getAdminBlog(id: string): Promise<AdminBlogDetail> {
  const res = await api<{ data: AdminBlogDetail }>(`/admin/blogs/${id}`);
  return res.data;
}

function buildFormData(input: BlogInput): FormData {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("slug", input.slug);
  fd.append("excerpt", input.excerpt);
  fd.append("content", input.content);
  fd.append("status", input.status);
  fd.append("featured", input.featured ? "1" : "0");
  fd.append("readTime", String(input.readTime));
  if (input.category) fd.append("category", input.category);
  if (input.metaTitle) fd.append("metaTitle", input.metaTitle);
  if (input.metaDescription) fd.append("metaDescription", input.metaDescription);
  input.tags.forEach((tag) => fd.append("tags[]", tag));
  if (input.imageFile) fd.append("imageFile", input.imageFile);
  return fd;
}

export async function createAdminBlog(input: BlogInput): Promise<AdminBlogDetail> {
  const res = await api<{ data: AdminBlogDetail }>("/admin/blogs", {
    method: "POST",
    body: buildFormData(input),
  });
  return res.data;
}

export async function updateAdminBlog(id: string, input: BlogInput): Promise<AdminBlogDetail> {
  const fd = buildFormData(input);
  fd.append("_method", "PUT");
  const res = await api<{ data: AdminBlogDetail }>(`/admin/blogs/${id}`, {
    method: "POST",
    body: fd,
  });
  return res.data;
}

export async function deleteAdminBlog(id: string): Promise<void> {
  await api(`/admin/blogs/${id}`, { method: "DELETE" });
}
