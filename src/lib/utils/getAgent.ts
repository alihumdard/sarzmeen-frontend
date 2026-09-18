import { featuredProperties } from "@/constants/mockProperties";
import { demoAgents } from "@/data/agents";
import type { Agent, Property } from "@/types/property";

/** Grid shows this many cards so the portfolio section reads as a full page. */
const TARGET_LISTING_COUNT = 6;

/**
 * Looks an agent up by slug and returns their profile plus the listings
 * shown on their page. Falls back to demoAgents if not found in featuredProperties.
 */
export function getAgentBySlug(
  slug: string,
): { agent: Agent; ownListings: Property[]; listings: Property[] } | null {
  const ownListings = featuredProperties.filter(
    (property) => property.agent.slug === slug,
  );

  if (ownListings.length > 0) {
    const fill = featuredProperties.filter(
      (property) => property.agent.slug !== slug,
    );

    const listings = [
      ...ownListings,
      ...fill.slice(0, Math.max(0, TARGET_LISTING_COUNT - ownListings.length)),
    ];
    return { agent: ownListings[0].agent, ownListings, listings };
  }

  // Fallback to demoAgents if no featuredProperties match this slug
  const demoAgent = demoAgents.find((a) => a.slug === slug);
  if (!demoAgent) return null;

  const agentProfile: Agent = {
    id: demoAgent.id,
    slug: demoAgent.slug,
    name: demoAgent.name,
    title: demoAgent.agencyType || "Property Expert",
    avatar: demoAgent.logo || "/images/agent-1.jpg",
    phone: demoAgent.phone,
    whatsapp: demoAgent.phone.replace(/[^0-9]/g, ""),
    bio: demoAgent.description,
    yearsExperience: 6,
    dealsClosed: demoAgent.propertiesForSale + demoAgent.propertiesForRent,
    email: demoAgent.email,
    officeAddress: `${demoAgent.locations[0] || demoAgent.city}, ${demoAgent.city}`,
    specializations: demoAgent.propertyTypes.slice(0, 3),
    languages: ["English", "Urdu"],
  };

  let matchedProps = featuredProperties.filter(
    (p) => p.location.toLowerCase().includes(demoAgent.city.toLowerCase())
  );
  if (matchedProps.length === 0) {
    matchedProps = featuredProperties;
  }

  const ownListingsForDemo = matchedProps.slice(0, 2).map((p, idx) => ({
    ...p,
    id: `demo-${demoAgent.id}-${idx}`,
    location: `${demoAgent.locations[0] || demoAgent.city}, ${demoAgent.city}`,
    agent: agentProfile,
  }));

  const fill = featuredProperties.filter(
    (p) => !ownListingsForDemo.some((op) => op.id === p.id)
  );

  const listings = [
    ...ownListingsForDemo,
    ...fill.slice(0, Math.max(0, TARGET_LISTING_COUNT - ownListingsForDemo.length)),
  ].map((p) => ({
    ...p,
    agent: agentProfile,
  }));

  return {
    agent: agentProfile,
    ownListings: ownListingsForDemo,
    listings,
  };
}
