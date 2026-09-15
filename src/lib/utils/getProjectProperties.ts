import { featuredProperties } from "@/constants/mockProperties";
import type { Property } from "@/types/property";

/**
 * Returns the mock listings that belong to a project (via Property.project),
 * so the project detail page's "Properties in this Project" section shows a
 * real, filtered subset rather than the full listings array.
 */
export function getPropertiesByProject(projectSlug: string): Property[] {
  return featuredProperties.filter(
    (property) => property.project === projectSlug,
  );
}
