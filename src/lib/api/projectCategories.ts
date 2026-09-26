import type {
  ProjectCategory,
  ProjectCategoryInput,
} from "@/types/projectCategory";

/**
 * Project category API.
 *
 * This is the only file that knows where project categories come from. Each
 * function is async and returns what the Laravel endpoint is expected to
 * return, so wiring the real backend means replacing the body of each
 * function with a `fetch` — the page and modal calling them do not change.
 *
 *   listProjectCategories()        GET    /api/project-categories
 *   createProjectCategory(input)   POST   /api/project-categories
 *   updateProjectCategory(id, …)   PUT    /api/project-categories/{id}
 *   deleteProjectCategory(id)      DELETE /api/project-categories/{id}
 *
 * Until then an in-memory array stands in for the database, so adds, edits
 * and deletes behave like the real thing for the rest of the session.
 *
 * The seed matches the categories offered by the public projects filter
 * (see components/project/ProjectFilters.tsx), so both sides agree.
 */

const seed: ProjectCategory[] = [
  {
    id: "pc-1",
    name: "Residential Project",
    slug: "residential-project",
    description:
      "Housing societies and residential developments sold plot by plot.",
    projectCount: 34,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "pc-2",
    name: "Commercial Project",
    slug: "commercial-project",
    description: "Plazas, malls and office towers sold or let by unit.",
    projectCount: 18,
    status: "active",
    featured: true,
    createdAt: "2025-01-12",
  },
  {
    id: "pc-3",
    name: "Mixed-Use Project",
    slug: "mixed-use-project",
    description:
      "Developments combining apartments, shops and offices in one tower.",
    projectCount: 11,
    status: "active",
    featured: true,
    createdAt: "2025-02-08",
  },
  {
    id: "pc-4",
    name: "Farmhouse Society",
    slug: "farmhouse-society",
    description: "Gated farmhouse communities on the city outskirts.",
    projectCount: 6,
    status: "active",
    featured: false,
    createdAt: "2025-03-19",
  },
  {
    id: "pc-5",
    name: "Overseas Housing Scheme",
    slug: "overseas-housing-scheme",
    description:
      "Schemes reserved for overseas Pakistani buyers, with their own payment plans.",
    projectCount: 4,
    status: "active",
    featured: false,
    createdAt: "2025-04-02",
  },
  {
    id: "pc-6",
    name: "High Raise Project",
    slug: "high-raise-project",
    description: "Apartment towers with shops and food courts on lower floors.",
    projectCount: 9,
    status: "active",
    featured: false,
    createdAt: "2025-06-09",
  },
  {
    id: "pc-7",
    name: "Industrial Estate",
    slug: "industrial-estate",
    description: "Factory and warehouse plots in planned industrial zones.",
    projectCount: 2,
    status: "inactive",
    featured: false,
    createdAt: "2025-07-21",
  },
];

/** Stands in for the database until the API exists. */
let projectCategories: ProjectCategory[] = [...seed];

/** Simulates request latency so loading states are exercised. */
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listProjectCategories(): Promise<ProjectCategory[]> {
  await delay();
  return [...projectCategories];
}

export async function createProjectCategory(
  input: ProjectCategoryInput,
): Promise<ProjectCategory> {
  await delay();

  const created: ProjectCategory = {
    ...input,
    id: `pc-${Date.now()}`,
    projectCount: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  projectCategories = [created, ...projectCategories];
  return created;
}

export async function updateProjectCategory(
  id: string,
  input: ProjectCategoryInput,
): Promise<ProjectCategory> {
  await delay();

  const existing = projectCategories.find((category) => category.id === id);
  if (!existing) throw new Error(`Project category not found: ${id}`);

  const updated: ProjectCategory = { ...existing, ...input };
  projectCategories = projectCategories.map((category) =>
    category.id === id ? updated : category,
  );
  return updated;
}

export async function deleteProjectCategory(id: string): Promise<void> {
  await delay();
  projectCategories = projectCategories.filter(
    (category) => category.id !== id,
  );
}
