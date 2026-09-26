/**
 * Property type shapes.
 *
 * A property type sits inside a category: the category "Houses" holds the
 * types House, Flat and Upper Portion. Mirrors the Laravel API's expected
 * response so swapping the mock source for real requests does not require
 * touching the components.
 */

export type PropertyTypeStatus = "active" | "inactive";

export type PropertyTypeRecord = {
  id: string;
  name: string;
  /** URL-friendly identifier, e.g. "upper-portion". */
  slug: string;
  description: string;
  /** Slug of the category this type belongs to. */
  category: string;
  /** How many listings currently use this type. */
  propertyCount: number;
  status: PropertyTypeStatus;
  /** Shown first in type pickers when true. */
  featured: boolean;
  /** ISO date the record was created. */
  createdAt: string;
};

/** Fields the create/edit form submits — the server owns the rest. */
export type PropertyTypeInput = {
  name: string;
  slug: string;
  description: string;
  category: string;
  status: PropertyTypeStatus;
  featured: boolean;
};
