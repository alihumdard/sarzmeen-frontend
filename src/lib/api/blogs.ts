import type { BlogPost, BlogCategory, BlogTag } from "@/types/blog";
import { api } from "./client";

type BlogDetail = BlogPost & {
  content: string;
  tags: BlogTag[];
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

type BlogListParams = {
  category?: string;
  tag?: string;
  search?: string;
  per_page?: number;
  page?: number;
};

export async function listBlogs(
  params: BlogListParams = {},
): Promise<PaginatedResponse<BlogPost>> {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "") {
      qs.set(key, String(val));
    }
  }
  const query = qs.toString();
  return api<PaginatedResponse<BlogPost>>(
    `/blogs${query ? `?${query}` : ""}`,
  );
}

export async function getBlog(slug: string): Promise<BlogDetail> {
  const res = await api<{ data: BlogDetail }>(`/blogs/${slug}`);
  return res.data;
}

export async function listBlogCategories(): Promise<BlogCategory[]> {
  const res = await api<{ data: BlogCategory[] }>("/blog-categories");
  return res.data;
}

export async function listBlogTags(): Promise<BlogTag[]> {
  const res = await api<{ data: BlogTag[] }>("/blog-tags");
  return res.data;
}
