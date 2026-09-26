import type { Agency, AgencyDetail } from "@/types/agency";

/**
 * Mock agencies — replaced by the Laravel API in Phase 4.
 *
 * Team members point at the agent slugs used by `mockProperties`, so the
 * "View Profile" links on an agency page land on real agent pages.
 */

const AGENCY_LOGO = "/images/agent-1.jpg";
const MEMBER_AVATAR = "/images/team-1.jpg";

export const agencies: Agency[] = [
  {
    id: "ag-1",
    slug: "sarzmeen-estate-lahore",
    name: "Sarzmeen Estate",
    logo: AGENCY_LOGO,
    city: "Lahore",
    address: "Office 12, Commercial Broadway, DHA Phase 6, Lahore",
    locations: ["DHA", "Gulberg", "Cantt"],
    description:
      "A full-service agency handling premium residential and commercial deals across DHA and Gulberg, with an in-house legal team for transfers.",
    totalAgents: 24,
    propertiesForSale: 125,
    propertiesForRent: 34,
    phone: "+92 300 5551234",
    email: "info@sarzmeenestate.pk",
    agencyType: "Authorized Dealer",
    verified: true,
    establishedYear: 2012,
    owner: {
      name: "Ali Hassan",
      title: "Founder & CEO",
      avatar: MEMBER_AVATAR,
      phone: "+92 300 1234567",
      email: "ali.hassan@sarzmeen.com",
      bio: "Ali founded Sarzmeen Estate in 2012 after a decade in Lahore's residential market, and still personally handles the agency's largest transactions.",
      yearsExperience: 14,
    },
  },
  {
    id: "ag-2",
    slug: "capital-property-advisors-islamabad",
    name: "Capital Property Advisors",
    logo: AGENCY_LOGO,
    city: "Islamabad",
    address: "Suite 4, Kohistan Plaza, Blue Area, Islamabad",
    locations: ["Blue Area", "F-7", "DHA Phase 2"],
    description:
      "Specialists in luxury villas, farmhouses and high-yield commercial space across the twin cities, serving a largely overseas client base.",
    totalAgents: 18,
    propertiesForSale: 98,
    propertiesForRent: 42,
    phone: "+92 321 9876543",
    email: "contact@capitalproperty.pk",
    agencyType: "Premium Agency",
    verified: true,
    establishedYear: 2015,
    owner: {
      name: "Ayesha Malik",
      title: "Managing Director",
      avatar: MEMBER_AVATAR,
      phone: "+92 321 9876543",
      email: "ayesha.malik@sarzmeen.com",
      bio: "Ayesha leads a team focused on the twin cities' premium segment and has closed over 300 transactions for overseas Pakistani buyers.",
      yearsExperience: 11,
    },
  },
  {
    id: "ag-3",
    slug: "skyline-marketing-karachi",
    name: "Skyline Marketing",
    logo: AGENCY_LOGO,
    city: "Karachi",
    address: "3rd Floor, Ocean Tower, Clifton Block 9, Karachi",
    locations: ["Clifton", "DHA Karachi", "Bahria Town"],
    description:
      "Apartment and high-rise specialists working directly with developers on new launches along the Karachi coastline.",
    totalAgents: 31,
    propertiesForSale: 210,
    propertiesForRent: 88,
    phone: "+92 333 4445566",
    email: "hello@skylinemarketing.pk",
    agencyType: "Authorized Dealer",
    verified: true,
    establishedYear: 2010,
    owner: {
      name: "Usman Tariq",
      title: "Chief Executive",
      avatar: MEMBER_AVATAR,
      phone: "+92 333 4445566",
      email: "usman.tariq@sarzmeen.com",
      bio: "Usman built Skyline around Karachi's high-rise boom and now advises three of the city's largest developers on unit pricing.",
      yearsExperience: 16,
    },
  },
  {
    id: "ag-4",
    slug: "green-valley-realtors-lahore",
    name: "Green Valley Realtors",
    logo: AGENCY_LOGO,
    city: "Lahore",
    address: "Main Boulevard, Johar Town, Lahore",
    locations: ["Johar Town", "Model Town", "Wapda Town"],
    description:
      "Plot and file trading across Lahore's established societies, with a focus on first-time buyers and small investors.",
    totalAgents: 12,
    propertiesForSale: 76,
    propertiesForRent: 19,
    phone: "+92 302 7778899",
    email: "info@greenvalley.pk",
    agencyType: "Registered Agency",
    verified: false,
    establishedYear: 2018,
    owner: {
      name: "Bilal Ahmed",
      title: "Owner",
      avatar: MEMBER_AVATAR,
      phone: "+92 302 7778899",
      email: "bilal.ahmed@sarzmeen.com",
      bio: "Bilal started Green Valley to make plot investment approachable for salaried buyers, and the agency still specialises in small-ticket files.",
      yearsExperience: 8,
    },
  },
  {
    id: "ag-5",
    slug: "metro-estates-rawalpindi",
    name: "Metro Estates",
    logo: AGENCY_LOGO,
    city: "Rawalpindi",
    address: "Bank Road, Saddar, Rawalpindi",
    locations: ["Saddar", "Bahria Town", "Chaklala Scheme 3"],
    description:
      "Rental management and residential sales in Rawalpindi, handling end-to-end tenancy paperwork for landlords.",
    totalAgents: 15,
    propertiesForSale: 54,
    propertiesForRent: 96,
    phone: "+92 345 1122334",
    email: "contact@metroestates.pk",
    agencyType: "Registered Agency",
    verified: true,
    establishedYear: 2016,
    owner: {
      name: "Fatima Noor",
      title: "Founder",
      avatar: MEMBER_AVATAR,
      phone: "+92 345 1122334",
      email: "fatima.noor@sarzmeen.com",
      bio: "Fatima runs one of Rawalpindi's largest rental portfolios and handles tenancy agreements in-house.",
      yearsExperience: 9,
    },
  },
  {
    id: "ag-6",
    slug: "prime-square-multan",
    name: "Prime Square Estate",
    logo: AGENCY_LOGO,
    city: "Multan",
    address: "Bosan Road, Near Chungi No 9, Multan",
    locations: ["Bosan Road", "DHA Multan", "Gulgasht Colony"],
    description:
      "Multan's growing societies covered end to end, from plot booking through to possession and construction referrals.",
    totalAgents: 9,
    propertiesForSale: 41,
    propertiesForRent: 12,
    phone: "+92 311 5566778",
    email: "info@primesquare.pk",
    agencyType: "Registered Agency",
    verified: false,
    establishedYear: 2020,
    owner: {
      name: "Hamza Raza",
      title: "Owner",
      avatar: MEMBER_AVATAR,
      phone: "+92 311 5566778",
      email: "hamza.raza@sarzmeen.com",
      bio: "Hamza focuses on DHA Multan and the Bosan Road corridor, advising buyers relocating from smaller Punjab cities.",
      yearsExperience: 6,
    },
  },
];

