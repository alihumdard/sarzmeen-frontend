import type { Project } from "@/types/project";

export type ProjectSearchParams = {
  location?: string;
  city?: string;
  status?: string;
  category?: string;
};

/**
 * Filters the mock project array against the search params carried in the
 * URL, mirroring filterProperties so both listing pages behave the same way.
 */
export function filterProjects(
  projects: Project[],
  params: ProjectSearchParams,
): Project[] {
  let results = projects;

  const locationQuery = params.location?.trim().toLowerCase();
  if (locationQuery) {
    results = results.filter(
      (project) =>
        project.name.toLowerCase().includes(locationQuery) ||
        project.city.toLowerCase().includes(locationQuery),
    );
  }

  if (params.city) {
    const cityQuery = params.city.trim().toLowerCase();
    results = results.filter((project) =>
      project.city.toLowerCase().includes(cityQuery),
    );
  }

  if (params.status) {
    results = results.filter(
      (project) => project.status.toLowerCase() === params.status?.toLowerCase(),
    );
  }

  if (params.category) {
    const categoryQuery = params.category.trim().toLowerCase();
    results = results.filter((project) =>
      project.category.toLowerCase().includes(categoryQuery),
    );
  }

  return results;
}
