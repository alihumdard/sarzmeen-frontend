import type { City, Project, ProjectDetail } from "@/types/project";

/**
 * Placeholder media — every project and city points at the same file for now.
 * Drop your own image at this path and all cards pick it up; once the API is
 * wired in each record brings its own URL and these constants go away.
 */
const PROJECT_IMAGE = "/images/project-1.jpg";
const CITY_IMAGE = "/images/city-1.jpg";

/** Mock popular projects — replaced by the Laravel API in Phase 4. */
export const popularProjects: Project[] = [
  {
    id: "p1",
    slug: "dha-lahore",
    name: "DHA Lahore",
    city: "Lahore",
    category: "Residential Project",
    image: PROJECT_IMAGE,
    status: "Ready to Move",
    developer: "Defence Housing Authority",
    priceFrom: "Starting from PKR 1.2 Crore",
    verified: true,
    featured: true,
  },
  {
    id: "p2",
    slug: "bahria-town-karachi",
    name: "Bahria Town Karachi",
    city: "Karachi",
    category: "Residential Project",
    image: PROJECT_IMAGE,
    status: "Under Construction",
    developer: "Bahria Town Pvt. Ltd.",
    priceFrom: "Starting from PKR 85 Lac",
    verified: true,
    featured: true,
  },
  {
    id: "p3",
    slug: "blue-world-city",
    name: "Blue World City",
    city: "Islamabad",
    category: "Residential Project",
    image: PROJECT_IMAGE,
    status: "Under Construction",
    developer: "Blue Group of Companies",
    priceFrom: "Starting from PKR 18 Lac",
  },
  {
    id: "p4",
    slug: "capital-smart-city",
    name: "Capital Smart City",
    city: "Islamabad",
    category: "Residential Project",
    image: PROJECT_IMAGE,
    status: "Under Construction",
    developer: "Habib Rafiq Pvt. Ltd.",
    priceFrom: "Starting from PKR 22 Lac",
  },
  {
    id: "p5",
    slug: "park-view-city",
    name: "Park View City",
    city: "Islamabad",
    category: "Residential Project",
    image: PROJECT_IMAGE,
    status: "Ready to Move",
    developer: "Vision Group",
    priceFrom: "Starting from PKR 45 Lac",
  },
  {
    id: "p6",
    slug: "gulberg-greens",
    name: "Gulberg Greens",
    city: "Islamabad",
    category: "Residential Project",
    image: PROJECT_IMAGE,
    status: "Ready to Move",
    developer: "Gulberg Greens Developers",
    priceFrom: "Starting from PKR 60 Lac",
  },
  {
    id: "p7",
    slug: "lake-city-lahore",
    name: "Lake City Lahore",
    city: "Lahore",
    category: "Residential Project",
    image: PROJECT_IMAGE,
    status: "Ready to Move",
    developer: "Lake City Holdings",
    priceFrom: "Starting from PKR 55 Lac",
  },
  {
    id: "p8",
    slug: "emaar-oceanfront",
    name: "Emaar Oceanfront",
    city: "Karachi",
    category: "Commercial Project",
    image: PROJECT_IMAGE,
    status: "Launching Soon",
    developer: "Emaar Pakistan",
    priceFrom: "Starting from PKR 3.5 Crore",
  },
];

/** Total matching projects — drives the results count on the listing page. */
export const totalProjectCount = popularProjects.length;

/**
 * Mock detail record — replaced by the Laravel API in Phase 4.
 *
 * The listing pages look projects up by slug; a slug that matches one of the
 * records below resolves to real detail content, and any other slug falls
 * back to the DHA Lahore record with its name swapped in.
 */
