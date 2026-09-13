import type { City, Project } from "@/types/project";

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
  },
  {
    id: "p2",
    slug: "bahria-town-karachi",
    name: "Bahria Town Karachi",
    city: "Karachi",
    category: "Residential Project",
    image: PROJECT_IMAGE,
  },
  {
    id: "p3",
    slug: "blue-world-city",
    name: "Blue World City",
    city: "Islamabad",
    category: "Residential Project",
    image: PROJECT_IMAGE,
  },
  {
    id: "p4",
    slug: "capital-smart-city",
    name: "Capital Smart City",
    city: "Islamabad",
    category: "Residential Project",
    image: PROJECT_IMAGE,
  },
  {
    id: "p5",
    slug: "park-view-city",
    name: "Park View City",
    city: "Islamabad",
    category: "Residential Project",
    image: PROJECT_IMAGE,
  },
  {
    id: "p6",
    slug: "gulberg-greens",
    name: "Gulberg Greens",
    city: "Islamabad",
    category: "Residential Project",
    image: PROJECT_IMAGE,
  },
  {
    id: "p7",
    slug: "lake-city-lahore",
    name: "Lake City Lahore",
    city: "Lahore",
    category: "Residential Project",
    image: PROJECT_IMAGE,
  },
  {
    id: "p8",
    slug: "emaar-oceanfront",
    name: "Emaar Oceanfront",
    city: "Karachi",
    category: "Commercial Project",
    image: PROJECT_IMAGE,
  },
];

/** Cities shown in the "Property Search by City" grid. */
export const popularCities: City[] = [
  {
    id: "c1",
    slug: "lahore",
    name: "Lahore",
    propertyCount: "12,500+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c2",
    slug: "islamabad",
    name: "Islamabad",
    propertyCount: "8,750+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c3",
    slug: "karachi",
    name: "Karachi",
    propertyCount: "15,200+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c4",
    slug: "rawalpindi",
    name: "Rawalpindi",
    propertyCount: "6,300+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c5",
    slug: "faisalabad",
    name: "Faisalabad",
    propertyCount: "3,300+ Properties",
    image: CITY_IMAGE,
  },
  {
    id: "c6",
    slug: "multan",
    name: "Multan",
    propertyCount: "2,800+ Properties",
    image: CITY_IMAGE,
  },
];
