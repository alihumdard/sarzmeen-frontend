import type { PropertyDetail } from "@/types/property";

/**
 * Placeholder media — the gallery repeats the same file for now. Drop your
 * own photos at these paths and every slide picks them up; once the API is
 * wired in each property brings its own image URLs.
 */
const PROPERTY_IMAGE = "/images/property-1.jpg";
const AGENT_AVATAR = "/images/team-1.jpg";

/**
 * Mock detail record — replaced by the Laravel API in Phase 4.
 *
 * The listing pages look properties up by slug; until the API exists, every
 * slug resolves to this record with its title swapped in.
 */
export const propertyDetail: PropertyDetail = {
  id: "1",
  slug: "1-kanal-luxury-house-dha-phase-6-lahore",
  title: "1 Kanal Luxury House",
  headline: "1 Kanal Luxury House in DHA Phase 6, Lahore",
  location: "DHA Phase 6, Lahore",
  fullLocation: "DHA Phase 6, Lahore, Punjab, Pakistan",
  propertyId: "SZ-125478",
  purpose: "sale",
  price: 125000000,
  negotiable: true,
  area: "1 Kanal",
  beds: 5,
  baths: 6,
  livingRooms: 2,
  kitchens: 2,
  carParking: 2,
  floors: 2,
  views: 2458,
  listedAgo: "1 day ago",
  listedOn: "2024-05-16",
  propertyStatus: "Ready to Move",
  furnishing: "Semi Furnished",
  propertyType: "House",
  listedBy: "Agent",
  featured: true,
  verified: true,
  image: PROPERTY_IMAGE,
  images: Array.from({ length: 5 }, () => PROPERTY_IMAGE),
  photoCount: 28,
  description:
    "A beautifully designed 1 Kanal luxury house located in the heart of DHA Phase 6, Lahore.",
  descriptionParagraphs: [
    "A beautifully designed 1 Kanal luxury house located in the heart of DHA Phase 6, Lahore.",
    "This modern home offers the perfect blend of elegance, comfort, and functionality.",
    "Built with high-quality materials and exceptional attention to detail.",
  ],
  highlights: [
    "Solid construction with premium quality materials",
    "Spacious bedrooms with attached bathrooms",
    "Modern kitchens with imported fittings",
    "Beautifully designed TV lounge and drawing room",
    "Lush green lawn and landscaped garden",
    "Servant quarter with independent entrance",
  ],
  nearbyPlaces: [
    { name: "DHA Phase 6 Park", distance: "450 m", kind: "park" },
    { name: "Lahore Ring Road", distance: "1.2 km", kind: "road" },
    { name: "Allama Iqbal Airport", distance: "12.5 km", kind: "airport" },
    { name: "Packages Mall", distance: "6.8 km", kind: "mall" },
  ],
  features: ["Lawn", "Garage", "Servant Quarter", "CCTV"],
  agent: {
    id: "a1",
    slug: "ali-hassan",
    name: "Ali Hassan",
    title: "Property Expert",
    avatar: AGENT_AVATAR,
    phone: "+92 300 1234567",
    whatsapp: "923001234567",
    verified: true,
  },
};
