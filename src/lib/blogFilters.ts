export type BlogFilters = {
  q?: string;
  category?: string;
  tag?: string;
  sort?: string;
  page?: number;
};

/** Builds a /blog URL, dropping empty values and defaults so links stay clean. */
export function blogUrl(filters: BlogFilters): string {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.sort && filters.sort !== "latest") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}
