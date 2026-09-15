import { featuredProperties } from "@/constants/mockProperties";
import type { Agent, Property } from "@/types/property";

/** Grid shows this many cards so the portfolio section reads as a full page. */
const TARGET_LISTING_COUNT = 6;

/**
 * Looks an agent up by slug and returns their profile plus the listings
 * shown on their page — there is no separate agents collection yet, so both
 * come from the same properties array until the API supplies one.
 *
 * Each mock agent currently "owns" only one property, so `listings` is the
 * agent's own listing(s) followed by other properties as fill, padding the
 * grid out to TARGET_LISTING_COUNT. `ownListings` is kept separate so the
 * page can still report an accurate "active listings" count.
 */
export function getAgentBySlug(
  slug: string,
): { agent: Agent; ownListings: Property[]; listings: Property[] } | null {
  const ownListings = featuredProperties.filter(
    (property) => property.agent.slug === slug,
  );

  if (ownListings.length === 0) return null;

  const fill = featuredProperties.filter(
    (property) => property.agent.slug !== slug,
  );

  const listings = [
    ...ownListings,
    ...fill.slice(0, Math.max(0, TARGET_LISTING_COUNT - ownListings.length)),
  ];

  return { agent: ownListings[0].agent, ownListings, listings };
}
