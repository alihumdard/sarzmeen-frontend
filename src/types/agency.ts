/**
 * Agency shapes used by the public site.
 *
 * Sarzameen is a multi-vendor marketplace: an Agency registers, its owner
 * logs in, and the owner adds team members as agents. These types mirror
 * what the Laravel API is expected to return, so swapping the mock data for
 * a real response should not require touching the components.
 */

/** The person who registered the agency and administers its team. */
export type AgencyOwner = {
  name: string;
  /** Role shown under the owner's name, e.g. "Founder & CEO". */
  title: string;
  avatar: string;
  phone: string;
  email: string;
  /** Short intro shown on the agency detail page. */
  bio?: string;
  yearsExperience?: number;
};

/** A team member listed under the agency. */
export type AgencyTeamMember = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  phone?: string;
  /** Links to the existing agent profile page when this member has one. */
  agentSlug?: string;
};

export type Agency = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  /** Primary city, e.g. "Lahore". */
  city: string;
  /** Full street address shown on the detail page. */
  address: string;
  /** Areas the agency covers, e.g. ["DHA", "Gulberg"]. */
  locations: string[];
  description: string;
  /** Team size — the headline stat on the listing card. */
  totalAgents: number;
  propertiesForSale: number;
  propertiesForRent: number;
  phone: string;
  email: string;
  /** Badge text, e.g. "Authorized Dealer". */
  agencyType: string;
  verified: boolean;
  /** Year the agency was established. */
  establishedYear: number;
  owner: AgencyOwner;
};

/** Everything the detail page needs on top of the listing fields. */
export type AgencyDetail = Agency & {
  /** Longer copy, one entry per paragraph. */
  descriptionParagraphs: string[];
  /** Services offered, shown as a checklist. */
  services: string[];
  /** Property types the agency deals in. */
  propertyTypes: string[];
  team: AgencyTeamMember[];
  website?: string;
};