export const projectDetails: Record<string, ProjectDetail> = {
  "dha-lahore": {
    ...popularProjects[0],
    fullLocation: "DHA Phase 1–9, Lahore, Punjab, Pakistan",
    images: [PROJECT_IMAGE, PROJECT_IMAGE, PROJECT_IMAGE, PROJECT_IMAGE],
    description:
      "DHA Lahore is one of Pakistan's most established gated communities, spanning multiple phases with modern infrastructure, parks and commercial hubs.",
    descriptionParagraphs: [
      "DHA Lahore is one of Pakistan's most established gated communities, spanning multiple phases across the city with modern infrastructure, wide roads and dedicated green belts.",
      "Each phase offers a mix of residential plots, built houses and commercial plazas, with strict building control and 24/7 security across the society.",
      "Its central location gives residents quick access to major landmarks, schools, hospitals and the Lahore Ring Road.",
    ],
    highlights: [
      "Gated community with 24/7 security",
      "Underground electricity and gas supply",
      "Wide carpeted roads with dedicated cycling tracks",
      "Multiple parks, mosques and commercial markets",
    ],
    amenities: [
      "24/7 Security",
      "Parks & Green Belts",
      "Mosque",
      "Commercial Market",
      "Underground Utilities",
      "Community Center",
      "Schools Nearby",
      "Hospital Nearby",
    ],
    paymentPlan: [
      { label: "Booking Amount", value: "10%" },
      { label: "Confirmation", value: "15%" },
      { label: "Quarterly Installments (8x)", value: "60%" },
      { label: "On Possession", value: "15%" },
    ],
    totalArea: "12,000+ Kanal",
    plotSizes: ["5 Marla", "10 Marla", "1 Kanal", "2 Kanal"],
    nearbyPlaces: [
      { name: "DHA Phase 6 Park", distance: "450 m", kind: "park" },
      { name: "Lahore Ring Road", distance: "1.2 km", kind: "road" },
      { name: "Allama Iqbal Airport", distance: "12.5 km", kind: "airport" },
      { name: "Packages Mall", distance: "6.8 km", kind: "mall" },
    ],
  },
  "bahria-town-karachi": {
    ...popularProjects[1],
    fullLocation: "Bahria Town, Karachi, Sindh, Pakistan",
    images: [PROJECT_IMAGE, PROJECT_IMAGE, PROJECT_IMAGE, PROJECT_IMAGE],
    description:
      "Bahria Town Karachi is a master-planned city offering residential plots, villas and apartments with resort-style amenities on the outskirts of Karachi.",
    descriptionParagraphs: [
      "Bahria Town Karachi is a master-planned city offering residential plots, villas and apartments with resort-style amenities on the outskirts of Karachi.",
      "The development features theme parks, a grand mosque, golf course and a dedicated commercial district, making it a self-contained city.",
      "Multiple precincts cater to different budgets, from affordable plots to premium villas along the boulevard.",
    ],
    highlights: [
      "Theme park and Grand Jamia Mosque",
      "18-hole golf course",
      "Dedicated commercial and business district",
      "Wide boulevards with landscaped medians",
    ],
    amenities: [
      "Theme Park",
      "Golf Course",
      "Grand Mosque",
      "Business District",
      "Hospital",
      "International Schools",
      "Sports Complex",
      "24/7 Security",
    ],
    paymentPlan: [
      { label: "Booking Amount", value: "15%" },
      { label: "Confirmation", value: "10%" },
      { label: "Monthly Installments (36x)", value: "60%" },
      { label: "On Possession", value: "15%" },
    ],
    totalArea: "8,000+ Acres",
    plotSizes: ["125 Sq. Yd", "250 Sq. Yd", "500 Sq. Yd", "1 Kanal"],
    nearbyPlaces: [
      { name: "Bahria Town Park", distance: "300 m", kind: "park" },
      { name: "Super Highway", distance: "2.1 km", kind: "road" },
      { name: "Jinnah International Airport", distance: "24 km", kind: "airport" },
      { name: "Bahria Town Mall", distance: "1.5 km", kind: "mall" },
    ],
  },
};

/**
 * Looks a project up by slug. Until the API exists every unmatched slug
 * resolves to the DHA Lahore record with its name swapped in, mirroring how
 * the property detail page handles unknown slugs.
 */
export function getProjectDetail(slug: string): ProjectDetail {
  if (projectDetails[slug]) return projectDetails[slug];

  const fallback = popularProjects.find((project) => project.slug === slug);
  const name =
    fallback?.name ??
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return {
    ...projectDetails["dha-lahore"],
    ...fallback,
    slug,
    name,
  };
}

/**
 * Popular towns/areas within Lahore, shown in the "Search by Area" grid.
 * Only Lahore is covered at launch, so this replaces a multi-city list.
 */
export const popularCities: City[] = [
  {
    id: "c1",
    slug: "bahria-town",
    name: "Bahria Town",
    propertyCount: "4,200+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c2",
    slug: "dha",
    name: "DHA Lahore",
    propertyCount: "5,800+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c3",
    slug: "johar-town",
    name: "Johar Town",
    propertyCount: "3,100+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c4",
    slug: "gulberg",
    name: "Gulberg",
    propertyCount: "2,600+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c5",
    slug: "model-town",
    name: "Model Town",
    propertyCount: "1,900+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c6",
    slug: "askari",
    name: "Askari",
    propertyCount: "1,400+ Properties",
    image: CITY_IMAGE,
  },
];
