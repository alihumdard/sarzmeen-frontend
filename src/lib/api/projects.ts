import type { Project, ProjectDetail } from "@/types/project";
import { api } from "./client";

type ProjectListParams = {
  category?: string;
  city?: string;
  featured?: boolean;
  per_page?: number;
  page?: number;
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

export async function listProjects(
  params: ProjectListParams = {},
): Promise<PaginatedResponse<Project>> {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "" && val !== false) {
      qs.set(key, String(val));
    }
  }
  const query = qs.toString();
  return api<PaginatedResponse<Project>>(
    `/projects${query ? `?${query}` : ""}`,
  );
}

export async function getProject(slug: string): Promise<ProjectDetail> {
  const res = await api<{ data: ProjectDetail }>(`/projects/${slug}`);
  return res.data;
}
