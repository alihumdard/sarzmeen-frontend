import type { NearbyPlace } from "@/types/property";

/**
 * Project shapes used by the public site. Mirrors the expected Laravel API
 * response so components do not change when mock data is swapped out.
 *
 * A Project is a development (a housing scheme or phase) built by a
 * developer, distinct from an individual Property listing — a project
 * contains many properties, each of which can optionally reference it back
 * via Property.project.
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
  /** e.g. "Under Construction", "Ready to Move", "Launching Soon". */
  status: string;
  /** Company behind the development. */
  developer: string;
  /** Starting price as displayed, e.g. "Starting from PKR 45 Lac". */
  priceFrom: string;
  /** Shows a verified tick beside the project name. */
  verified?: boolean;
  /** Shown as a badge on the card/gallery, same as a property's Featured tag. */
  featured?: boolean;
};

/**
 * Everything the project detail page shows on top of the listing fields.
 * Kept separate so the card/listing components stay unaffected.
 */
export type ProjectDetail = Project & {
  /** Full location line, e.g. "Raiwind Road, Lahore, Punjab, Pakistan". */
  fullLocation: string;
  /** Gallery photos. The first is the opening slide. */
  images: string[];
  /** Short marketing summary shown near the top of Overview. */
  description: string;
  /** Full description, one entry per paragraph. */
  descriptionParagraphs: string[];
  /** Selling points listed with ticks under the description. */
  highlights: string[];
  /** Amenities grid, e.g. ["Parks", "Mosque", "Community Center"]. */
  amenities: string[];
  /** Payment plan rows, e.g. { label: "Down Payment", value: "20%" }. */
  paymentPlan: { label: string; value: string }[];
  /** Total land area of the development, e.g. "500 Kanal". */
  totalArea: string;
  /** Plot sizes on offer, e.g. ["5 Marla", "10 Marla", "1 Kanal"]. */
  plotSizes: string[];
  /** Landmarks shown under the location map. */
  nearbyPlaces: NearbyPlace[];
};

export type City = {
  id: string;
  slug: string;
  name: string;
  /** Listing count as displayed, e.g. "12,500+ Properties". */
  propertyCount: string;
  image: string;
};
