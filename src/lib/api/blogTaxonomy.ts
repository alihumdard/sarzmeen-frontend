import { api } from "./client";

export type BlogTaxonomyRecord = {
  id: string;
  slug: string;
  name: string;
  /** Posts currently using this category or tag. */
  count: number;
};

export type BlogTaxonomyInput = {
  name: string;
  slug: string;
};

/** Categories and tags share a shape, so one set of calls covers both. */
type Kind = "blog-categories" | "blog-tags";

async function list(kind: Kind): Promise<BlogTaxonomyRecord[]> {
  const res = await api<{ data: BlogTaxonomyRecord[] }>(`/admin/${kind}`);
  return res.data;
}

async function create(
  kind: Kind,
  input: BlogTaxonomyInput,
): Promise<BlogTaxonomyRecord> {
  const res = await api<{ data: BlogTaxonomyRecord }>(`/admin/${kind}`, {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });
  return res.data;
}

/*
 * Both models use the slug as their route key, so edits and deletes address
 * the record by slug rather than id.
 */
async function update(
  kind: Kind,
  slug: string,
  input: BlogTaxonomyInput,
): Promise<BlogTaxonomyRecord> {
  const res = await api<{ data: BlogTaxonomyRecord }>(
    `/admin/${kind}/${slug}`,
    { method: "PUT", body: input as unknown as Record<string, unknown> },
  );
  return res.data;
}

async function remove(kind: Kind, slug: string): Promise<void> {
  await api(`/admin/${kind}/${slug}`, { method: "DELETE" });
}

export const listBlogCategories = () => list("blog-categories");
export const createBlogCategory = (i: BlogTaxonomyInput) => create("blog-categories", i);
export const updateBlogCategory = (s: string, i: BlogTaxonomyInput) => update("blog-categories", s, i);
export const deleteBlogCategory = (s: string) => remove("blog-categories", s);

export const listBlogTags = () => list("blog-tags");
export const createBlogTag = (i: BlogTaxonomyInput) => create("blog-tags", i);
export const updateBlogTag = (s: string, i: BlogTaxonomyInput) => update("blog-tags", s, i);
export const deleteBlogTag = (s: string) => remove("blog-tags", s);
