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
  /** Residential / Commercial / Mixed Use — what the project contains. */
  projectType?: string;
  projectTypeLabel?: string;
  /** High-Rise / Mall / Villas … — how it is built. Independent of type. */
  projectFormat?: string;
  projectFormatLabel?: string;
  paymentType?: string;
  paymentTypeLabel?: string;
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
  /** Raw ids, sent so the admin edit form can preselect its dropdowns. */
  categoryId?: string;
  locationId?: string;
  towersCount?: number | null;
  totalFloors?: number | null;
  basementFloors?: number | null;
  parkingSpaces?: number | null;
  expectedCompletion?: string | null;
  possessionTimeline?: string | null;
  totalUnits?: number | null;
  metaTitle?: string;
  metaDescription?: string;
  /** Unit types on offer, each priced from its own area and rate. */
  units?: ProjectUnit[];
  /** Percentage split applied to every unit's total price. */
  paymentTerms?: ProjectPaymentTerms | null;
  developerId?: string | null;
  developerProfile?: DeveloperProfile | null;
  faqs?: ProjectFaq[];
  documents?: ProjectDocument[];
  floorPlans?: ProjectFloorPlan[];
};

export type InventoryCategory = "residential" | "commercial" | "hospitality" | "other";

export type UnitAvailability = "available" | "limited" | "sold_out" | "coming_soon";

export type ProjectUnit = {
  id: string;
  unitType: string;
  unitName?: string | null;
  category: InventoryCategory;
  categoryLabel?: string;
  area: number;
  minArea?: number | null;
  maxArea?: number | null;
  areaUnit?: string;
  ratePerSqft: number;
  startingPrice?: number | null;
  maxPrice?: number | null;
  availability?: UnitAvailability;
  availabilityLabel?: string;
  /** Category-specific attributes; shape differs per inventory category. */
  details?: Record<string, string | number | boolean>;
  /** area x ratePerSqft, computed server-side so it cannot drift. */
  totalPrice: number;
};

export type DeveloperProfile = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  verified: boolean;
  projectsCount?: number;
};

export type ProjectFaq = {
  id: string;
  question: string;
  answer: string;
};

export type ProjectDocument = {
  id: string;
  title: string;
  type: string;
  url: string;
  isPublic: boolean;
};

export type ProjectFloorPlan = {
  id: string;
  name: string;
  floorNumber: string | null;
  tower: string | null;
  image: string | null;
  pdf: string | null;
  description: string;
};

export type ProjectPaymentTerms = {
  pctBooking?: number;
  pctConfirmation?: number;
  pctMonthly?: number;
  pctBalloon?: number;
  pctGrey?: number;
  pctPossession?: number;
  monthlyCount?: number;
  balloonCount?: number;
  balloonFrequency?: number;
  planDurationYears?: number;
};

export type City = {
  id: string;
  slug: string;
  name: string;
  /** Listing count as displayed, e.g. "12,500+ Properties". */
  propertyCount: string;
  image: string;
};
