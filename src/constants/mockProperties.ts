import type { Property } from "@/types/property";

/**
 * Placeholder media.
 *
 * Every card points at the same two files for now. Drop your own images at
 * these paths and all cards pick them up; once the API is wired in, each
 * property brings its own image/avatar URL and these constants go away.
 */
const PROPERTY_IMAGE = "/images/property-1.jpg";
const AGENT_AVATAR = "/images/agent-1.jpg";

const AGENT_PHONE = "+92 300 1234567";
const AGENT_WHATSAPP = "923001234567";

/** Mock listings — replaced by the Laravel API in Phase 4. */
export const featuredProperties: Property[] = [
  {
    id: "1",
    slug: "1-kanal-luxury-house-dha-phase-6-lahore",
    title: "1 Kanal Luxury House",
    location: "DHA Phase 6, Lahore",
    purpose: "sale",
    price: 125000000,
    area: "1 Kanal",
    beds: 5,
    baths: 6,
    image: PROPERTY_IMAGE,
    featured: true,
    verified: true,
    listedAgo: "1 day ago",
    description:
      "Beautifully designed luxury house with modern architecture and premium quality fittings.",
    features: ["Lawn", "Garage", "Servant Quarter", "CCTV"],
    agent: {
      id: "a1",
      name: "Ali Hassan",
      title: "Property Expert",
      avatar: AGENT_AVATAR,
      phone: AGENT_PHONE,
      whatsapp: AGENT_WHATSAPP,
    },
  },
  {
    id: "2",
    slug: "2-bed-apartment-in-bahria-town-karachi",
    title: "2 Bed Apartment in Bahria Town",
    location: "Bahria Town, Karachi",
    purpose: "sale",
    price: 18500000,
    area: "1200 Sqft",
    beds: 2,
    baths: 2,
    image: PROPERTY_IMAGE,
    featured: true,
    listedAgo: "3 days ago",
    description:
      "Spacious apartment with amazing view and all modern amenities in a secure society.",
    features: ["Parking", "Gym", "Lift", "Security"],
    agent: {
      id: "a2",
      name: "Usman Tariq",
      title: "Property Expert",
      avatar: AGENT_AVATAR,
      phone: AGENT_PHONE,
      whatsapp: AGENT_WHATSAPP,
    },
  },
  {
    id: "3",
    slug: "5-marla-residential-plot-dha-phase-9-lahore",
    title: "5 Marla Residential Plot",
    location: "DHA Phase 9, Lahore",
    purpose: "sale",
    price: 17500000,
    area: "5 Marla",
    beds: null,
    baths: null,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "3 days ago",
    description:
      "Ideal location plot with possession and all dues clear. Ready for construction.",
    features: ["Possession", "Electricity", "Water", "Gas"],
    agent: {
      id: "a3",
      name: "Ayesha Malik",
      title: "Property Expert",
      avatar: AGENT_AVATAR,
      phone: AGENT_PHONE,
      whatsapp: AGENT_WHATSAPP,
    },
  },
  {
    id: "4",
    slug: "3-marla-house-for-sale-al-kabir-town-lahore",
    title: "3 Marla House for Sale",
    location: "Al Kabir Town, Raiwind Road, Lahore",
    purpose: "sale",
    price: 6500000,
    area: "3 Marla",
    beds: 3,
    baths: 3,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "4 days ago",
    description:
      "Fresh constructed 3 Marla house with modern interior and prime location.",
    features: ["Garage", "Lawn", "Water", "Tiled Flooring"],
    agent: {
      id: "a4",
      name: "Zain Abbas",
      title: "Property Expert",
      avatar: AGENT_AVATAR,
      phone: AGENT_PHONE,
      whatsapp: AGENT_WHATSAPP,
    },
  },
  {
    id: "5",
    slug: "2-kanal-commercial-plaza-main-boulevard-gulberg",
    title: "2 Kanal Commercial Plaza",
    location: "Main Boulevard, Gulberg, Lahore",
    purpose: "sale",
    price: 280000000,
    area: "2 Kanal",
    beds: null,
    baths: 8,
    image: PROPERTY_IMAGE,
    featured: true,
    listedAgo: "5 days ago",
    description:
      "A beautifully built 5 storey commercial plaza available for sale in the heart of Gulberg. High rental income.",
    features: ["Elevator", "Parking", "Power Backup", "Security"],
    agent: {
      id: "a5",
      name: "Hamza Raza",
      title: "Property Expert",
      avatar: AGENT_AVATAR,
      phone: AGENT_PHONE,
      whatsapp: AGENT_WHATSAPP,
    },
  },
  {
    id: "6",
    slug: "3-bedroom-portion-gulberg-islamabad",
    title: "3 Bedroom Portion",
    location: "Gulberg, Islamabad",
    purpose: "sale",
    price: 21000000,
    area: "1800 Sqft",
    beds: 3,
    baths: 3,
    image: PROPERTY_IMAGE,
    featured: true,
    listedAgo: "6 days ago",
    description:
      "Well maintained upper portion available for sale in a quiet residential block.",
    features: ["Separate Entrance", "Parking", "Backup"],
    agent: {
      id: "a6",
      name: "Sara Khan",
      title: "Property Expert",
      avatar: AGENT_AVATAR,
      phone: AGENT_PHONE,
      whatsapp: AGENT_WHATSAPP,
    },
  },
  {
    id: "7",
    slug: "10-marla-house-bahria-town-rawalpindi",
    title: "10 Marla House",
    location: "Bahria Town, Rawalpindi",
    purpose: "sale",
    price: 42000000,
    area: "10 Marla",
    beds: 4,
    baths: 4,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "1 week ago",
    description:
      "Double storey house in a developed block, close to parks and commercial area.",
    features: ["Lawn", "Garage", "Servant Quarter"],
    agent: {
      id: "a7",
      name: "Bilal Ahmed",
      title: "Property Expert",
      avatar: AGENT_AVATAR,
      phone: AGENT_PHONE,
      whatsapp: AGENT_WHATSAPP,
    },
  },
  {
    id: "8",
    slug: "commercial-office-blue-area-islamabad",
    title: "Commercial Office",
    location: "Blue Area, Islamabad",
    purpose: "sale",
    price: 95000000,
    area: "2400 Sqft",
    beds: null,
    baths: 2,
    image: PROPERTY_IMAGE,
    featured: false,
    listedAgo: "1 week ago",
    description:
      "Furnished office floor with lift access and dedicated parking in Blue Area.",
    features: ["Lift", "Parking", "Furnished", "Security"],
    agent: {
      id: "a8",
      name: "Fatima Noor",
      title: "Property Expert",
      avatar: AGENT_AVATAR,
      phone: AGENT_PHONE,
      whatsapp: AGENT_WHATSAPP,
    },
  },
];

/** Total matching listings — drives the results count and pagination. */
export const totalPropertyCount = 13843;

/** Chips under the listing search bar. */
export const popularSearches = [
  { label: "DHA Lahore", href: "/properties?city=lahore&location=dha" },
  { label: "Bahria Town", href: "/properties?location=bahria-town" },
  { label: "5 Marla House", href: "/properties?type=house&area=5-marla" },
  { label: "10 Marla Plot", href: "/properties?type=residential-plot" },
  { label: "1 Kanal House", href: "/properties?type=house&area=1-kanal" },
  { label: "Commercial Property", href: "/properties?type=commercial-plot" },
];
