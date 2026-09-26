/**
 * Property category shapes.
 *
 * Mirrors the Laravel API's expected response so swapping the mock data
 * source for real requests does not require touching the components.
 */

export type CategoryStatus = "active" | "inactive";

export type Category = {
  id: string;
  name: string;
  /** URL-friendly identifier, e.g. "residential-plot". */
  slug: string;
  description: string;
  /** Slug of the parent category, or null for a top-level one. */
  parent: string | null;
  /** How many listings currently sit in this category. */
  propertyCount: number;
  status: CategoryStatus;
  /** Shown first in category pickers when true. */
  featured: boolean;
  /** ISO date the record was created. */
  createdAt: string;
};

/** Fields the create/edit form submits — the server owns the rest. */
export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  status: CategoryStatus;
  featured: boolean;
};
