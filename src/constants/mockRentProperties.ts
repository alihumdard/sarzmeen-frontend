import type { Property } from "@/types/property";
import { featuredProperties } from "@/constants/mockProperties";

/**
 * Mock rental listings — the rent-side twin of `featuredProperties`.
 *
 * Agents are borrowed from the sale listings rather than redefined here, so
 * there is still one source of truth per agent. Prices are monthly rent in
 * PKR, which is why they are orders of magnitude below the sale prices.
 *
 * Replaced by the Laravel API in Phase 4, same as the sale listings.
 */

const PROPERTY_IMAGE = "/images/property-1.jpg";

/** Pulls an agent out of the sale listings so profiles stay consistent. */
function agentOf(slug: string) {
  const match = featuredProperties.find(
    (property) => property.agent.slug === slug,
  );
  if (!match) throw new Error(`Unknown agent slug: ${slug}`);
  return match.agent;
}

export const rentProperties: Property[] = [
  {
    id: "r1",
    slug: "1-kanal-house-for-rent-dha-phase-6-lahore",
    title: "1 Kanal House for Rent",
    location: "DHA Phase 6, Lahore",
    project: "dha-lahore",
    purpose: "rent",
    price: 350000,
    area: "1 Kanal",
    beds: 5,
    baths: 6,
    image: PROPERTY_IMAGE,
    featured: true,
    verified: true,
    listedAgo: "1 day ago",
    description:
      "Fully renovated upper-tier house available on rent, ideal for a large family looking for space and security.",
    features: ["Lawn", "Garage", "Servant Quarter", "CCTV"],
    agent: agentOf("ali-hassan"),
  },
  {
    id: "r2",
    slug: "2-bed-apartment-for-rent-bahria-town-karachi",
    title: "2 Bed Apartment for Rent",
    location: "Bahria Town, Karachi",
    project: "bahria-town-karachi",
    purpose: "rent",
    price: 85000,
    area: "1200 Sqft",
    beds: 2,
    baths: 2,
    image: PROPERTY_IMAGE,
    featured: true,
    listedAgo: "2 days ago",
    description:
      "Bright apartment on a high floor with lift access, dedicated parking and 24/7 building security.",
    features: ["Parking", "Gym", "Lift", "Security"],
    agent: agentOf("usman-tariq"),
  },
  {
    id: "r3",
    slug: "10-marla-upper-portion-for-rent-johar-town-lahore",
    title: "10 Marla Upper Portion for Rent",
    location: "Johar Town, Lahore",
    purpose: "rent",
    price: 120000,
    area: "10 Marla",
    beds: 3,
    baths: 3,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "3 days ago",
    description:
      "Separate-entrance upper portion with its own meter, suited to a small family or working professionals.",
    features: ["Separate Entrance", "Parking", "Gas", "Water"],
    agent: agentOf("ayesha-malik"),
  },
  {
    id: "r4",
    slug: "3-marla-house-for-rent-al-kabir-town-lahore",
    title: "3 Marla House for Rent",
    location: "Al Kabir Town, Raiwind Road, Lahore",
    purpose: "rent",
    price: 45000,
    area: "3 Marla",
    beds: 3,
    baths: 3,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "4 days ago",
    description:
      "Affordable furnished house on a quiet street, close to schools and the main Raiwind Road access.",
    features: ["Garage", "Lawn", "Water", "Tiled Flooring"],
    agent: agentOf("ali-hassan"),
  },
  {
    id: "r5",
    slug: "1-bed-studio-flat-for-rent-gulberg-lahore",
    title: "1 Bed Studio Flat for Rent",
    location: "Gulberg III, Lahore",
    purpose: "rent",
    price: 38000,
    area: "650 Sqft",
    beds: 1,
    baths: 1,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "5 days ago",
    description:
      "Compact furnished studio in the heart of Gulberg, walking distance from cafes and offices.",
    features: ["Furnished", "Lift", "Security", "Backup Power"],
    agent: agentOf("usman-tariq"),
  },
  {
    id: "r6",
    slug: "commercial-office-for-rent-blue-area-islamabad",
    title: "Commercial Office for Rent",
    location: "Blue Area, Islamabad",
    purpose: "rent",
    price: 250000,
    area: "2000 Sqft",
    beds: null,
    baths: 2,
    image: PROPERTY_IMAGE,
    featured: true,
    listedAgo: "6 days ago",
    description:
      "Corner office floor with open-plan layout, reception area and two dedicated parking bays.",
    features: ["Lift", "Backup Power", "Parking", "Central AC"],
    agent: agentOf("ayesha-malik"),
  },
  {
    id: "r7",
    slug: "5-marla-lower-portion-for-rent-model-town-lahore",
    title: "5 Marla Lower Portion for Rent",
    location: "Model Town, Lahore",
    purpose: "rent",
    price: 65000,
    area: "5 Marla",
    beds: 2,
    baths: 2,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "1 week ago",
    description:
      "Ground-floor portion with a small lawn in one of Lahore's most established neighbourhoods.",
    features: ["Lawn", "Separate Entrance", "Gas", "Parking"],
    agent: agentOf("ali-hassan"),
  },
  {
    id: "r8",
    slug: "shop-for-rent-mm-alam-road-lahore",
    title: "Shop for Rent on MM Alam Road",
    location: "MM Alam Road, Gulberg, Lahore",
    purpose: "rent",
    price: 180000,
    area: "800 Sqft",
    beds: null,
    baths: 1,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "1 week ago",
    description:
      "Main-road retail space with a wide glass frontage and heavy footfall throughout the week.",
    features: ["Main Road", "Backup Power", "Washroom", "Security"],
    agent: agentOf("usman-tariq"),
  },
];

export const totalRentCount = rentProperties.length;
