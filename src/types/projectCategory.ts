/**
 * Project category shapes.
 *
 * Projects are developments (societies, towers, housing schemes) rather than
 * individual listings, so they carry their own set of categories. Mirrors the
 * Laravel API's expected response so swapping the mock source for real
 * requests does not require touching the components.
 */

export type ProjectCategoryStatus = "active" | "inactive";

export type ProjectCategory = {
  id: string;
  name: string;
  /** URL-friendly identifier, e.g. "housing-society". */
  slug: string;
  description: string;
  /** How many projects currently sit in this category. */
  projectCount: number;
  status: ProjectCategoryStatus;
  /** Shown first in project filters when true. */
  featured: boolean;
  /** ISO date the record was created. */
  createdAt: string;
};

/** Fields the create/edit form submits — the server owns the rest. */
export type ProjectCategoryInput = {
  name: string;
  slug: string;
  description: string;
  status: ProjectCategoryStatus;
  featured: boolean;
};
