import type {
  PropertyTypeInput,
  PropertyTypeRecord,
} from "@/types/propertyType";

/**
 * Property type API.
 *
 * This is the only file that knows where property types come from. Each
 * function is async and returns what the Laravel endpoint is expected to
 * return, so wiring the real backend means replacing the body of each
 * function with a `fetch` — the page and modal calling them do not change.
 *
 *   listPropertyTypes()        GET    /api/property-types
 *   createPropertyType(input)  POST   /api/property-types
 *   updatePropertyType(id, …)  PUT    /api/property-types/{id}
 *   deletePropertyType(id)     DELETE /api/property-types/{id}
 *
 * Until then an in-memory array stands in for the database, so adds, edits
 * and deletes behave like the real thing for the rest of the session.
 */

const seed: PropertyTypeRecord[] = [
  {
    id: "pt-1",
    name: "House",
    slug: "house",
    description: "Independent houses on their own plot.",
    category: "houses",
    propertyCount: 3180,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "pt-2",
    name: "Upper Portion",
    slug: "upper-portion",
    description: "Upper floor let or sold separately.",
    category: "houses",
    propertyCount: 684,
    status: "active",
    featured: false,
    createdAt: "2025-02-03",
  },
  {
    id: "pt-3",
    name: "Lower Portion",
    slug: "lower-portion",
    description: "Ground floor let or sold separately.",
    category: "houses",
    propertyCount: 512,
    status: "active",
    featured: false,
    createdAt: "2025-02-03",
  },
  {
    id: "pt-4",
    name: "Farm House",
    slug: "farm-house",
    description: "Country houses on large plots.",
    category: "houses",
    propertyCount: 168,
    status: "active",
    featured: false,
    createdAt: "2025-02-14",
  },
  {
    id: "pt-5",
    name: "Flat",
    slug: "flat",
    description: "Apartments and flats in residential buildings.",
    category: "flats-apartments",
    propertyCount: 1240,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "pt-6",
    name: "Penthouse",
    slug: "penthouse",
    description: "Top-floor apartments with private terraces.",
    category: "flats-apartments",
    propertyCount: 96,
    status: "active",
    featured: false,
    createdAt: "2025-03-11",
  },
  {
    id: "pt-7",
    name: "Room",
    slug: "room",
    description: "Single rooms, usually let to students or professionals.",
    category: "flats-apartments",
    propertyCount: 214,
    status: "active",
    featured: false,
    createdAt: "2025-03-11",
  },
  {
    id: "pt-8",
    name: "Residential Plot",
    slug: "residential-plot",
    description: "Plots approved for residential construction.",
    category: "plots",
    propertyCount: 2810,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "pt-9",
    name: "Commercial Plot",
    slug: "commercial-plot",
    description: "Plots approved for shops, offices and plazas.",
    category: "plots",
    propertyCount: 1202,
    status: "active",
    featured: false,
    createdAt: "2025-01-12",
  },
  {
    id: "pt-10",
    name: "Agricultural Land",
    slug: "agricultural-land",
    description: "Farmland sold by acre or kanal.",
    category: "plots",
    propertyCount: 148,
    status: "inactive",
    featured: false,
    createdAt: "2025-04-02",
  },
  {
    id: "pt-11",
    name: "Shop",
    slug: "shop",
    description: "Retail units on main roads and inside plazas.",
    category: "commercial",
    propertyCount: 640,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "pt-12",
    name: "Office",
    slug: "office",
    description: "Office floors and suites in commercial buildings.",
    category: "commercial",
    propertyCount: 421,
    status: "active",
    featured: false,
    createdAt: "2025-01-12",
  },
  {
    id: "pt-13",
    name: "Warehouse",
    slug: "warehouse",
    description: "Storage space with loading access.",
    category: "commercial",
    propertyCount: 132,
    status: "active",
    featured: false,
    createdAt: "2025-03-28",
  },
  {
    id: "pt-14",
    name: "Food Court",
    slug: "food-court",
    description: "Food court units inside high-rise projects.",
    category: "high-raise-projects",
    propertyCount: 38,
    status: "active",
    featured: false,
    createdAt: "2025-06-09",
  },
];

/** Stands in for the database until the API exists. */
let propertyTypes: PropertyTypeRecord[] = [...seed];

/** Simulates request latency so loading states are exercised. */
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listPropertyTypes(): Promise<PropertyTypeRecord[]> {
  await delay();
  return [...propertyTypes];
}

export async function createPropertyType(
  input: PropertyTypeInput,
): Promise<PropertyTypeRecord> {
  await delay();

  const created: PropertyTypeRecord = {
    ...input,
    id: `pt-${Date.now()}`,
    propertyCount: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  propertyTypes = [created, ...propertyTypes];
  return created;
}

export async function updatePropertyType(
  id: string,
  input: PropertyTypeInput,
): Promise<PropertyTypeRecord> {
  await delay();

  const existing = propertyTypes.find((type) => type.id === id);
  if (!existing) throw new Error(`Property type not found: ${id}`);

  const updated: PropertyTypeRecord = { ...existing, ...input };
  propertyTypes = propertyTypes.map((type) =>
    type.id === id ? updated : type,
  );
  return updated;
}

export async function deletePropertyType(id: string): Promise<void> {
  await delay();
  propertyTypes = propertyTypes.filter((type) => type.id !== id);
}
