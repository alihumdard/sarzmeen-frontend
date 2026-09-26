import type { Category, CategoryInput } from "@/types/category";

/**
 * Category API.
 *
 * This is the only file that knows where categories come from. Each function
 * is async and returns what the Laravel endpoint is expected to return, so
 * wiring the real backend means replacing the body of each function with a
 * `fetch` — the page and modal calling them do not change.
 *
 *   listCategories()        GET    /api/categories
 *   createCategory(input)   POST   /api/categories
 *   updateCategory(id, …)   PUT    /api/categories/{id}
 *   deleteCategory(id)      DELETE /api/categories/{id}
 *
 * Until then an in-memory array stands in for the database, so adds, edits
 * and deletes behave like the real thing for the rest of the session.
 */

const seed: Category[] = [
  {
    id: "cat-1",
    name: "Houses",
    slug: "houses",
    description: "Independent houses, villas and bungalows.",
    parent: null,
    propertyCount: 5299,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "cat-2",
    name: "Flats & Apartments",
    slug: "flats-apartments",
    description: "Apartments, flats and penthouses in residential buildings.",
    parent: null,
    propertyCount: 1952,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "cat-3",
    name: "Upper Portion",
    slug: "upper-portion",
    description: "Upper floors let or sold separately from the main house.",
    parent: "houses",
    propertyCount: 684,
    status: "active",
    featured: false,
    createdAt: "2025-02-03",
  },
  {
    id: "cat-4",
    name: "Lower Portion",
    slug: "lower-portion",
    description: "Ground floors let or sold separately from the main house.",
    parent: "houses",
    propertyCount: 512,
    status: "active",
    featured: false,
    createdAt: "2025-02-03",
  },
  {
    id: "cat-5",
    name: "Plots",
    slug: "plots",
    description: "Residential, commercial and agricultural land.",
    parent: null,
    propertyCount: 4012,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "cat-6",
    name: "Residential Plot",
    slug: "residential-plot",
    description: "Plots approved for residential construction.",
    parent: "plots",
    propertyCount: 2810,
    status: "active",
    featured: false,
    createdAt: "2025-02-18",
  },
  {
    id: "cat-7",
    name: "Commercial Plot",
    slug: "commercial-plot",
    description: "Plots approved for shops, offices and plazas.",
    parent: "plots",
    propertyCount: 1202,
    status: "active",
    featured: false,
    createdAt: "2025-02-18",
  },
  {
    id: "cat-8",
    name: "Commercial",
    slug: "commercial",
    description: "Shops, offices, warehouses and factories.",
    parent: null,
    propertyCount: 1299,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "cat-9",
    name: "Shops",
    slug: "shops",
    description: "Retail units on main roads and inside plazas.",
    parent: "commercial",
    propertyCount: 640,
    status: "active",
    featured: false,
    createdAt: "2025-03-05",
  },
  {
    id: "cat-10",
    name: "Offices",
    slug: "offices",
    description: "Office floors and suites in commercial buildings.",
    parent: "commercial",
    propertyCount: 421,
    status: "active",
    featured: false,
    createdAt: "2025-03-05",
  },
  {
    id: "cat-11",
    name: "Farm Houses",
    slug: "farm-houses",
    description: "Farmhouses and country properties on large plots.",
    parent: null,
    propertyCount: 168,
    status: "inactive",
    featured: false,
    createdAt: "2025-04-21",
  },
  {
    id: "cat-12",
    name: "High Raise Projects",
    slug: "high-raise-projects",
    description: "Apartments, shops and food courts inside towers.",
    parent: null,
    propertyCount: 96,
    status: "active",
    featured: false,
    createdAt: "2025-06-09",
  },
];

/** Stands in for the database until the API exists. */
let categories: Category[] = [...seed];

/** Simulates request latency so loading states are exercised. */
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listCategories(): Promise<Category[]> {
  await delay();
  return [...categories];
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  await delay();

  const created: Category = {
    ...input,
    id: `cat-${Date.now()}`,
    propertyCount: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  categories = [created, ...categories];
  return created;
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<Category> {
  await delay();

  const existing = categories.find((category) => category.id === id);
  if (!existing) throw new Error(`Category not found: ${id}`);

  const updated: Category = { ...existing, ...input };
  categories = categories.map((category) =>
    category.id === id ? updated : category,
  );
  return updated;
}

export async function deleteCategory(id: string): Promise<void> {
  await delay();
  categories = categories.filter((category) => category.id !== id);
}

/** Builds a slug from a name, matching what the API would generate. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
