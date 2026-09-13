/**
 * Project shapes used by the public site. Mirrors the expected Laravel API
 * response so components do not change when mock data is swapped out.
 */

export type Project = {
  id: string;
  slug: string;
  name: string;
  /** City the project sits in, e.g. "Lahore". */
  city: string;
  /** Category line shown under the city, e.g. "Residential Project". */
  category: string;
  image: string;
};

export type City = {
  id: string;
  slug: string;
  name: string;
  /** Listing count as displayed, e.g. "12,500+ Properties". */
  propertyCount: string;
  image: string;
};