/** Extra content shown only on an agency's own page. */
const agencyExtras: Record<
  string,
  Pick<
    AgencyDetail,
    "descriptionParagraphs" | "services" | "propertyTypes" | "team" | "website"
  >
> = {
  "sarzmeen-estate-lahore": {
    descriptionParagraphs: [
      "Sarzmeen Estate has operated out of DHA Phase 6 since 2012, covering residential and commercial property across Lahore's eastern corridor.",
      "The agency keeps an in-house legal team, so transfers, mutations and society paperwork are handled without sending clients elsewhere.",
      "Its 24 agents are split into dedicated sale, rental and commercial desks, each with its own area specialists.",
    ],
    services: [
      "Buying & Selling",
      "Rental Management",
      "Legal & Transfer Support",
      "Property Valuation",
      "Investment Advisory",
      "Construction Referrals",
    ],
    propertyTypes: ["House", "Flat", "Residential Plot", "Commercial Plot", "Office"],
    website: "https://sarzmeenestate.pk",
    team: [
      { id: "t1", name: "Ali Hassan", title: "Founder & CEO", avatar: MEMBER_AVATAR, phone: "+92 300 1234567", agentSlug: "ali-hassan" },
      { id: "t2", name: "Ayesha Malik", title: "Senior Consultant", avatar: MEMBER_AVATAR, phone: "+92 300 1234567", agentSlug: "ayesha-malik" },
      { id: "t3", name: "Sara Khan", title: "Rentals Lead", avatar: MEMBER_AVATAR, phone: "+92 300 1234567", agentSlug: "sara-khan" },
      { id: "t4", name: "Zain Abbas", title: "Commercial Specialist", avatar: MEMBER_AVATAR, phone: "+92 300 1234567", agentSlug: "zain-abbas" },
    ],
  },
  "capital-property-advisors-islamabad": {
    descriptionParagraphs: [
      "Capital Property Advisors works the twin cities' premium segment, with a client base that is largely overseas Pakistani.",
      "The agency handles remote transactions end to end, including video viewings, power-of-attorney paperwork and possession handover.",
      "Its portfolio leans towards luxury villas, farmhouses and Blue Area commercial floors.",
    ],
    services: [
      "Buying & Selling",
      "Overseas Client Services",
      "Property Valuation",
      "Investment Advisory",
      "Possession & Handover",
    ],
    propertyTypes: ["House", "Farm House", "Commercial Plot", "Building", "Shop"],
    website: "https://capitalproperty.pk",
    team: [
      { id: "t1", name: "Ayesha Malik", title: "Managing Director", avatar: MEMBER_AVATAR, phone: "+92 321 9876543", agentSlug: "ayesha-malik" },
      { id: "t2", name: "Usman Tariq", title: "Senior Consultant", avatar: MEMBER_AVATAR, phone: "+92 321 9876543", agentSlug: "usman-tariq" },
      { id: "t3", name: "Fatima Noor", title: "Client Relations", avatar: MEMBER_AVATAR, phone: "+92 321 9876543", agentSlug: "fatima-noor" },
    ],
  },
};

/** Fallback content for agencies without a hand-written entry above. */
function defaultExtras(agency: Agency) {
  return {
    descriptionParagraphs: [
      agency.description,
      `Established in ${agency.establishedYear}, the agency operates across ${agency.locations.join(", ")} with a team of ${agency.totalAgents} agents.`,
    ],
    services: [
      "Buying & Selling",
      "Rental Management",
      "Property Valuation",
      "Investment Advisory",
    ],
    propertyTypes: ["House", "Flat", "Residential Plot", "Commercial Plot"],
    team: [
      {
        id: "t1",
        name: agency.owner.name,
        title: agency.owner.title,
        avatar: agency.owner.avatar,
        phone: agency.owner.phone,
      },
    ],
  };
}

/** Looks an agency up by slug, or returns null when there is no match. */
export function getAgencyBySlug(slug: string): AgencyDetail | null {
  const agency = agencies.find((item) => item.slug === slug);
  if (!agency) return null;

  return { ...agency, ...(agencyExtras[slug] ?? defaultExtras(agency)) };
}

export const totalAgencyCount = agencies.length;
