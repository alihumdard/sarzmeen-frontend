/**
 * Property shapes used by the public site.
 *
 * These mirror what the Laravel API is expected to return, so swapping mock
 * data for a real response later should not require touching the components.
 */

export type PropertyPurpose = "sale";

export type Agent = {
  id: string;
  /** URL-friendly identifier for the agent's profile page, e.g. "ali-hassan". */
  slug: string;
  name: string;
  /** Shown under the agent name on a property card. */
  title: string;
  avatar: string;
  /** Dial number for the call button on listing rows. */
  phone?: string;
  /** WhatsApp number in international format, digits only. */
  whatsapp?: string;
  /** Shows a verified tick beside the agent name on the detail page. */
  verified?: boolean;
  /** Short bio shown on the agent's profile page. */
  bio?: string;
  /** Years active as an agent, shown as a stat on the profile page. */
  yearsExperience?: number;
  /** Deals closed to date, shown as a stat on the profile page. */
  dealsClosed?: number;
  /** Contact email, shown on the profile page. */
  email?: string;
  /** Office/branch address, shown on the profile page. */
  officeAddress?: string;
  /** Property types the agent focuses on, e.g. ["Residential", "Plots"]. */
  specializations?: string[];
  /** Languages the agent can assist buyers in. */
  languages?: string[];
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  /** Display location, e.g. "DHA Phase 6, Lahore". */
  location: string;
  /** Slug of the Project this listing sits inside, if any (see types/project). */
  project?: string;
  purpose: PropertyPurpose;
  /** Price in PKR. */
  price: number;
  /** Plot/covered area as displayed, e.g. "1 Kanal", "1200 Sqft". */
  area: string;
  /** Null for plots, which have no bedrooms. */
  beds: number | null;
  /** Null for plots, which have no bathrooms. */
  baths: number | null;
  image: string;
  featured: boolean;
  agent: Agent;
  /** Marketing blurb shown under the specs on listing rows. */
  description?: string;
  /** Amenity chips, e.g. ["Lawn", "Garage", "CCTV"]. */
  features?: string[];
  /** Relative listing age as displayed, e.g. "3 days ago". */
  listedAgo?: string;
  /** Shows a verified tick beside the title. */
  verified?: boolean;
};

/** A landmark near the property, shown under the location map. */
export type NearbyPlace = {
  name: string;
  /** Distance as displayed, e.g. "450 m" or "1.2 km". */
  distance: string;
  /** Chooses the icon: park, road, airport or mall. */
  kind: "park" | "road" | "airport" | "mall";
};

/**
 * Everything the detail page shows on top of the listing fields.
 * Kept as a separate type so listing components stay unaffected.
 */
export type PropertyDetail = Property & {
  /** Full title used as the page heading. */
  headline: string;
  /** Location including province and country. */
  fullLocation: string;
  /** Public reference shown to buyers, e.g. "SZ-125478". */
  propertyId: string;
  /** View counter shown beside the listing date. */
  views: number;
  /** Gallery photos. The first is the opening slide. */
  images: string[];
  /** Total photos on the listing, including any not yet loaded. */
  photoCount: number;
  /** True when the seller will consider offers. */
  negotiable: boolean;
  livingRooms: number;
  kitchens: number;
  carParking: number;
  floors: number;
  /** e.g. "Ready to Move", "Under Construction". */
  propertyStatus: string;
  /** e.g. "Semi Furnished", "Furnished", "Unfurnished". */
  furnishing: string;
  /** e.g. "House", "Flat", "Residential Plot". */
  propertyType: string;
  /** Who published the listing, e.g. "Agent" or "Owner". */
  listedBy: string;
  /** ISO date the listing went live. */
  listedOn: string;
  /** Full description, one entry per paragraph. */
  descriptionParagraphs: string[];
  /** Selling points listed with ticks under the description. */
  highlights: string[];
  /** Landmarks shown under the location map. */
  nearbyPlaces: NearbyPlace[];
};
